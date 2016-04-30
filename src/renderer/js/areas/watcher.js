(function(angular, $) {
  'use strict';

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/watcher/:stamp', {
        controller: 'WatcherController',
        templateUrl: 'view/watcher.html'
      })
    }])
    .controller('WatcherController', [
      '$scope',
      '$rootScope',
      '$location',
      '$routeParams',
      WatcherController
    ]);

  function WatcherController($scope, $rootScope, $location, $routeParams) {

    const stamp = $routeParams.stamp;

    // model
    $scope.model = {};
    $scope.action = {};

    // 获取文件内容
    $scope.data = $.storage.get(stamp);

    if (!$scope.data) {
      // TODO: 没有文件情况
      alert('没有对应的测评信息！');
      $location.url('/starter');
      return false;
    }

    // 状态
    $rootScope.current_stamp = stamp;

    // 测评人数
    $.storage.watch(stamp, (data) => {
      // $scope.data.rated_count = data.rated_count;
      $scope.data = data;
      $scope.$apply();
    });

    // 当前状态为未打分
    if ($scope.data.status === $.options.status_keys.rating) {
      // 启动一个服务
      $scope.data.rate_link = $.options.server_link + stamp;
    }

    $scope.data.leave_count = ((reasons) => {
      let result = 0;
      for (let key in reasons) {
        result += reasons[key];
      }
      return result;
    })($scope.data.reasons);

    // ===== 添加新邮箱 =====
    $scope.model.email_input = '';

    $scope.action.add_email = () => {
      if (!$scope.model.email_input)
        return
      $scope.model.email_input.includes('@') || ($scope.model.email_input += '@itcast.cn');
      $scope.data.added_emails.push({ name: '手动添加', title: '系统', email: $scope.model.email_input });
      save();
      $scope.model.email_input = '';
    };

    $scope.action.del_email = () => {
      $scope.data.added_emails.splice($scope.data.added_emails.indexOf(this), 1);
      save();
    };
    // ===== ======= =====

    // 复制链接
    $scope.action.copy = () => {
      $.electron.clipboard.writeText($scope.data.rate_link);
      alert('已经将打分链接复制到剪切板\n请将链接发送给学生');
    };

    $scope.action.start = () => {
      // 当前状态为未打分
      if ($scope.data.status === $.options.status_keys.initial) {
        // 启动一个服务
        $scope.data.rate_link = $.options.server_link + stamp;
        $scope.data.status = $.options.status_keys.rating;
        save();
      }
    };

    $scope.action.stop = () => {
      if (!$scope.data.rated_count) {
        alert('尚未有人提交测评表单！');
        return false;
      }
      if (!(confirm('确定结束吗？')))
        return false;
      if ($scope.data.status === $.options.status_keys.rating) {
        $scope.data.status = $.options.status_keys.rated;
        delete $scope.data.rate_link;
        save();

        // 计算报告
        Object.assign($scope.data, $.report(stamp));
        save();
      }
    };

    $scope.action.send = () => {
      console.log($scope.data);

      if (!(confirm('确定发送邮件吗？')))
        return false;
      if ($scope.data.status === $.options.status_keys.rated) {
        $.mail.send($scope.data);
        $scope.data.status = $.options.status_keys.sending;
        save();
      }
    };

    function save() {
      $.storage.set(stamp, $scope.data);
    }

  }
}(angular, $));
