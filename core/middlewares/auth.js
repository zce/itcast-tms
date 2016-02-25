/*
 * @Author: iceStone
 * @Date:   2015-11-26 00:19:17
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-26 01:10:30
 */

'use strict';

module.exports = (ctx, next) => {
  if (ctx.request.url.startsWith('/r/')) {
    // 学生操作页面
    if (!ctx.config.allow_admin_rating && ctx.request.isLocal) {
      ctx.render('error', {
        message: '抱歉您是管理员！不允许参加测评哦~'
      });
      return false;
    }
    // 学员
    return next();

  } else {
    if (!ctx.request.isLocal) {
      ctx.render('error', {
        message: '抱歉您不是管理员！请止步'
      });
      return false;
    }
    // 管理员
    return next();
  }
};
