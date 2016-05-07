;
(function(angular, $) {
  'use strict'
  angular.module('itcast-tms.controllers')
    .controller('RecordController', [
      '$scope',
      '$rootScope',
      '$location',
      RecordController
    ])

  function RecordController ($scope, $rootScope, $location) {
    this.records = []

    const loadFiles = () => {
      this.records = []
      $.fs.readdir($.options.storage_root, (error, files) => {
        if (error) return false
        files.forEach(file => {
          if (!file.endsWith($.options.storage_ext)) return false
          const stamp = $.path.basename(file, $.options.storage_ext)
          const info = $.storage.get(stamp)
          if (info) {
            this.records.push({ stamp: stamp, title: `${info.teacher_name}（${info.datetime}）`, path: $.path.join($.options.storage_root, file) })
          }
        })
        $scope.$apply()
      })
    }

    loadFiles()

    $.fs.watch($.options.storage_root, { interval: 400 }, (event, filename) => {
      if (event !== 'change') loadFiles()
    })

    this.remove = (item, e) => {
      e.preventDefault()
      e.stopPropagation()

      if (!$.confirm(`确认删除『${item.stamp}${$.options.storage_ext}』?`)) return false

      try {
        // 删除到回收站
        item.path && $.electron.shell.moveItemToTrash(item.path)
      } catch (e) {
        return $.logger.error(e)
      }

      // 当前打开的不是该文件
      if ($rootScope.current_stamp !== item.stamp) return false

      // 跳转到第一个记录
      this.records.splice(this.records.indexOf(item), 1)
        // console.log(this.records)
      if (this.records && this.records.length) {
        $location.url('/watcher/' + this.records[0].stamp)
        return false
      }
      // 没有记录跳转到开始界面
      $location.url('/starter')

      return false
    }

    this.reveal = (item, e) => {
      e.preventDefault()
      e.stopPropagation()

      item.path && $.electron.shell.showItemInFolder(item.path)
    }
  }
}(window.angular, window.$))
