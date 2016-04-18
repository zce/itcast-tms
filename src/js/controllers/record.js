(function(angular) {
  'use strict';

  const remote = require('electron').remote;
  const fs = require('fs');
  const path = require('path');

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      'options',
      function($scope, options) {

        $scope.records = {};
        fs.readdir(options.log_root, (error, files) => {
          files.forEach(file => {
            if (file.endsWith(options.log_ext))
              $scope.records[file] = path.join(options.log_root, file);
          });
        });

        $scope.remove = function(key) {
          fs.unlink($scope.records[key]);
          delete $scope.records[key];
        };

      }
    ]);

}(angular));
