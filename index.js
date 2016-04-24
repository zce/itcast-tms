// 处理环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// 处理更新
require('./updater');
