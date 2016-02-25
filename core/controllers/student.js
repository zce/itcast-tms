/*
 * @Author: iceStone
 * @Date:   2016-01-08 13:45:09
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-08 17:42:07
 */

'use strict';

exports.rating = function(ctx, next) {
  let stamp = ctx.params.stamp;
  let isStop = ctx.cache.getItem(`${stamp}_is_stop`);
  if (isStop) {
    ctx.render('error', {
      message: '测评已经结束，不可以继续评价了~'
    });
    return false;
  }
  // 获取本次打分的数据信息
  let temp = ctx.cache.getItem(`${stamp}_test_info`);
  if (!temp) {
    ctx.render('error', {
      message: '你所访问的表单被外星人带走了~'
    });
    return false;
  }
  for (let key in temp.questions) {
    temp.frontQ = key;
  }
  ctx.render('rating', temp);
}

exports.post = (ctx, next) => {
  let stamp = ctx.params.stamp;
  let isStop = ctx.cache.getItem(`${stamp}_is_stop`);
  if (isStop) {
    ctx.json({
      status: false,
      message: '测评已经结束，不可以继续评价了！'
    });
    return false;
  }
  let rateData = ctx.cache.getItem(`${stamp}_rd_${ctx.request.clientIp}`);
  if (rateData && !ctx.config.allow_repeat) {
    // 已经评过
    ctx.json({
      status: false,
      message: '你已经评价过了，不可以重复评价！'
    });
    return false;
  }
  // 记录评价数据
  rateData = convert(stamp, ctx.cache, ctx.request.body);
  ctx.cache.setItem(`${stamp}_rd_${ctx.request.clientIp}`, rateData);
  let currentCount = ctx.cache.getItem(`${stamp}_rating_count`);
  ctx.cache.setItem(`${stamp}_rating_count`, currentCount + 1);
  ctx.json({
    status: true,
    message: '谢谢你的帮助，我们会及时将情况反映给相关人员！'
  });
};

function convert(stamp, cache, body) {
  let rateData = {
    note: body.note,
    marks: {}
  };
  let questions = cache.getItem(`${stamp}_test_info`).questions;

  for (let version in questions) {
    rateData.marks[version]={};
    for (let id in body) {
      if ('note' == id) {
        continue;
      }
      rateData.marks[version][id] = {
        back: 0,
        front: 0
      };
      let score = questions[version][id].answers[body[id]].score;
      rateData.marks[version][id].back = score.back;
      rateData.marks[version][id].front = score.front;
    }
  }

  return rateData;
}
