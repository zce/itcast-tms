(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');

  angular.module('itcast-tms.services')
    .service('Storage', ['options', Storage]);

  function resolve(uri) {
    return uri;
  }

  function Storage(options) {
    this.options = options;
  }

  Storage.prototype.read = function read(uri) {
    uri = resolve(uri);
    try {
      const buffer = fs.readFileSync(uri);
      const length = buffer.readUInt32BE(0);
      const content = buffer.toString('utf8', 4, length + 4);
      return JSON.parse(content);
    } catch (e) {
      console.log('read file ' + e);
      return null;
    }
  };

  Storage.prototype.write = function write(uri, value) {
    value = JSON.stringify(value);
    const length = Buffer.byteLength(value); // new Buffer(value).length;
    const buffer = new Buffer(length + 4);
    buffer.writeUInt32BE(length, 0);
    buffer.write(value, 4);
    uri = resolve(uri);
    fs.writeFileSync(uri, buffer, 'hex');
  };

  // status initial → rating → rated -> send
  Storage.prototype.set = function(stamp, value) {
    this.write(path.resolve(this.options.log_root, stamp + this.options.log_ext), value);
  };

  Storage.prototype.get = function(stamp) {
    return this.read(path.resolve(this.options.log_root, stamp + this.options.log_ext));
  };


}(angular));
