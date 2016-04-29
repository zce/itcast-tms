// 渲染线程
const path = window.require && require('path');
const fs = window.require && require('fs');

// Object.assign($.options, {});


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
    // .constant('options', options)
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({ redirectTo: '/home' /*'/watcher/1234'*/ })
    }]);

}(angular));
