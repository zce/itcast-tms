// 渲染线程
const path = window.require && require('path');
const fs = window.require && require('fs');
const remote = window.require && require('electron').remote;

const options = remote && remote.getGlobal('OPTIONS') || {};
const logger = remote && remote.getGlobal('LOGGER');

Object.assign(options, {});


(function(angular) {
  'use strict';

  angular
    .module('itcast-tms', [
      'ngRoute',
      'ngAnimate',
      'itcast-tms.areas',
      'itcast-tms.controllers',
      'itcast-tms.directives'
    ])
    .constant('options', options)
    .constant('logger', logger)
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({ redirectTo: '/home' /*'/watcher/1234'*/ })
    }])
    .run(['$animate', function($animate) {
      $animate.enabled(true);
    }]);

}(angular));
