/*
 * @Author: iceStone
 * @Date:   2015-11-26 00:19:17
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-26 01:10:30
 */

'use strict';

module.exports = function() {
  return (ctx, next) => {
    ctx.json = (data) => {
      var temp = JSON.stringify(data);
      ctx.body = temp;
      ctx.type = 'json';
      return temp;
    };
    return next();
  };
};
