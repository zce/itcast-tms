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

app.get('/favicon.ico', (req, res) => {
  // res.sendFile(path.resolve(__dirname, '../../assets/app.ico'));
  res.sendStatus(404);
});

app.get('/:stamp', (req, res) => {

  const { stamp } = req.params;
  const data = storage.get(stamp);

  if (!data || data.status !== options.status_keys.rating) {
    res.sendStatus(404);
    return false;
  }

  const qkeys = Object.keys(data.questions);
  data.qkey = qkeys[qkeys.length - 1];
  data.title = options.front_title;
  res.render('rating', data);

});

app.post('/r/:stamp', (req, res) => {
  res.send('ok');
});


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
