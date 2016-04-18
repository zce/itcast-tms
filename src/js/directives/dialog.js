(function(angular) {
  'use strict';

  angular.module('itcast-tms.directives.dialog', [])
    .directive('dialog', ['$document', function($document) {
      return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
        template: `<div class="dialog" ng-class="{open:open}">
    <div class="dialog-window">
      <div class="dialog-text" ng-transclude></div>
      <div class="dialog-buttons">
        <button class="dialog-button" ng-click="open=false">OK</button>
        <!-- <button class="dialog-button">Cancel</button> -->
      </div>
    </div>
  </div>`,
        // templateUrl: '',
        replace: true,
        transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function(scope, element, attributes, controller) {
          // scope.open = true;
        }
      };
    }]);;

}(angular));
