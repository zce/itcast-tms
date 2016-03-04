/**
 * 核心入口文件
 * @Author: iceStone
 * @Date:   2015-11-25 22:37:51
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-20 10:59:42
 */

const start = (callback) => {

  const Koa = require('koa');
  const co = require('co');
  const convert = require('koa-convert');
  const app = new Koa();

  // 错误提示
  const onerror = require('koa-onerror');
  onerror(app);

  /**
   * 更新系统配置文件
   */
  const update = require('./middlewares/update');
  app.use(update);

  /**
   * 配置注入中间件，方便调用配置信息
   */
  const config = require('./config');
  app.use(config.inject());

  /**
   * 静态文件
   */
  const serve = require('koa-static');
  app.use(convert(serve(config.system.static_root)));

  /**
   * 缓存中间件
   */
  const cache = require('./middlewares/cache');
  app.use(cache(config.system.temp_root));

  /**
   * IP中间件
   */
  const ip = require('./middlewares/ip');
  app.use(ip.inject());

  /**
   * 模板引擎配置
   */
  const view = require('./middlewares/view');
  app.use(view(config.system.view_root));

  /**
   * JsonResult
   */
  const json = require('./middlewares/json');
  app.use(json());

  const auth = require('./middlewares/auth');
  app.use(auth);

  /**
   * 表单数据解析
   */
  const bodyParser = require('koa-bodyparser');
  app.use(bodyParser());

  /**
   * 载入路由模块并配置
   */
  const Router = require('koa-router');
  const router = new Router();
  app.use((ctx, next) => {
    ctx.router = router;
    return next();
  });

  // // 载入所有的控制器
  const defaultController = require('./controllers/default');
  const adminController = require('./controllers/admin');
  const studentController = require('./controllers/student');
  router
    .get('default', '/', defaultController.index)
    .get('start', '/start', adminController.start) // 开始测评
    .post('watch_post', '/watch/:stamp', adminController.watch)
    .get('count', '/count/:stamp', adminController.count)
    .post('stop', '/stop/:stamp', adminController.stop) // 结束测评
    .post('send', '/send', co.wrap(adminController.doSend)) // 发送邮件
    .get('send', '/send', adminController.send) // 获取所有需要发送测评结果的老师列表
    .get('teacher', '/teacher', adminController.getTeachers) // 获取所有需要发送测评结果的老师列表
    .get('send', '/send/:stamp', adminController.getEmailsByStamp) // 根据一个戳获取要发送的邮件列表
    .get('rating', '/r/:stamp', studentController.rating)
    .post('rating_post', '/r/:stamp', studentController.post);

  /**
   * 路由工作
   */
  app
    .use(router.routes())
    .use(router.allowedMethods());



  // 启用一个可用的随机端口
  const http = require('http');
  const server = http.createServer(app.callback());
  server.listen(process.env.NODE_ENV === 'production' ? 0 : config.system.debug_port);

  server.on('listening', (error) => {
    if (error) {
      throw error;
    }
    process.env.port = server.address().port;
    console.log(`服务已开启，请访问：http://127.0.0.1:${process.env.port}/`);
    callback && callback(`http://127.0.0.1:${process.env.port}/`);
  });


  app.on('error', function (err, ctx) {
    console.error(err);
  });
}

var mainWindow;
module.exports = { start, setWindow: (window) => {
  mainWindow = window;
}};

if (!module.parent) {
  start();
}
