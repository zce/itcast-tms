const fs = require('fs');
const path = require('path');

const options = {
  front_title:'教学质量评估表 « 传智播客•黑马程序员',
  // 数据文件所在目录
  data_root: path.resolve(__dirname, '../data'),
  // 数据文件版本
  data_version: require('../data/package.json').version,
  // 临时目录
  // temp_root: path.resolve(__dirname, '../../temp'),
  // 日志文件目录
  storage_root: path.resolve(__dirname, '../../itcast-log'),
  // 日志扩展名
  storage_ext: '.tms',
  // 测评状态
  status_keys: {
    initial: '尚未开始测评',
    rating: '测评中',
    rated: '测评完成 - 待发邮件',
    sending: '邮件发送中',
    send: '邮件发送完成'
  },
  mail_server: {
    host: 'smtp.263.net',
    port: 25,
    secure: false,
    name: '教学测评系统·传智播客',
    auth: {
      user: 'pingfen@itcast.cn',
      pass: '123456A'
    }
  },
  allow_student_repeat: false,
  allow_admin_rating: false,
  remove_log_after_send: true,
  report_file_token: 'wedn.net'
};


// ===== 目录不存在 则创建 =====
fs.existsSync(options.storage_root) || fs.mkdir(options.storage_root);
// fs.existsSync(options.temp_root) || fs.mkdir(options.temp_root);


module.exports = options;
