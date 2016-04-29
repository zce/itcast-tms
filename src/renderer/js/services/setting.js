(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');

  const files = {};

  angular.module('itcast-tms.services')
    .service('Setting', ['$window', Setting]);

  function Setting($window) {
    this.storage = $window.localStorage;
  }

  Setting.prototype.get = function(key) {
    return JSON.parse(this.storage.getItem(key));
  };

  Setting.prototype.set = function(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  };

}(angular));
