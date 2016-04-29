const path = require('path');
const log4js = require('log4js');
const options = require('./config');

// ===== 日志记录 =====
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: path.join(options.app_root, 'renderer.log'), category: 'renderer' },
    { type: 'file', filename: path.join(options.app_root, 'main.log'), category: 'main' }
  ]
});

// options= log4js.getLogger('renderer');
// const logger = log4js.getLogger('main');
// logger.setLevel('ALL');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

module.exports = {
  renderer: log4js.getLogger('renderer'),
  main: log4js.getLogger('main')
};
