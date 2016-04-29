(function(angular, $) {
  'use strict';

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$location',
      RecordController
    ]);

  function RecordController($scope, $location) {

    this.records = {};

    const loadFiles = () => {
      this.records = {};
      $.fs.readdir($.options.storage_root, (error, files) => {
        if (error)
          $.logger.error('没有存贮目录：' + $.options.storage_root);
        files.forEach(file => file.endsWith($.options.storage_ext) && (this.records[file] = $.path.join($.options.storage_root, file)));

        $scope.$apply();
      });
    }

    loadFiles();

    $.fs.watch($.options.storage_root, { interval: 100 }, (event, filename) => {
      if (event !== 'change')
        loadFiles();
    });

    this.remove = (key, e) => {
      e.preventDefault();
      e.stopPropagation();
      this.records[key] && $.fs.unlink(this.records[key]);
      // delete this.records[key];
      return false;
    };

    this.open = (key) => {
      // $rootScope.current_filename = key;
      // console.log($.path.basename(key, $.options.storage_ext));
      $location.url('/watcher/' + $.path.basename(key, $.options.storage_ext));
    };

  }

}(angular, $));
