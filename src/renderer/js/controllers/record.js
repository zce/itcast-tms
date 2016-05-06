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
      if (event !== 'change') {
        loadFiles()
      }
    })

    this.remove = (name, e) => {
      e.preventDefault()
      e.stopPropagation()

      if (!$.confirm(`确认删除『${name}${$.options.storage_ext}』?`)) return false

      try {
        // 删除到回收站
        this.records[name] && $.electron.shell.moveItemToTrash(this.records[name])
      } catch (e) {
        $.logger.error(e)
        return false
      }

      // 当前打开的不是该文件
      if ($rootScope.current_stamp !== name) {
        return false
      }
      // 跳转到第一个记录
      const stamps = Object.keys(this.records)
      stamps.splice(stamps.indexOf(name), 1)
      // console.log(stamps)
      if (stamps && stamps.length) {
        $location.url('/watcher/' + stamps[0])
        return false
      }
      // 没有记录跳转到开始界面
      $location.url('/starter')

      return false
    }

    this.reveal = (name, e) => {
      e.preventDefault()
      e.stopPropagation()

      this.records[name] && $.electron.shell.showItemInFolder(this.records[name])
    }
  }
}(window.angular, window.$))
