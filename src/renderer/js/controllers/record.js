(function(angular, $) {
  'use strict';

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$rootScope',
      '$location',
      RecordController
    ]);

  function RecordController($scope, $rootScope, $location) {

    this.records = {};

    const loadFiles = () => {
      this.records = {};
      $.fs.readdir($.options.storage_root, (error, files) => {
        error && $.logger.error('没有存贮目录：' + $.options.storage_root);
        files.forEach(file => file.endsWith($.options.storage_ext) && (this.records[$.path.basename(file, $.options.storage_ext)] = $.path.join($.options.storage_root, file)));
        $scope.$apply();
      });
    }

    loadFiles();

    $.fs.watch($.options.storage_root, { interval: 300 }, (event, filename) => {
      if (event !== 'change')
        loadFiles();
    });

    this.remove = (key, e) => {
      if (!confirm(`确认删除『${key}${$.options.storage_ext}』?`))
        return false;
      e.preventDefault();
      e.stopPropagation();
      this.records[key] && $.fs.unlink(this.records[key]);
      // delete this.records[key];
      return false;
    };

  }

}(angular, $));
