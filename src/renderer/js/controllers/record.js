;(function (angular, $) {
  'use strict'

  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$rootScope',
      '$location',
      RecordController
    ])

  function RecordController ($scope, $rootScope, $location) {
    this.records = {}

    const loadFiles = () => {
      this.records = {}
      $.fs.readdir($.options.storage_root, (error, files) => {
        if (error) {
          $.logger.error('没有存贮目录：' + $.options.storage_root)
          return false
        }
        files.forEach(file => file.endsWith($.options.storage_ext) && (this.records[$.path.basename(file, $.options.storage_ext)] = $.path.join($.options.storage_root, file)))
        $scope.$apply()
      })
    }

    loadFiles()

    $.fs.watch($.options.storage_root, { interval: 300 }, (event, filename) => {
      if (event !== 'change'){
        loadFiles()
      }
    })

    this.remove = (key, e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!confirm(`确认删除『${key}${$.options.storage_ext}』?`)){
        return false
      }
      this.records[key] && $.fs.unlink(this.records[key], error => {
        if (error) {
          $.logger.error(error)
          return false
        }
        // 当前打开的不是该文件
        if ($rootScope.current_stamp !== key){
          return false
        }

        const stamps = Object.keys(this.records)
        stamps.remove(key)
        // console.log(stamps)
        if (stamps && stamps.length){
          $location.url('/watcher/' + stamps[0])
        }
        else{
          $location.url('/starter')
        }
      })
      // delete this.records[key]

      return false
    }

    this.reveal = (name, e) => {
      e.preventDefault()
      e.stopPropagation()

      this.records[name] && $.electron.shell.showItemInFolder(this.records[name])
    }
  }
}(angular, $))
