const path = require('path');
const log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: path.resolve(__dirname, '../../..', 'itcast-tms.log'), category: 'main' },
    { type: 'file', filename: path.resolve(__dirname, '../../..', 'itcast-tms.log'), category: 'renderer' }
  ]
});

module.exports = {
  main: log4js.getLogger('main'),
  renderer: log4js.getLogger('renderer')
};
