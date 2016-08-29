/* eslint no-template-curly-in-string: "off" */
import path from 'path'
import electron from 'electron'
import pkg from '../package.json'

const app = electron.app || electron.remote.app

const config = {}

// app info
config.app = {
  name: app.getName(),
  path: app.getAppPath(),
  version: pkg.version,
  updated: pkg.updated,
  description: pkg.description
}

// storage config
config.storage = {
  root: path.resolve(config.app.path, '..', 'data'),
  ext: '.dat',
  sign: `© ${new Date().getFullYear()} WEDN.NET`
}

// log4js appender config
const logFile = path.resolve(config.app.path, '..', pkg.name + '.log')
config.log4js = [
  { type: 'file', filename: logFile, category: 'main' },
  { type: 'file', filename: logFile, category: 'renderer' }
]

// server config
config.server = {
  address: '',
  port: 20801
}

// mail config
config.mail = {
  transport: 'smtps://pingfen%40itcast.cn:123456A@smtp.263.net?connectionTimeout=1000&greetingTimeout=1000&socketTimeout=5000',
  from: '助教测评系统 « 传智播客·黑马程序员 <pingfen@itcast.cn>',
  subject: '❈ 助教测评报告：${data.teacher_name}老师（${data.course_name}）'
}

// status keys
config.status_keys = {
  initial: '尚未开始统计',
  rating: '统计中',
  rated: '统计完成 - 待发邮件',
  sending: '邮件发送中',
  send: '邮件发送完成'
}

export default Object.assign(config, {
  stamp_length: 8,
  allow_admin_rating: true,
  allow_student_repeat: false
})
