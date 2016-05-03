const path = require('path');
const log4js = require('log4js');
const options = require('./config');

const filename = path.join(options.app_root, 'itcast-tms.log');
// ===== 日志记录 =====
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: filename, category: 'renderer' },
    { type: 'file', filename: filename, category: 'main' }
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
