app.controller("MainCtrl", function($scope, $http, $routeParams, $location, Page, Auth, Alert) {

  $scope.Page = Page;
  $scope.Auth = Auth;
  $scope.Alert = Alert;

  $scope.main = function() {
    /*
    * Entry point of the controller.
    */
    $scope.Auth.token_load();
  }();
});
