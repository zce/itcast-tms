// 渲染线程
const path = require('path');
const fs = require('fs');
const remote = require('electron').remote;

const CONFIG = remote.getGlobal('CONFIG') || {};

Object.assign(CONFIG, {
  temp_root: path.join(CONFIG.app_root, '/temp/'),
  log_root: path.join(CONFIG.app_root, '/log/'),
  log_ext: '.tms'
});

fs.existsSync(CONFIG.temp_root) || fs.mkdir(CONFIG.temp_root);
fs.existsSync(CONFIG.log_root) || fs.mkdir(CONFIG.log_root);

(function(angular) {
  'use strict';

  angular
    .module('itcast-tms', [
      'ngAnimate',
      'ngRoute',
      'itcast-tms.areas',
      'itcast-tms.controllers',
      'itcast-tms.directives'
    ])
    .constant('options', CONFIG)
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({ redirectTo: '/home' })
    }]);

}(angular));
