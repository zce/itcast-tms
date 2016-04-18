(function(angular) {
  'use strict';

  const remote = window.require && require('electron').remote;
  const fs = window.require && require('fs');
  const path = window.require && require('path');

  angular
    .module('itcast-tms.areas.starter', [])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/starter', {
        controller: 'StarterController',
        templateUrl: 'starter_tmpl'
      })
    }])
    .controller('StarterController', ['$scope', function($scope) {

      $scope.school_name = '';
      $scope.academy_name = '';
      $scope.subject_name = '';
      $scope.class_count = 0;
      $scope.reasons = {
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
      $scope.class_name = '';
      $scope.course_name = '';
      $scope.course_days = 0;
      $scope.head_name = '';
      $scope.teacher_name = '';
      $scope.teacher_email = '';
      $scope.datetime = new Date().format('yyyy-MM-dd HH:mm');

      $scope.start = () => {
        console.log($scope);
      };

      // =====
      const schools = require(path.join(APP_ROOT, '/data/schools.json'));
      $scope.schools = schools;
      $scope.school_name = Object.keys(schools)[0];
      const academies = require(path.join(APP_ROOT, '/data/academies.json'));
      $scope.academies = academies;
      $scope.academy_name = Object.keys(academies)[0];
      const subjects = require(path.join(APP_ROOT, '/data/subjects.json'));
      // $scope.subjects = subjects;

      const showSubjects = () => {
        $scope.subjects = _.filter(subjects, (item) => item.academy === $scope.academy_name && item.school === $scope.school_name);
        if ($scope.subjects.length) {
          $scope.subject_name = $scope.subjects[0].name;
        } else {
          $scope.subject_name = '暂无对应学科';
          // console.log($scope.subject_name);
        }
      };
      $scope.$watch('school_name', showSubjects);
      $scope.$watch('academy_name', showSubjects);
    }]);

}(angular));
