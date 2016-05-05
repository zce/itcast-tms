;(function (angular, $) {
  'use strict'

  angular.module('itcast-tms.directives')
    .directive('about', [about])

  function about () {
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: {
        opened: '='
      }, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
      template: `<div class="dialog" ng-class="{open:opened}">
    <div class="dialog-window">
      <div class="dialog-text">
        <h4>{{app_name}}</h4>
        <h6>Core: <strong>v{{core_version}}</strong></h6>
        <h6>Data: <strong>v{{data_version}}</strong></h6>
        <h6>Updater: <strong>v{{updater_version}}</strong></h6>
        <p>Copyright &copy; Itcast, Inc. All Rights Reserved.</p>
      </div>
      <div class="dialog-buttons">
        <button class="dialog-button" ng-click="opened=false">OK</button>
      </div>
    </div>
  </div>`,
      // <button class="dialog-button">Cancel</button>
      // templateUrl: '',
      replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function (scope, element, attributes, controller) {
        // scope.open = attributes.open
        // console.log(attributes)
        scope.app_name = $.options.app_name
        scope.core_version = $.options.core_version
        scope.data_version = $.options.data_version
        scope.updater_version = $.options.updater_version
      }
    }
  }
}(angular, $))
