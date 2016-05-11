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
        <table>
          <tr><td>Core:</td><td><strong>v{{core_version}}</strong></td><td>Node:</td><td><strong>v{{node_version}}</strong></td></tr>
          <tr><td>Data:</td><td><strong>v{{data_version}}</strong></td><td>Chrome:</td><td><strong>v{{chrome_version}}</strong></td></tr>
          <tr><td>Updater:</td><td><strong>v{{updater_version}}</strong></td><td>Electron:</td><td><strong>v{{electron_version}}</strong></td></tr>
        </table>
        <p>Copyright &copy; Itcast, Inc. All Rights Reserved.</p>
      </div>
      <div class="dialog-buttons">
        <button class="dialog-button" ng-click="opened=false">OK</button>
      </div>
    </div>
  </div>`,
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
        scope.node_version = process.versions.node
        scope.chrome_version = process.versions.chrome
        scope.electron_version = process.versions.electron
      }
    }
  }
}(window.angular, window.$))
