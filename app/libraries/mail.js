/* eslint no-eval: "off" */
import path from 'path'
import nodemailer from 'nodemailer'
import xtpl from 'xtpl'

import config from './config'
import { renderer as logger } from './logger'

const staticDir = path.resolve(config.app.path, 'core.asar/www')
const txtTemplate = path.join(staticDir, 'txt.xtpl')
const mailTemplate = path.join(staticDir, 'mail.xtpl')

const transporter = nodemailer.createTransport(config.mail.transport)

export default (data) => {
  // 发送邮件
  const to = `${data.teacher_name} <${data.teacher_email}>`
  const cc = []
  if (process.env.NODE_ENV === 'production') {
    data.emails.concat(data.added_emails).forEach(e => cc.push(`${e.name} <${e.email}>`))
  }
  // 邮件标题
  const subject = eval('`' + config.mail.subject + '`')
    // 附件和正文
  const attachments = []
  let body = ''
  let all = ''
  Object.keys(data.result).forEach(version => {
    xtpl.renderFile(txtTemplate, { data, version }, (error, content) => {
      if (error) return Promise.reject(error)
      const filename = `${data.datetime.replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '')}_${data.teacher_name}_${version}.txt`
      attachments.push({ filename, content })
      all += content
    })
  })
  // 渲染邮件模板
  xtpl.renderFile(mailTemplate, { data, hash: encrypt(all) }, (error, content) => {
    if (error) return Promise.reject(error)
    body += content
  })
  return send({ from: config.mail.from, to: to.toString(), cc: cc.toString(), subject: subject, html: body, attachments: attachments })
}

function send (message) {
  if (!(message && message.subject && message.html && message.from && message.to)) {
    return Promise.reject(new Error('邮件信息不完整'))
  }

  Object.assign(message, {
    generateTextFromHTML: true,
    encoding: 'base64'
  })

  return transporter.sendMail(message)
    .then(res => Promise.resolve(res))
    .catch(err => {
      logger.fatal(err)

      if (err.code === 'ECONNECTION' && err.syscall === 'getaddrinfo') {
        return Promise.reject(new Error(err.message + '\n未检测到网络（公网）连接，请确认网络正常然后重试'))
      }

      if (err.code === 'ETIMEDOUT' && err.command === 'CONN') {
        return Promise.reject(new Error(err.message + '\n网络（公网）连接超时，请确认网络正常然后重试'))
      }

      if (err.responseCode === 550) {
        return Promise.reject(new Error(err.message + '\n收件人错误（不存在邮箱）\n请联系「wanglei3@itcast.cn」修改'))
      }

      if (err.responseCode === 598) {
        return Promise.reject(new Error('邮件中包含违禁词（来源于学员评论），发送失败\n请联系「wanglei3@itcast.cn」修改'))
      }

      return Promise.reject(new Error('邮件发送失败\n请联系「wanglei3@itcast.cn」'))
    })
}

const crypto = require('crypto')

const encrypt = (text) => crypto.createHash('sha1').update(crypto.createHash('md5').update(text).digest('base64') + config.report_token).digest('hex')
