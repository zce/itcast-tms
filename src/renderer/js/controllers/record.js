(function(angular, $) {
  'use strict';

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$location',
      RecordController
    ]);

  function RecordController($scope, $location) {

    $scope.records = {};

    function loadFiles() {
      $scope.records = {};
      $.fs.readdir($.options.storage_root, (error, files) => {
        files.forEach(file => {
          if (file.endsWith($.options.log_ext))
            $scope.records[file] = $.path.join($.options.storage_root, file);
        });
        // console.log($scope.records);
        $scope.$apply();
      });
    }

    loadFiles();

    $.fs.watch($.options.storage_root, { interval: 100 }, (event, filename) => {
      if (event !== 'change')
        loadFiles();
    });

    $scope.remove = (key, e) => {
      e.preventDefault();
      e.stopPropagation();
      $scope.records[key] && $.fs.unlink($scope.records[key]);
      // delete $scope.records[key];
      return false;
    };

    $scope.open = (key) => {
      // $rootScope.current_filename = key;
      // console.log($.path.basename(key, $.options.log_ext));
      $location.url('/watcher/' + $.path.basename(key, $.options.storage_ext));
    };

  }

}(angular, $));
