/*
 * @Author: iceStone
 * @Date:   2016-01-07 21:31:54
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-08 00:08:51
 */
(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');
  const http = window.require && require('http');

  angular.module('itcast-tms.services')
    .factory('Server', ['options', server]);

  function server(options) {
    let server = null;
    let data = null;

    function requestListener(req, res) {
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <h2><span>${ data.school_name }</span> / <span>${ data.academy_name }</span> / <span>${ data.subject_name }</span></h2>
</body>
</html>`);
    }

    function run(params) {
      data = params;
      server = http.createServer(requestListener);
      const url = `http://${options.server_ip}:${options.server_port}/`;
      server.listen(
        options.server_port,
        options.server_ip,
        err => err || console.log(`server run @ ${url}`)
      );
      return url;
    }

    function stop() {
      server.close(() => {
        server = null;
        data = null;
      });
    }
    return { run, stop };
  }

}(angular));
