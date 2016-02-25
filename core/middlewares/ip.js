/*
 * @Author: iceStone
 * @Date:   2015-11-25 23:09:52
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-25 23:49:39
 */

'use strict';

var localAreaIp = (function() {
  var os = require('os');
  var networkInterfaces = os.networkInterfaces();
  for (var name in networkInterfaces) {
    var infos = networkInterfaces[name];
    if (infos && infos.length) {
      for (var i = 0; i < infos.length; i++) {
        if (infos[i].family == 'IPv4' && infos[i].address != '127.0.0.1') {
          return infos[i].address;
        }
      }
    }
  }
})();

module.exports = {
  inject: function() {
    return (ctx, next) => {
      ctx.localAreaIp = localAreaIp;
      var ip = ctx.req.headers['x-forwarded-for'] ||
        ctx.req.connection.remoteAddress ||
        ctx.req.socket.remoteAddress || '::1';
      // ctx.req.connection.socket.remoteAddress || '::1';
      // 注入IP
      ctx.request.clientIp = ip;
      // 注入是否本地请求
      ctx.request.isLocal = '::1' === ip || '::ffff:127.0.0.1' === ip || '::ffff:' + ctx.localAreaIp === ip
      return next();
    };
  },
  localAreaIp: localAreaIp
};
