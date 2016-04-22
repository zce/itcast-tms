(function(angular) {
  'use strict';

  angular.module('itcast-tms.directives')
    .directive('resizer', ['$window', '$document', function($window, $document) {
      return {
        restrict: 'C',
        link: function(scope, element, attributes, controller) {
          let beginX = 0;
          let beginWidth = 0;
          const sidebar = element.parent();
          window.$sidebar = sidebar;
          window.$doc = $document;
          window.$win = $window;
          const mousemove = (e) => {
            let change = e.clientX - beginX;
            let sidebarWidth = beginWidth + change;
            sidebarWidth = sidebarWidth < 120 ? 120 : sidebarWidth;
            sidebar.css('width', sidebarWidth + 'px');
            // setTimeout(() => { sidebar.css('width', sidebarWidth + 'px') }, 0);
          };

          const mouseup = (e) => {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
            sidebar.css('-webkit-transition', 'width 0.2s ease-in-out');
          };

          element.on('mousedown', (e) => {
            beginX = e.clientX;
            const width = $window.getComputedStyle(sidebar[0]);
            beginWidth = parseInt(width) || 222;
            sidebar.css('-webkit-transition', 'none');
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          });
        }
      };
    }]);;

}(angular));
