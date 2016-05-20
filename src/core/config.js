const path = require('path')
const utils = require('./main/utils')

const isProduction = process.env.NODE_ENV === 'production'
process.env.CORE_ROOT = process.env.CORE_ROOT || (isProduction ? 'core.asar' : 'core')
process.env.DATA_ROOT = process.env.DATA_ROOT || (isProduction ? 'data.asar' : 'data')
process.env.UPDATER_ROOT = process.env.UPDATER_ROOT || (isProduction ? 'updater.asar' : 'updater')

const coreRoot = path.resolve(__dirname, '..', process.env.CORE_ROOT)
const dataRoot = path.resolve(__dirname, '..', process.env.DATA_ROOT)
const updaterRoot = path.resolve(__dirname, '..', process.env.UPDATER_ROOT)

const options = {
  core_version: require(path.resolve(coreRoot, 'package.json')).version,
  data_version: require(path.resolve(dataRoot, 'package.json')).version,
  updater_version: require(path.resolve(updaterRoot, 'package.json')).version,
  // 数据文件所在目录
  data_root: dataRoot,
  // 服务端静态文件根目录
  static_root: path.resolve(__dirname, 'static'),
  // 日志文件目录
  storage_root: path.resolve(__dirname, '../../itcast-log'),
  // 日志扩展名
  storage_ext: '.hms',
  // 文件戳长度
  stamp_length: 8,
  // 服务器信息
  main_url: `file://${path.resolve(__dirname, 'renderer')}/${process.env.NODE_ENV === 'production' ? 'splash' : 'index'}.html`,
  // 服务IP
  server_ip: utils.getLocalAreaIp(),
  // 服务Port
  server_port: 0, // ????
  // 测评状态
  status_keys: {
    initial: '尚未开始测评',
    rating: '测评中',
    rated: '测评完成 - 待发邮件',
    sending: '邮件发送中',
    send: '邮件发送完成'
  },
  mail: {
    transport: 'smtps://pingfen%40itcast.cn:123456A@smtp.263.net?connectionTimeout=3000',
    from: '测评系统 « 传智播客·黑马程序员 <pingfen@itcast.cn>'
  },
  allow_student_repeat: false,
  allow_admin_rating: false,
  report_token: 'wedn.net',
  login_token: 'itcast'
}

module.exports = options
