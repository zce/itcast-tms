(function(angular, $) {
  'use strict';

  const files = {};

  angular.module('itcast-tms.services')
    .service('Mail', ['$timeout', 'Storage', Mail]);

  function Mail($timeout, Storage) {
    this.$timeout = $timeout;
  }

  Mail.prototype.send = function(data) {
    this.$timeout(() => {
      data.status = $.options.status_keys.initial;
      // data.status = $.options.status_keys.send;
      // Storage.set(data.stamp)
    }, 1000);
  };

}(angular, $));
