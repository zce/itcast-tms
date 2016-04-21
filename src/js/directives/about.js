(function(angular) {
  'use strict';

  angular.module('itcast-tms.directives')
    .directive('about', ['options', function(options) {
      return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
          open: '='
        }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
        template: `<div class="dialog" ng-class="{open:open}">
    <div class="dialog-window">
      <div class="dialog-text">
        <h4>{{app_name}}</h4>
        <h5>System: <strong>{{app_version}}</strong> Data: <strong>{{data_version}}</strong></h5>
        <p>Copyright &copy; Itcast, Inc. All Rights Reserved.</p>
      </div>
      <div class="dialog-buttons">
        <button class="dialog-button" ng-click="open=false">OK</button>
        <button class="dialog-button">Cancel</button>
      </div>
    </div>
  </div>`,
        // templateUrl: '',
        replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function(scope, element, attributes, controller) {
          // scope.open = attributes.open;
          // console.log(attributes);
          scope.app_name = options.app_name;
          scope.app_version = options.app_version;
          scope.data_version = options.data_version;
        }
      };
    }]);;

}(angular));
