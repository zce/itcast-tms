;(function (angular, $) {
  'use strict'

  angular.module('itcast-tms.directives')
    .directive('resizer', ['$window', '$document', 'Setting', resizer])

  function resizer ($window, $document, Setting) {
    return {
      restrict: 'C',
      link: function (scope, element, attributes, controller) {
        let beginX = 0
        let beginWidth = 0
        let sidebarWidth = 0
        const sidebar = element.parent()

        const mousemove = (e) => {
          let change = e.clientX - beginX
          sidebarWidth = beginWidth + change
          sidebarWidth = sidebarWidth < 120 ? 120 : sidebarWidth
          sidebar.css('width', sidebarWidth + 'px')
        // setTimeout(() => { sidebar.css('width', sidebarWidth + 'px') }, 0)
        }

        const mouseup = (e) => {
          $document.off('mousemove', mousemove)
          $document.off('mouseup', mouseup)
          Setting.set('sidebar_width', sidebarWidth + 'px')
          sidebar.css('transition', 'width 0.2s ease-in-out')
        }

        element.on('mousedown', (e) => {
          beginX = e.clientX
          // const width = $window.getComputedStyle(sidebar[0])
          const width = sidebar.css('width')
          sidebarWidth = beginWidth = parseInt(width) || 222
          sidebar.css('transition', 'none')
          $document.on('mousemove', mousemove)
          $document.on('mouseup', mouseup)
        })
      }
    }
  }
}(angular, $))
