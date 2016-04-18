(function(angular) {
  'use strict';

  const remote = window.require && require('electron').remote;

  angular.module('itcast-tms.controllers.record', [])
    .controller('RecordController', ['$scope', function($scope) {

      $scope.records = [
        'a12nsh.tms',
        'ns32as.tms',
        'js2111.tms',
        'u763nq.tms',
        'k19ha1.tms'
      ];

    }]);

}(angular));
