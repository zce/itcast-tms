/*
 * @Author: iceStone
 * @Date:   2015-11-25 22:45:03
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-07 23:51:23
 */

'use strict';

var LocalStorage = require('node-localstorage').LocalStorage;

module.exports = function(cacheDir) {
  var storage = new LocalStorage(cacheDir);
  var cache = {
    count: function() {
      return storage.length;
    },
    getItem: function(key) {
      return JSON.parse(storage.getItem(key));
    },
    setItem: function(key, value) {
      storage.setItem(key, JSON.stringify(value));
    },
    removeItem: function(key) {
      storage.removeItem(key);
    },
    key: function(i) {
      return storage.key(i);
    },
    clearAll: function(prefix) {
      prefix = prefix || '';
      for (var i = storage.length - 1; i >= 0; i--) {
        var key = storage.key(i);
        if (key.startsWith(prefix))
          storage.removeItem(key);
      };
    }
  };

  return (ctx, next) => {
    ctx.cache = cache;
    return next();
  };
};
