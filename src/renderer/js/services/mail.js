(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');

  const files = {};

  angular.module('itcast-tms.services')
    .service('Mail', ['options', '$timeout', 'Storage', Mail]);

  function Mail(options, $timeout, Storage) {
    this.options = options;
    this.$timeout = $timeout;
  }

  Mail.prototype.send = function(data) {
    this.$timeout(() => {
      data.status = options.statusKey.initial;
      // data.status = options.statusKey.send;
      // Storage.set(data.stamp)
    }, 1000);
  };

}(angular));
