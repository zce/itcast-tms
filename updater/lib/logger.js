const path = require('path');
const log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: path.resolve(__dirname,'../..', 'itcast-tms.log'), category: 'updater' }
  ]
});

module.exports = log4js.getLogger('updater');

// const logger = log4js.getLogger('main');
// logger.setLevel('ALL');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');
