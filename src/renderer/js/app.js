// 渲染线程
;(function (angular) {
  'use strict'
  angular
    .module('itcast-tms', [
      'ngRoute',
      'ngAnimate',
      'itcast-tms.areas',
      'itcast-tms.controllers',
      'itcast-tms.directives'
    ])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.otherwise({ redirectTo: '/starter' })
    }])
}(window.angular))
