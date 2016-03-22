/*
 * @Author: iceStone
 * @Date:   2016-01-07 20:55:32
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-24 14:29:06
 */

'use strict';

const fs = require('fs');
const path = require('path');

const utilities = require('../functions/utilities');
const mail = require('../functions/mail');
const storage = require('../../data/storage');
const config = require('../config');

// get /start/
exports.start = (ctx, next) => {
  let stamp = utilities.getStamp(6);
  ctx.render('start', { info: storage.load(), stamp });
};

// post /watch/:stamp
exports.watch = (ctx, next) => {
  let stamp = ctx.params.stamp;
  if (ctx.localAreaIp) {
    let data = storage.load();
    let temp = ctx.request.body;
    // 处理邮箱输入
    temp.teacher_email = temp.teacher_email.indexOf('@') !== -1 ? temp.teacher_email.split('@')[0] : temp.teacher_email;
    // 取本次测试题
    let qArr = data.itcast.questions; // 默认
    let currentSchool = data.schools[temp.school_name];
    qArr = currentSchool.questions.length == 0 ? qArr : currentSchool.questions;
    let currentAcademy = data.academies[temp.academy_name];
    qArr = currentAcademy.questions.length == 0 ? qArr : currentAcademy.questions;
    let currentSubject;
    data.subjects.forEach((item) => {
      if (item.academy === temp.academy_name && item.school === temp.school_name && item.name === temp.subject_name) {
        currentSubject = item;
        return false;
      }
      return true;
    });
    qArr = currentSubject.questions.length == 0 ? qArr : currentSubject.questions;
    // console.log(qArr);
    // 取到当前测试题使用的规则数组
    temp.questions = {};
    for (let i = 0; i < qArr.length; i++) {
      temp.questions[qArr[i]] = data.questions[qArr[i]];
    }
    // console.log(temp.questions);
    // 取到本次测试使用的所有测试题

    // 将测评信息放到临时目录
    temp.stamp = stamp;
    ctx.cache.setItem(`${stamp}_test_info`, temp);
    // 生成测评链接
    temp.link = 'http://' + ctx.localAreaIp + ':' + process.env.port + ctx.router.url('rating', stamp);
    // console.log('1111');
    ctx.render('watch', temp);
  } else {
    ctx.render('error', {
      message: '请检查您的网络连接！！！'
    });
  }
};

// get /count/:stamp
exports.count = (ctx, next) => {
  let currentCount = ctx.cache.getItem(`${ctx.params.stamp}_rating_count`);
  ctx.body = currentCount;
};

// post /stop/:stamp
exports.stop = (ctx, next) => {
  let stamp = ctx.params.stamp;
  // 设置当前为停止状态
  ctx.cache.setItem(`${stamp}_is_stop`, true);
  let temp = ctx.cache.getItem(`${stamp}_test_info`);
  if (!stamp || !temp) {
    ctx.render('error', {
      message: '没有打分数据！'
    });
    return false;
  }
  temp.rate_count = ctx.cache.getItem(`${stamp}_rating_count`);
  const report = require('../functions/report');
  let result = report.compute(ctx.cache, temp);
  let data = {
    info: temp,
    result: result.result,
    notes: result.notes
  };
  // ctx.data.setItem(`${stamp}_report_result`, data);
  // 生成报告文件
  report.logToFile(data, ctx);
  ctx.redirect('/');
  ctx.status = 302;
};

/*
 * 获取所有文件，对{日期+时间}分组，去重发送到前台
 * 相应数据{name：讲师姓名，time：打分时间戳，formatTime：格式化事件}
 * */
exports.getTeachers = (ctx, next) => {
  // 获取临时目录中所有的有效文件名
  let filePaths = getAllTempFilePaths();
  let teachers = [];

  // 根据文件名获取自定义格式{name:'张三',stamp:'dsa12'}
  for (let i = 0; i < filePaths.length; i++) {
    let pathArr = filePaths[i].split('_');
    teachers.push({
      name: pathArr[1], // 老师姓名
      stamp: pathArr[0] + '_' + pathArr[1],
      time: ((time) => {
          let year = time[0] + time[1] + time[2] + time[3];
          let month = time[4] + time[5];
          let date = time[6] + time[7];
          let hour = time[8] + time[9];
          let minutes = time[10] + time[11];
          return `${year}-${month}-${date} ${hour}:${minutes}`;
        })(pathArr[0]) // 打分时间
    });
  }

  // 根据日期和姓名去重
  teachers = utilities.distinctArr(teachers);

  ctx.body = teachers;
};

/*
 * 渲染发送邮件页面
 * */
exports.send = (ctx, next) => {
  ctx.render('send', {
    message: '发送测评邮件'
  });
};

/*
 * 发送邮件
 * post参数：stamp：这里把name+time作为stamp
 * body参数：teacherEmail
 * body参数：teacherName
 * body参数：email[]
 * */
