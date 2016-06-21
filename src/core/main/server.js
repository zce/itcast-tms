/**
 * 后台HTTP服务
 */
const express = require('express')
const bodyParser = require('body-parser')

const options = require('./config')
const storage = require('../common/storage')
const logger = require('../common/logger').main
const stampFormat = '\\w{' + options.stamp_length + '}'

const app = express()

app.set('view engine', 'xtpl')
app.set('views', options.static_root)

app.use(express.static(options.static_root))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.set('X-Powered-By', 'WEDN.NET')
  next()
})

app.use((req, res, next) => {
  // 注入请求客户端IP
  if (process.env.NODE_ENV === 'production') {
    req.clientIp = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  } else {
    // 测试允许多次提交
    req.clientIp = new Date().getTime()
  }
  // req.connection.socket.remoteAddress || '::1'
  // 注入是否本地请求
  req.isLocal = req.clientIp === '127.0.0.1' || req.clientIp === options.server_ip

  next()
})

/**
 * GET /:stamp
 */
app.get(`/:stamp(${stampFormat})`, (req, res) => {
  const { stamp } = req.params
  const data = storage.get(stamp)

  if (!data || data.status !== options.status_keys.rating) {
    res.sendStatus(404)
    return false
  }

  const ruleKeys = Object.keys(data.rules)
  data.rule_key = ruleKeys.length && ruleKeys[ruleKeys.length - 1]

  res.render('rating', data)
})

/**
 * POST /r/:stamp
 */
app.post(`/r/:stamp(${stampFormat})`, (req, res) => {
  if (req.isLocal && !options.allow_admin_rating) {
    res.render('rated', { error: true, message: '您是管理员，不允许参加测评！' })
    return false
  }

  const { stamp } = req.params
  const data = storage.get(stamp)

  if (!data) {
    res.sendStatus(404)
    return false
  }

  if (data.status !== options.status_keys.rating) {
    res.render('rated', { error: true, message: '测评已经结束，不可以继续评价了！' })
    return false
  }

  if (data.rated_info[req.clientIp] && !options.allow_student_repeat) {
    res.render('rated', { error: true, message: '你已经评价过了，不可以重复评价！' })
    return false
  }

  // 存储
  const info = convert(stamp, req.body)
  if (!info) {
    res.render('rated', { error: true, stamp: stamp, message: '同学，请完整勾选表单选项！' })
    return false
  }

  data.rated_info[req.clientIp] = info
  data.rated_count++

  storage.set(stamp, data)

  res.render('rated', { error: false, message: '谢谢你的帮助，我们会及时将情况反馈给相关人员！' })
})

function convert (stamp, body) {
  const rateData = {
    note: body.note,
    marks: {}
  }
  const rules = storage.get(stamp).rules

  let validated = true
  for (let version in rules) {
    rateData.marks[version] = {}
    for (let id in body) {
      if (id === 'note') {
        continue
      }
      rateData.marks[version][id] = {
        back: 0,
        front: 0
      }
      const score = rules[version].questions[id].answers[body[id]].score
      rateData.marks[version][id].back = score.back
      rateData.marks[version][id].front = score.front
    }
    if (Object.keys(rateData.marks[version]).length !== rules[version].questions.length) {
      validated = false
    }
  }

  return validated ? rateData : null
}

// 启动服务
const server = options.server = app.listen(options.server_port, options.server_ip, error => {
  if (error) return logger.fatal(error)
  const addr = server.address()
  const link = `http://${addr.address}:${addr.port}/`
  console.log(`server run @ ${link}`)
  options.server_link = link
})
