/**
 * 测试环境入口文件
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// if (process.env.NODE_ENV === 'production')
//   require('./updater.asar')
// else
require('./src')
