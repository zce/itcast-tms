(function(angular, $) {
  'use strict';

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/starter', {
        controller: 'StarterController',
        templateUrl: 'view/starter.html'
      })
    }])
    .controller('StarterController', [
      '$scope',
      '$rootScope',
      '$location',
      'Storage',
      'Data',
      StarterController
    ]);

  function StarterController($scope, $rootScope, $location, Storage, Data) {

    $scope.model = {};
    $scope.action = {};
    $scope.data = {};

    $scope.model.school_name = '';
    $scope.model.academy_name = '';
    $scope.model.subject_name = '';
    $scope.model.class_count = 100;
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
    $scope.model.class_name = '1020前端与移动开发就业班';
    $scope.model.course_name = 'AngularJS';
    $scope.model.course_days = 10;
    $scope.model.head_name = '汪磊';
    $scope.model.teacher_name = '汪磊';
    $scope.model.teacher_email = 'ice';
    $scope.model.datetime = new Date().format('yyyy-MM-dd HH:mm');

    // ===== 读取配置文件 =====
    $scope.data.schools = Data.schools();
    $scope.data.schools && ($scope.model.school_name = Object.keys($scope.data.schools)[0]);
    $scope.data.academies = Data.academies();
    $scope.data.academies && ($scope.model.academy_name = Object.keys($scope.data.academies)[0]);
    const subjects = Data.subjects();
    const showSubjects = () => {
      $scope.data.subjects = subjects.filter((item) => item.academy === $scope.model.academy_name && item.school === $scope.model.school_name);
      if ($scope.data.subjects.length)
        $scope.model.subject_name = $scope.data.subjects[0].name;
    };
    $scope.$watch('model.school_name', showSubjects);
    $scope.$watch('model.academy_name', showSubjects);

    // ===== 创建一个打分文件 =====
    $scope.action.start = () => {

      // 校验表单数据
      for (let key in $scope.model) {
        let item = $scope.model[key];
        if (!item) {
          alert('请完整填写所有信息！');
          return false;
        }
      }

      // 额外状态
      $scope.model.rated_count = 0;
      $scope.model.status = $.options.status_keys.initial;
      const itcastEmails = Data.itcast().emails;
      const schoolEmails = Data.schools()[$scope.model.school_name].emails;
      const academyEmails = Data.academies()[$scope.model.academy_name].emails;
      const subjectEmails = Data.subjects().find(s => s.academy === $scope.model.academy_name && s.school === $scope.model.school_name && s.name === $scope.model.subject_name).emails;
      $scope.model.emails = itcastEmails.concat(schoolEmails, academyEmails, subjectEmails)

      // 持久化
      const stamp = String.getStamp();
      // $rootScope.current_filename = stamp + $.options.storage_ext;
      Storage.set(stamp, $scope.model);
      $location.url('/watcher/' + stamp);

    };

  }

}(angular, $));
