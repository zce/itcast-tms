/*
 * @Author: iceStone
 * @Date:   2015-11-05 09:47:45
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-11-05 15:00:21
 */

'use strict';

var fs = require('fs');
var url = require('url');
var http = require('http');
var https = require('https');

exports.getString = function (uri) {
  return function (callback) {
    var options = url.parse(uri);
    // console.log(uri);
    http.get(options, function (result) {
      var html = '';
      result.on('data', function (data) {
        html += data;
      });
      result.on('end', function (error) {
        callback(error, html);
        // return html;
      });
    }).on('error', function (error) {
      if (error) {
        console.log('fetch ' + url + ' failed：' + error);
        callback(error, 'fetch ' + url + ' failed：' + error);
      }
    });
  };
};

exports.getFile = function (uri, path, callback) {
  var client = uri.slice(0, 5) === 'https' ? https : http;
  var writer = fs.createWriteStream(path);
  writer.on('finish', function () {
    callback(path);
  });
  client.get(uri, function (response) {
    response.pipe(writer);
  });
};