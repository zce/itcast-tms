(function(angular) {
  'use strict';

  const path = window.require && require('path');

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
        controller: 'DashboardController',
        templateUrl: 'dashboard_tmpl'
      })
    }])
    .controller('DashboardController', [
      '$scope',
      'options',
      'Storage',
      function($scope, options, Storage) {
        // Storage.set(path.join(options.temp_root, 'demo.bin'), { id: 1, name: 'zhangsan' });

        // console.log(Storage.get(path.join(options.temp_root, 'demo.bin')));
      }
    ]);

}(angular));
