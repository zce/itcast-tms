/*
 * @Author: iceStone
 * @Date:   2015-11-15 00:55:22
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-08 16:57:22
 */

'use strict';

function getRateDatas(stamp, cache) {
  let rates = [];
  for (let i = cache.count() - 1; i >= 0; i--) {
    let key = cache.key(i);
    if (key.startsWith(`${stamp}_rd_`)) {
      rates.push(cache.getItem(key));
    }
  };
  return rates;
}

function getNotes(rates) {
  let notes = [];
  for (let j = rates.length - 1; j >= 0; j--) {
    let t = decodeURI(rates[j].note).replace('+', '');
    if (t) {
      notes.push(t);
    }
  }
  return notes;
}

function getAvgResult(temp, rates) {
  var questions = temp.questions;
  let result = {};
  for (let v in questions) {
    let question = questions[v];
    result[v] = {
      scores: {}
    };
    // 每一版本的结果 键为题目简称
    for (let t = 0; t < question.length; t++) {
      let test = question[t]; // 遍历每一题
      let frontTotal = 0;
      for (let r = 0; r < rates.length; r++) {
        let rate = rates[r];
        frontTotal += rate.marks[v][t].front;
      }
      result[v].scores[test.shortname] = parseFloat((frontTotal / rates.length).toFixed(2));
    }
    let minimumBackTotal = 100;
    let allBackTotal = 0;
    for (let r = 0; r < rates.length; r++) {
      let rate = rates[r];
      rate.backTotal = 0;
      for (let t = 0; t < question.length; t++) {
        rate.backTotal += rate.marks[v][t].back;
      }
      allBackTotal += rate.backTotal;
      if (minimumBackTotal > rate.backTotal) {
        minimumBackTotal = rate.backTotal;
      }
    }
    result[v].backTotal = parseFloat((allBackTotal / rates.length).toFixed(2));
    result[v].backTotalWithoutMin = parseFloat(((allBackTotal - minimumBackTotal) / (rates.length - 1)).toFixed(2)) || '人数过少';
  }
  return result;
}

exports.compute = function(cache, temp) {
  let rates = getRateDatas(temp.stamp, cache);
  let notes = getNotes(rates);
  // let versions = getVersions(temp);
  let result = getAvgResult(temp, rates);
  return {
    result: result,
    notes: notes
  };
};

const fs = require('fs');
const path = require('path');
const utility = require('utility');
exports.logToFile = function(data, ctx) {
  for (let v in data.result) {
    ctx.getRender('txt', {
      info: data.info,
      result: data.result[v],
      notes: data.notes
    }, function(error, text) {
      let timeStamp = new Date().format('yyyyMMddHHmm');
      let sha1 = timeStamp + '_' + data.info.teacher_name + '_' + v + '_' + utility.sha1(utility.md5(text.trim()) /*+ utility.md5(JSON.stringify(qs))*/ + ctx.config.report_file_token).substring(0, 8) + '_.txt';
      var filePath = path.join(ctx.config.log_root, sha1);
      fs.writeFile(filePath, text);
    });
  }
}
