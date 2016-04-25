(function(angular) {
  'use strict';

  const path = window.require && require('path');

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/watcher/:stamp', {
        controller: 'WatcherController',
        templateUrl: 'view/watcher.html'
      })
    }])
    .controller('WatcherController', [
      '$scope',
      '$routeParams',
      'options',
      'Storage',
      WatcherController
    ]);

  function WatcherController($scope, $routeParams, options, Storage) {

    const stamp = $routeParams.stamp;

    // model
    $scope.model = {};
    $scope.action = {};

    $scope.data = Object.assign({}, Storage.read(stamp));
    $scope.data.leave_count = ((reasons) => {
      let result = 0;
      for (let key in reasons) {
        result += reasons[key];
      }
      return result;
    })($scope.data.reasons);
    $scope.data.rated_count = 0;

    $scope.data.emails = [
      { name: '李印东', title: '主任', email: 'lyd@itcast.cn' },
      { name: '李印东', title: '主任', email: 'lyd@itcast.cn' },
      { name: '李印东', title: '主任', email: 'lyd@itcast.cn' },
      { name: '李印东', title: '主任', email: 'lyd@itcast.cn' }
    ];


    $scope.model.add_emails = [];

    $scope.model.email_input = '';

    $scope.action.add_email = function() {
      if (!$scope.model.email_input)
        return
      $scope.model.email_input.includes('@') || ($scope.model.email_input += '@itcast.cn');
      $scope.model.add_emails.push({ email: $scope.model.email_input });
    };

    $scope.action.del_email = function() {
      $scope.model.add_emails.splice($scope.model.add_emails.indexOf(this), 1);
    };

  }
}(angular));
