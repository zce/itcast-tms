(function(angular) {
  'use strict';

  const path = window.require && require('path');
  const remote = window.require && require('electron').remote;

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/starter', {
        controller: 'StarterController',
        templateUrl: 'starter_tmpl'
      })
    }])
    .controller('StarterController', [
      '$scope',
      '$rootScope',
      '$location',
      'options',
      'Storage',
      function($scope, $rootScope, $location, options, Storage) {

        $scope.model = {};
        $scope.action = {};
        $scope.data = {};

        $scope.model.school_name = '';
        $scope.model.academy_name = '';
        $scope.model.subject_name = '';
        $scope.model.class_count = 0;
        $scope.model.reasons = {
          '留级': 0,
          '病假': 0,
          '事假': 0,
          '回学校': 0,
          '已就业': 0,
          '其他教室自习': 0,
          '在家复习': 0,
          '不想听课': 0,
          '其他': 0,
        };
        $scope.model.class_name = '';
        $scope.model.course_name = '';
        $scope.model.course_days = 0;
        $scope.model.head_name = '';
        $scope.model.teacher_name = '';
        $scope.model.teacher_email = '';
        $scope.model.datetime = new Date().format('yyyy-MM-dd HH:mm');

        // ===== 读取配置文件 =====
        $scope.data.schools = require(path.join(options.app_root, '/data/schools.json'));
        $scope.model.school_name = Object.keys($scope.data.schools)[0];
        $scope.data.academies = require(path.join(options.app_root, '/data/academies.json'));
        $scope.model.academy_name = Object.keys($scope.data.academies)[0];
        const subjects = require(path.join(options.app_root, '/data/subjects.json'));
        const showSubjects = () => {
          $scope.data.subjects = _.filter(subjects, (item) => item.academy === $scope.model.academy_name && item.school === $scope.model.school_name);
          if ($scope.data.subjects.length)
            $scope.model.subject_name = $scope.data.subjects[0].name;
        };
        $scope.$watch('model.school_name', showSubjects);
        $scope.$watch('model.academy_name', showSubjects);

        // ===== 创建一个打分文件 =====
        $scope.action.start = () => {

          const stamp = String.getStamp();
          const filename = stamp + options.log_ext;
          $rootScope.current_filename = filename;
          Storage.set(path.join(options.log_root, filename), $scope.model);
          $location.url('/watcher/' + stamp);

        };

      }
    ]);

}(angular));

// 取当前编辑的文件
// let stamp = $routeParams.stamp;
// if (!stamp) {
//   // 新增
//   var filename = String.getStamp() + options.log_ext;
//   $rootScope.current_filename = filename;
//   Storage.set(path.join(options.log_root, filename), {});
//   return;
// }
// // 编辑现有文件
// $rootScope.current_filename = stamp + options.log_ext;
