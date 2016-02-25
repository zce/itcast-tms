/*
 * @Author: iceStone
 * @Date:   2015-11-26 01:01:04
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-18 17:42:46
 */

'use strict';

const xtpl = require('xtpl');
const path = require('path');

module.exports = (viewRoot) => {

  function injectData(data, ctx) {
    data.config = ctx.config;
    data.objectify = JSON.parse;
    data.stringify = JSON.stringify;
    data.params = ctx.params;
  }

  return (ctx, next) => {
    ctx.render = (tmplname, data) => {
      data = data || {};
      injectData(data, ctx);
      xtpl.renderFile(path.join(viewRoot, tmplname + '.xtpl'), data, function(error, content) {
        if (error /*&& ctx.config.env != 'production'*/ ) {
          ctx.body = error;
          return false;
        }
        ctx.body = content;
        ctx.type = 'html';
        return content;
      });
    }

    ctx.getRender = (tmplname, data, callback) => {
      injectData(data, ctx);
      xtpl.renderFile(path.join(viewRoot, tmplname + '.xtpl'), data, callback);
    }
    return next();
  };
};
