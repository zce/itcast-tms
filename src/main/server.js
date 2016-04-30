const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const _ = require('underscore');

const options = require('./config');
const storage = require('../common/storage');

const app = express();
const root = path.resolve(__dirname, 'rating');
app.set('view engine', 'xtpl');
app.set('views', root);

app.use(express.static(root));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.set('X-Powered-By', 'WEDN.NET');
  next();
});

app.use((req, res, next) => {
  // 注入请求客户端IP
  req.clientIp = new Date().getTime() ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress || '::1';
  // req.connection.socket.remoteAddress || '::1';
  // 注入是否本地请求
  req.isLocal = '127.0.0.1' === req.clientIp || options.server_ip === req.clientIp
  next();
})

// app.get('/favicon.ico', (req, res) => {
//   // res.sendFile(path.resolve(__dirname, '../../assets/app.ico'));
//   res.sendStatus(404);
// });


app.get(`/:stamp(\\w{${options.stamp_length}})`, (req, res) => {

  const { stamp } = req.params;
  const data = storage.get(stamp);

  if (!data || data.status !== options.status_keys.rating) {
    res.sendStatus(404);
    return false;
  }

  const rule_keys = Object.keys(data.rules);
  data.rule_key = rule_keys[rule_keys.length - 1];
  data.stamp = stamp;

  res.render('rating', data);

});

app.post(`/r/:stamp(\\w{${options.stamp_length}})`, (req, res) => {

  if (req.isLocal && !options.allow_admin_rating) {
    res.render('rated', { error: true, message: '您是管理员，不允许参加测评！' });
    return false;
  }

  const { stamp } = req.params;
  const data = storage.get(stamp);

  if (!data) {
    res.sendStatus(404);
    return false;
  }

  if (data.status !== options.status_keys.rating) {
    res.render('rated', { error: true, message: '测评已经结束，不可以继续评价了！' });
    return false;
  }

  // console.log(req.clientIp);
  if (data.rated_info[req.clientIp] && !options.allow_student_repeat) {
    res.render('rated', { error: true, message: '你已经评价过了，不可以重复评价！' });
    return false;
  }

  // 存储
  const info = convert(stamp, req.body);
  // console.log(info);
  if (!info) {
    res.render('rated', { error: true, stamp: stamp, message: '同学，请完整勾选表单选项！' });
    return false;
  }

  data.rated_info[req.clientIp] = info;
  data.rated_count++;

  // console.log(data);

  storage.set(stamp, data);

  res.render('rated', { error: false, message: '谢谢你的帮助，我们会及时将情况反馈给相关人员！' });

});

function convert(stamp, body) {
  const rateData = {
    note: body.note,
    marks: {}
  };
  const rules = storage.get(stamp).rules;

  let validated = true;
  for (const version in rules) {
    rateData.marks[version] = {};
    for (const id in body) {
      if ('note' == id) {
        continue;
      }
      rateData.marks[version][id] = {
        back: 0,
        front: 0
      };
      const score = rules[version].questions[id].answers[body[id]].score;
      rateData.marks[version][id].back = score.back;
      rateData.marks[version][id].front = score.front;
    }
    if (Object.keys(rateData.marks[version]).length !== rules[version].questions.length) {
      validated = false;
    }
  }

  return validated ? rateData : null;
}










// 启动服务
const server = options.server = app.listen(options.server_port, options.server_ip, err => {
  if (err) {
    options.logger.main.error(err);
    return false;
  }
  const link = `http://${server.address().address}:${server.address().port}/`;
  options.logger.main.info(`server run @ ${link}`);
  options.server_link = link;
});
