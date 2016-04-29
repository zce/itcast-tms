(function(angular, $) {
  'use strict';

  angular.module('itcast-tms.services')
    .service('Storage', [Storage]);

  function Storage() {}

  Storage.prototype.write = $.storage.write;

  Storage.prototype.read = $.storage.read;

  // status initial → rating → rated -> send
  Storage.prototype.set = $.storage.set;

  Storage.prototype.get = $.storage.get;

}(angular, $));
