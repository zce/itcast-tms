(function(angular, $) {
  'use strict';

  const itcast = $.data.itcast();
  const schools = $.data.schools();
  const academies = $.data.academies();
  const subjects = $.data.subjects();
  const rules = $.data.rules();

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
      StarterController
    ]);

  function StarterController($scope, $rootScope, $location) {

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
    $scope.data.schools = schools;
    $scope.data.schools && ($scope.model.school_name = Object.keys($scope.data.schools)[0]);
    $scope.data.academies = academies;
    $scope.data.academies && ($scope.model.academy_name = Object.keys($scope.data.academies)[0]);
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
      // 当前选择的学院信息
      const school = schools[$scope.model.school_name];
      const academy = academies[$scope.model.academy_name];
      const subject = subjects.find(s => s.academy === $scope.model.academy_name && s.school === $scope.model.school_name && s.name === $scope.model.subject_name);

      // 已评价人数
      $scope.model.rated_count = 0;
      $scope.model.rated_info = {};
      // 额外状态
      $scope.model.status = $.options.status_keys.initial;

      // 本次测评问题
      let rule_keys = subject.rules && subject.rules.length ? subject.rules : academy.rules && academy.rules.length ? academy.rules : school.rules && school.rules.length ? school.rules : itcast.rules;
      if (!(rule_keys && rule_keys.length))
        $.logger.error(new Error(`【${$scope.model.school_name} / ${$scope.model.academy_name} / ${$scope.model.subject_name}】 没有题目信息`))
      $scope.model.rules = {}; //rules.filter(q => rule_keys.includes(q));
      rule_keys.forEach(k => {
        $scope.model.rules[k] = rules[k];
      })

      // 本次测评的收件人列表
      const emails1 = school.emails;
      const emails2 = academies.emails;
      const emails3 = subject.emails;
      $scope.model.emails = $.data.itcast().emails.concat(emails1, emails2, emails3)

      // 持久化
      const stamp = String.getStamp();
      // $rootScope.current_filename = stamp + $.options.storage_ext;
      $.storage.set(stamp, $scope.model);
      $location.url('/watcher/' + stamp);

    };

  }

}(angular, $));
