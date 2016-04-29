(function(angular, $) {
  'use strict';

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
      'Storage',
      DashboardController
    ]);

  function DashboardController($scope, Storage) {

  }

}(angular, $));
