/**
 * 测试环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// if (process.env.NODE_ENV === 'production')
//   require('./updater.asar')
// else

console.time('itcast-tms.index');
require('./updater')
// console.timeEnd('main')
