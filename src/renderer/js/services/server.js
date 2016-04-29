// /*
//  * @Author: iceStone
//  * @Date:   2016-01-07 21:31:54
//  * @Last Modified by:   iceStone
//  * @Last Modified time: 2016-01-08 00:08:51
//  */
// (function(angular) {
//   'use strict';

//   const fs = window.require && require('fs');
//   const path = window.require && require('path');
//   const http = window.require && require('http');
//   const url = window.require && require('url');
//   const child_process = window.require && require('child_process');

//   angular.module('itcast-tms.services')
//     .service('Server', ['$templateRequest', 'options', 'Storage', Server]);

//   function Server($templateRequest, options, storage) {
//     this.stamps = [];
//     this.$templateRequest = $templateRequest;
//     this.options = options;
//     this.storage = storage;
//     this.server = http.createServer(this.requestListener.bind(this));
//     this.url = `http://${options.server_ip}:${options.server_port}/`;
//     this.server.listen(options.server_port, options.server_ip, err => err || options.logger.renderer.info(`server run @ ${this.url}`));
//   }

//   Server.prototype.requestListener = function(req, res) {
//     const urlObj = url.parse(req.url, true);
//     const paths = urlObj.pathname.split('/').filter(i => i);
//     const stamp = paths[0];
//     if (paths.length !== 1 || !this.stamps.includes(stamp)) {
//       res.writeHead(404, 'Not Found');
//       res.end(`<h1>${req.url} is Not Found! </h1>`);
//       return false;
//     }
//     const data = this.storage.get(stamp);
//     if (!data) {
//       res.writeHead(404, 'Not Found');
//       res.end(`<h1>${req.url} is Not Found! </h1>`);
//       return false;
//     }
//     this.$templateRequest('view/rating.html').then(tmpl => {
//       var compiled = _.template(tmpl);
//       res.end(compiled(data));
//     });
//   };

//   Server.prototype.start = function(stamp) {
//     this.stamps.push(stamp);
//     this.options.logger.renderer.info(`${stamp} is start`);
//     return this.url + stamp;
//   };

//   Server.prototype.stop = function(stamp) {
//     this.stamps.splice(this.stamps.indexOf(stamp), 1);
//     this.options.logger.renderer.info(`${stamp} is stop`);
//   };


//   //   function server(options) {
//   //     let server = null;
//   //     let data = null;

//   //     function requestListener(req, res) {
//   //       res.end(`<!DOCTYPE html>
//   // <html lang="en">
//   // <head>
//   //   <meta charset="UTF-8">
//   //   <title></title>
//   // </head>
//   // <body>
//   //   <h2><span>${ data.school_name }</span> / <span>${ data.academy_name }</span> / <span>${ data.subject_name }</span></h2>
//   // </body>
//   // </html>`);
//   //     }

//   //     function run(params) {
//   //       data = params;
//   //       server = http.createServer(requestListener);
//   //       const url = `http://${options.server_ip}:${options.server_port}/`;
//   //       server.listen(
//   //         options.server_port,
//   //         options.server_ip,
//   //         err => err || console.log(`server run @ ${url}`)
//   //       );
//   //       return url;
//   //     }

//   //     function stop() {
//   //       console.log(server);
//   //       server && server.close(() => {
//   //         server = null;
//   //         data = null;
//   //         console.log('server stop...');
//   //       });
//   //     }
//   //     return { run, stop };
//   //   }

// }(angular));
