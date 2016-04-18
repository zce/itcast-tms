(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');

  function resolve(uri) {
    return uri;
  }

  function set(uri, value) {
    value = JSON.stringify(value);
    const length = new Buffer(value).length;
    const buffer = new Buffer(length + 4);
    buffer.writeUInt32BE(length, 0);
    buffer.write(value, 4);
    uri = resolve(uri);
    fs.writeFileSync(uri, buffer, 'hex');
  }

  function get(uri) {
    uri = resolve(uri);
    const buffer = fs.readFileSync(uri);
    const length = buffer.readUInt32BE(0);
    const content = buffer.toString('utf8', 4, length + 4);
    return JSON.parse(content);
  }


  function Storage() {

  }

  Storage.prototype.get = get;
  Storage.prototype.set = set;

  angular.module('itcast-tms.services')
    .service('Storage', [Storage]);

}(angular));
