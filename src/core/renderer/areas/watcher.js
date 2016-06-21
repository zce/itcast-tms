;(function (angular, $) {
  'use strict'
  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/watcher/:stamp', {
        controller: 'WatcherController',
        templateUrl: 'views/watcher.html'
      })
    }])
    .controller('WatcherController', [
      '$scope',
      '$rootScope',
      '$location',
      '$routeParams',
      '$timeout',
      WatcherController
    ])

  function WatcherController ($scope, $rootScope, $location, $routeParams, $timeout) {
    // 获取当前打开记录的stamp
    const stamp = $routeParams.stamp

    // model
    $scope.model = {}
    $scope.action = {}

    // 获取记录文件内容
    $scope.data = $.storage.get(stamp)

    // TODO: 没有文件情况
    if (!$scope.data) {
      $.alert('没有对应的测评信息！')
      $location.url('/starter')
      return false
    }

    // 全局记录当前打开记录stamp
    $rootScope.current_stamp = stamp
    // $rootScope.$watch('current_stamp', now => now == stamp || $location.url('/starter'))

    // 监视测评人数
    $.storage.watch(stamp, data => {
      // $scope.data.rated_count = data.rated_count
      $scope.data = data
      $scope.$apply()
    })

    // 添加新邮箱
    $scope.model.email_input = ''
    $scope.action.add_email = () => {
      if (!$scope.model.email_input) return false
      $scope.model.email_input.includes('@') || ($scope.model.email_input += '@itcast.cn')
      $scope.data.added_emails.push({ name: '手动添加', title: '系统', email: $scope.model.email_input })
      $scope.model.email_input = ''
      save()
    }

    // 删除邮箱
    $scope.action.del_email = (item) => {
      $scope.data.added_emails.splice($scope.data.added_emails.indexOf(item), 1)
      save()
    }
    // ===== ======= =====

    // 复制链接
    $scope.action.copy = txt => {
      $.electron.clipboard.writeText(txt)
      $.alert('已经将打分链接复制到剪切板\n请将链接发送给学生')
    }

    // 开始评测按钮
    $scope.action.start = () => {
      // 当前状态为初始状态
      if ($scope.data.status === $.options.status_keys.initial) {
        // 开始测评
        $scope.data.status = $.options.status_keys.rating
        save()
      }
    }

    // 结束评测按钮
    let stoping = false
    $scope.action.stop = () => {
      if (stoping) return false
      // 防止多次点击
      stoping = true
      $scope.data.rated_count = Object.keys($scope.data.rated_info).length
      if (!$scope.data.rated_count) {
        $.alert('尚未有人提交测评表单！')
        stoping = false
        return false
      }
      if (!($.confirm('确定结束吗？') && $.confirm('真的确定结束吗？'))) {
        stoping = false
        return false
      }
      // 当前状态为正在测评
      if ($scope.data.status === $.options.status_keys.rating) {
        // 测评完成状态
        $scope.data.status = $.options.status_keys.rated
        save()
        stoping = false
      // 计算报告
      // $.report($scope.data)
      // Object.assign($scope.data, $.report($scope.data))
      // save()
      }
    }

    // 发送邮件按钮
    let sending = false
    $scope.action.send = () => {
      if (sending) return false
      // 防止多次点击
      sending = true
      // console.log($scope.data)
      if (!($.confirm('确定发送邮件吗？'))) {
        sending = false
        return false
      }
      if ($scope.data.status === $.options.status_keys.rated) {
        $scope.data.status = $.options.status_keys.sending
        save()
        $timeout(() => {
          // 发送邮件
          $.mail($scope.data)
            .then(message => {
              // $.logger.info(message)
              $scope.data.status = $.options.status_keys.send
              save()
              // $.alert('邮件发送成功\n' + JSON.stringify(message))
              sending = false
            })
            .catch(error => {
              $.logger.fatal(error)
              if (error.code === 'ENOTFOUND' && error.syscall === 'getaddrinfo') {
                $.alert('网络连接失败，请确认网络正常')
              } else if (error.responseCode === 550 && error.code === 'EENVELOPE') {
                $.alert(`收件人错误（不存在）
请将本次打分的记录文件「${stamp}${$.options.storage_ext}」
发送到「wanglei3@itcast.cn」`)
              } else if (error.responseCode === 598) {
                $.alert(`邮件中包含违禁词，发送失败
请将本次打分的记录文件「${stamp}${$.options.storage_ext}」
发送到「wanglei3@itcast.cn」`)
              } else {
                $.alert('邮件发送失败\n请将「renderer.log」发送到「wanglei3@itcast.cn」')
              }
              // 测评完成状态
              $scope.data.status = $.options.status_keys.rated
              save()
              sending = false
            })
        }, 0)
      }
    }

    function save () {
      $.storage.set(stamp, $scope.data)
    }
  }
}(window.angular, window.$))
