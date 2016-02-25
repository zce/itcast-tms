/*
 * @Author: iceStone
 * @Date:   2016-01-07 16:23:30
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-08 17:45:12
 */

'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const path = require('path');

/**
 * 发送邮件
 * @param  {Array}    to          收件人
 * @param  {Array}    cc          抄送
 * @param  {String}   subject     主题
 * @param  {String}   body        正文
 * @param  {Array}    attachments 附件
 * @param  {Function} callback   回调
 */
module.exports = function (to, cc, subject, body, attachments) {
  return function (callback) {
    let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/options.json'), 'utf8'));
    let transporter = nodemailer.createTransport(smtpTransport(config.mail_server));
    let mail = {
      from: `${config.mail_server.name} <${config.mail_server.auth.user}>`,
      to: to.toString(),
      cc: cc.toString(),
      subject: subject,
      html: body,
      attachments: attachments
    };
    transporter.sendMail(mail, callback);
  }
};
