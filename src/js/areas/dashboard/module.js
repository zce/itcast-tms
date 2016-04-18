(function(angular) {
  'use strict';

  angular
    .module('itcast-tms.areas.dashboard', [])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
        controller: 'DashboardController',
        templateUrl: 'dashboard_tmpl'
      })
    }])
    .controller('DashboardController', ['$scope', function($scope) {

    }]);

}(angular));
