const path = require('path');
const nodemailer = require('nodemailer');
const xtpl = require('xtpl');

const report = require('./report');
const config = require('../config');
const { transport, options } = config.mail;

const txt_tpl = path.join(config.template_root, 'txt.xtpl');
const mail_tpl = path.join(config.template_root, 'mail.xtpl');

const Transport = nodemailer.createTransport(config.mail.transport);

module.exports = (data) => {

  // 计算结果
  data = report(data);

  // 发送邮件
  const to = `${data.teacher_name} <${data.teacher_email}>`; // 收件人
  const cc = []; // 抄送的人员
  if (process.env.NODE_ENV === 'production') {
    data.emails.concat(data.added_emails).forEach(e => cc.push(`${e.name} <${e.email}>`));
  }
  // 邮件标题
  const subject = `❈ 教学测评报告：${data.teacher_name}老师（${data.course_name}）`;
  // 附件和正文
  const attachments = [];
  let body = '';

  Object.keys(data.result).forEach(version => {
    xtpl.renderFile(txt_tpl, { data, version }, (error, content) => {
      if (error) throw error;
      const filename = `${data.datetime.replace(/-/g,'').replace(/:/g,'').replace(/\s/g,'')}_${data.teacher_name}_${version}.txt`;
      attachments.push({ filename, content });
    });
    // const notes = [];
    // data.notes.forEach(n => notes.push(marked(n)));
    // console.log(notes);
    xtpl.renderFile(mail_tpl, { data, version }, (error, content) => {
      if (error) throw error;
      body += content;
    });
  });
  // return false;

  return send({ from: config.mail.from, to: to.toString(), cc: cc.toString(), subject: subject, html: body, attachments: attachments });

};

function send(message) {
  return new Promise((resolve, reject) => {

    if (!(message && message.subject && message.html && message.from && message.to)) {
      return reject(new Error('邮件信息不完整'));
    }

    // Object.assign(message, {
    //   generateTextFromHTML: true,
    //   encoding: 'base64'
    // });

    Transport.sendMail(message, (error, response) => {
      if (error) return reject(new Error(error));

      if (Transport.transportType !== 'DIRECT')
        return resolve(response);

      // response.statusHandler.once('failed', function(data) {
      //   var reason = 'errors.mail.failedSendingEmail.error';

      //   if (data.error && data.error.errno === 'ENOTFOUND') {
      //     reason += 'errors.mail.noMailServerAtAddress.error domain: ' + data.domain;
      //   }
      //   reason += '.';
      //   return reject(new Error(reason));
      // });

      // response.statusHandler.once('requeue', function(data) {
      //   var errorMessage = 'errors.mail.messageNotSent.error';

      //   if (data.error && data.error.message) {
      //     errorMessage += 'errors.general.moreInfo info: ' + data.error.message;
      //   }

      //   return reject(new Error(errorMessage));
      // });

      // response.statusHandler.once('sent', function() {
      //   return resolve('notices.mail.messageSent');
      // });
    });
  });
}
