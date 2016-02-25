/*
 * @Author: iceStone
 * @Date:   2016-01-07 17:16:29
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-20 16:27:29
 */

'use strict';

/**
 * 首页
 */
exports.index = function(ctx, next) {
  ctx.render('index', {
    online: ctx.online
  });
};
