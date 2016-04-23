(function(angular) {
  'use strict';

  const remote = window.require && require('electron').remote;
  const fs = window.require && require('fs');
  const path = window.require && require('path');

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$location',
      'options',
      RecordController
    ]);

  function RecordController($scope, $location, options) {

    $scope.records = {};

    function loadFiles() {
      $scope.records = {};
      fs && fs.readdir(options.log_root, (error, files) => {
        files.forEach(file => {
          if (file.endsWith(options.log_ext))
            $scope.records[file] = path.join(options.log_root, file);
        });
        // console.log($scope.records);
        $scope.$apply();
      });
    }

    loadFiles();

    fs && fs.watch(options.log_root, { interval: 100 }, (event, filename) => {
      if (event !== 'change')
        loadFiles();
    });

    $scope.remove = (key, e) => {
      e.preventDefault();
      e.stopPropagation();
      $scope.records[key] && fs.unlink($scope.records[key]);
      // delete $scope.records[key];
      return false;
    };

    $scope.open = (key) => {
      // $rootScope.current_filename = key;
      console.log(path.basename(key, options.log_ext));
      $location.url('/watcher/' + path.basename(key, options.log_ext));
    };

  }

}(angular));
