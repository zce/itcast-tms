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
    // .constant('options', options)
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.otherwise({ redirectTo: '/starter' /*'/watcher/1234'*/ })
    }])
}(angular))
