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

    //创建新文件
    delete $rootScope.current_stamp;

    // 会改变的数据
    $scope.model = {};
    // 不会改变的数据
    $scope.data = {};
    // 行为
    $scope.action = {};

    // view model initial
    $scope.model.school_name = '';
    $scope.model.academy_name = '';
    $scope.model.subject_name = '';
    $scope.model.class_count = 100;
    $scope.model.reasons = { 留级: 0, 病假: 0, 事假: 0, 回学校: 0, 已就业: 0, 其他教室自习: 0, 在家复习: 0, 不想听课: 0, 其他: 0 };
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
      $scope.data.subjects = subjects.filter(item => item.academy === $scope.model.academy_name && item.school === $scope.model.school_name);
      $scope.data.subjects.length && ($scope.model.subject_name = $scope.data.subjects[0].name);
    };
    // 校区和学院改变 → 学科对应变化
    $scope.$watch('model.school_name', showSubjects);
    $scope.$watch('model.academy_name', showSubjects);

    // ===== 创建一个打分文件 =====
    $scope.action.start = () => {

      // 校验表单数据
      for (let key in $scope.model) {
        if (!$scope.model[key]) {
          alert('请完整填写所有信息！');
          return false;
        }
      }

      // 处理邮箱后缀
      $scope.model.teacher_email.includes('@') || ($scope.model.teacher_email += '@itcast.cn');

      // 当前选择的校区、学院、学科信息
      const school = schools[$scope.model.school_name];
      const academy = academies[$scope.model.academy_name];
      const subject = subjects.find(s => s.academy === $scope.model.academy_name && s.school === $scope.model.school_name && s.name === $scope.model.subject_name);

      // 已经测评人数
      $scope.model.rated_count = 0;

      // 测评信息：{ip:{note:'',marks:{2015:{},2016:{}}}}
      $scope.model.rated_info = {};

      // 测评记录状态初始化
      $scope.model.status = $.options.status_keys.initial;

      // 本次测评问题
      let rule_keys = subject.rules && subject.rules.length ? subject.rules : academy.rules && academy.rules.length ? academy.rules : school.rules && school.rules.length ? school.rules : itcast.rules;
      (rule_keys && rule_keys.length) || $.logger.error(new Error(`【${$scope.model.school_name} / ${$scope.model.academy_name} / ${$scope.model.subject_name}】 没有题目信息`))
      $scope.model.rules = {};
      rule_keys.forEach(k => $scope.model.rules[k] = rules[k])

      // 本次测评的收件人列表
      $scope.model.emails = $.data.itcast().emails.concat(school.emails, academy.emails, subject.emails)
        // 手动添加的收件人
      $scope.model.added_emails = [];

      // 获取一个戳
      $scope.model.stamp = String.getStamp();

      // 持久化
      $.storage.set($scope.model.stamp, $scope.model);

      // 全局打开当前创建的记录
      $rootScope.current_stamp = $scope.model.stamp;

      // 打开当前记录
      $location.url('/watcher/' + $scope.model.stamp);

    };

  }

}(angular, $));
