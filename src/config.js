const fs = require('fs');
const path = require('path');

const options = {
  // 数据文件所在目录
  data_root: path.resolve(__dirname, '../data'),
  // 数据文件版本
  data_version: require('../data/package.json').version,
  // 临时目录
  template_root: path.resolve(__dirname, 'template'),
  // 日志文件目录
  storage_root: path.resolve(__dirname, '../../itcast-log'),
  // 日志扩展名
  storage_ext: '.tms',
  stamp_length: 8,
  // 测评状态
  status_keys: {
    initial: '尚未开始测评',
    rating: '测评中',
    rated: '测评完成 - 待发邮件',
    sending: '邮件发送中',
    send: '邮件发送完成'
  },
  mail: {
    transport: 'smtps://pingfen%40itcast.cn:123456A@smtp.263.net',
    from: '教学测评系统·传智播客 <pingfen@itcast.cn>'
  },
  allow_student_repeat: false,
  allow_admin_rating: true,
  remove_log_after_send: true,
  report_file_token: 'wedn.net',
  token: 'itcast'
};

// ===== 目录不存在 则创建 =====
fs.existsSync(options.storage_root) || fs.mkdir(options.storage_root);
// fs.existsSync(options.temp_root) || fs.mkdir(options.temp_root);

module.exports = options;
