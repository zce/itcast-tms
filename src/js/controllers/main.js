(function(angular) {
  'use strict';

  const remote = window.require && require('electron').remote;

  angular.module('itcast-tms.controllers.main', [])
    .controller('MainController', ['$scope', function($scope) {

      // ===== title =====
      $scope.title = 'Hello world';

      // ===== window button =====
      $scope.window = (action) => {
        const mainWindow = remote && remote.BrowserWindow.getFocusedWindow();
        // console.log(mainWindow);
        mainWindow && mainWindow[action] && mainWindow[action]();
      };

      // ===== sidebar =====
      $scope.sidebarOpened = true;
      $scope.toggleSidebar = () => {
        $scope.sidebarOpened = !$scope.sidebarOpened;
      };


      // ===== settings =====
      $scope.settingsOpened = false;

      // ===== theme =====
      $scope.theme = 'default';

    }]);

}(angular));
