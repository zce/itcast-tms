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
  const to = `${data.teacher_name} <${data.teacher_email}>`;
  const cc = [];
  data.emails.concat(data.added_emails).forEach(e => cc.push(`${e.name} <${e.email}n>`));
  const subject = `❈ 教学测评报告：${data.teacher_name}老师（${data.course_name}）`;
  const attachments = [];
  let body = '';

  for (let v in data.result) {
    let result = data.result[v];
    xtpl.renderFile(txt_tpl, { result, data }, function(error, content) {
      if (error)
        throw error;
      const filename = `${data.datetime.replace(/-/g,'').replace(/:/g,'').replace(/\s/g,'')}_${data.teacher_name}.txt`;
      attachments.push({ filename, content });
      body += content;
      console.log(content);
    });
  }

  const message = {
    from: config.mail.from,
    to: to.toString(),
    cc: cc.toString(),
    subject: subject,
    html: body,
    attachments: attachments
  };
  return send(message);
};

function send(message) {
  return new Promise((resolve, reject) => {
    if (!(message && message.subject && message.html && message.from && message.to)) {
      return Promise.reject(new Error('errors.mail.incompleteMessageData.error'));
    }

    Object.assign(message, {
      generateTextFromHTML: true,
      encoding: 'base64'
    });

    Transport.sendMail(message, function(error, response) {
      if (error) {
        return reject(new Error(error));
      }

      if (Transport.transportType !== 'DIRECT') {
        return resolve(response);
      }

      response.statusHandler.once('failed', function(data) {
        var reason = 'errors.mail.failedSendingEmail.error';

        if (data.error && data.error.errno === 'ENOTFOUND') {
          reason += 'errors.mail.noMailServerAtAddress.error domain: ' + data.domain;
        }
        reason += '.';
        return reject(new Error(reason));
      });

      response.statusHandler.once('requeue', function(data) {
        var errorMessage = 'errors.mail.messageNotSent.error';

        if (data.error && data.error.message) {
          errorMessage += 'errors.general.moreInfo info: ' + data.error.message;
        }

        return reject(new Error(errorMessage));
      });

      response.statusHandler.once('sent', function() {
        return resolve('notices.mail.messageSent');
      });
    });
  });
}