exports.doSend = function*(ctx, next) {
  let stamp = ctx.request.body.stamp.trim();
  let teacherEmail = ctx.request.body.teacherEmail.trim();
  let teacherName = ctx.request.body.teacherName.trim();
  let emails = ctx.request.body.emails;
  if (process.env.NODE_ENV === 'development') {
    for (var i = 0; i < emails.length; i++) {
      emails[i] = emails[i] + 'n';
    }
  }

  // 获取临时目录中所有有效的文件
  let filePaths = getAllTempFilePaths().sort();

  let sendPaths = [];

  let removePaths = [];
  for (let i = 0; i < filePaths.length; i++) {
    let item = filePaths[i];
    if (item.includes(stamp) && path.extname(item) === '.txt') {
      sendPaths.push(item);
      removePaths.push(item);
    }
  }

  // 循环读取出所有文件的内容，拼接为html
  let body = ''; // 正文
  let attachments = []; // 附件

  // 生成邮件正文和附件
  for (let i = 0; i < sendPaths.length; i++) {
    let item = sendPaths[i];
    body += '<h1 style="text-align:center">评分规则：' + item.split('_')[2] + '版</h1><hr />';
    let fullPath = path.join(config.system.log_root, item);
    let content = fs.readFileSync(fullPath, 'utf8');

    attachments.push({
      filename: item,
      content: content
    });

    let tempArr = content.split('\r\n').filter(str => {
      return str.trim() !== '' && str.length !== 0 });
    // console.log(tempArr);
    content = tempArr.join('<br>');
    content = content.replace('考评结果汇总', '<h2>考评结果汇总</h2>');
    content = content.replace('具体原因：', '<h3 style="margin-top:10px;margin-bottom:-6px">具体原因：</h3>');
    content = content.replace('各项分数：', '<h3 style="margin-top:10px;margin-bottom:-6px">各项分数：</h3>');
    content = content.replace('学员评价：', '<h3 style="margin-top:10px;margin-bottom:-6px">学员评价：</h3>');
    body += content + '<br><br><br>';
  }

  try {
    let info = yield mail(
      teacherEmail, // 收件人
      emails, // 抄送
      teacherName + '老师，请查收打分结果', // 邮件标题
      body, // 邮件正文
      attachments);
    // console.log(emails);

    // 发送成功，删除已发送的文件
    // console.log(ctx.config.remove_log_after_send);
    if (ctx.config.remove_log_after_send)
      removeFiles(removePaths.map(p => path.join(config.system.log_root, p)));

    ctx.body = {
      code: '1',
      msg: info.response
    };
  } catch (e) {
    ctx.body = {
      code: '0',
      msg: e.message
    };
  }
};

// 根据一个戳获取要要发送的所有emails
exports.getEmailsByStamp = (ctx, next) => {
  let stamp = ctx.params.stamp;
  let result = getEmailsByStamp(stamp); // {teacherName:'',teacherEmail:'',emails:[]}
  ctx.body = result;
};

// 根据一个戳，获取一个文件，从文件中读取出所属校区、所属学院、所属学科、讲师姓名、讲师邮箱
function getEmailsByStamp(stamp) {
  let filePath;
  let filePaths = getAllTempFilePaths();
  for (let i = 0; i < filePaths.length; i++) {
    if (filePaths[i].includes(stamp)) {
      filePath = filePaths[i];
      break; // 找到一个文件就可以了，所有戳相同的文件内容都一样
    }
  }

  let fullPath = path.join(config.system.log_root, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let contentArr = content.split('\n'); // 将读取到的文件按换行分割

  // 将上面分割后的数组提出为{key,value}的对象形式，方便下面使用
  let obj = {};
  for (let i = 0; i < contentArr.length; i++) {
    let item = contentArr[i].split('：');
    if (item && item.length === 2) {
      obj[item[0]] = item[1].trim();
    }
  }

  let schoolName = obj['所属校区'];
  let academyName = obj['所属学院'];
  let subjectName = obj['所属学科'];
  let teacherName = obj['讲师姓名'];
  let teacherEmail = obj['讲师邮箱'];
  const storage = require('../../data/storage');
  let dts = storage.load();
  let itcastEmails = dts.itcast.emails;
  let schoolEmails = dts.schools[schoolName].emails;
  let academyEmails = dts.academies[academyName].emails;
  // let subjectEmails = dts.academies[academyName].subjects[subjectName].emails;
  let subjectEmails;
  dts.subjects.forEach(function(item) {
    if (item.academy === academyName && item.school === schoolName && item.name === subjectName) {
      subjectEmails = item.emails;
      return false;
    }
    return true;
  });

  let emails = itcastEmails.concat(schoolEmails, academyEmails, subjectEmails);

  let result = {};
  result.teacherName = teacherName;
  result.teacherEmail = teacherEmail;
  result.emails = emails;

  return result || {};
}

/*
 * 获取临时目录中所有的文件路径
 * */
function getAllTempFilePaths() {
  let result = [];
  let files = fs.readdirSync(config.system.log_root);
  for (let i = 0; i < files.length; i++) {
    let item = files[i];
    if (fs.statSync(path.join(config.system.log_root, item)).isFile()) {
      if (path.extname(item) === '.txt') {
        result.push(item);
      }
    }
  }
  return result;
}

// 传入一个文件路径数组，删除所有文件
function removeFiles(filePaths) {
  for (let i = 0; i < filePaths.length; i++) {
    fs.unlinkSync(filePaths[i]);
  }
}
