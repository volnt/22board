app.controller("MainCtrl", function($scope, $http, $routeParams, $location, Page, Auth) {

  $scope.Page = Page;
  $scope.Auth = Auth;

  $scope.main = function() {
    /*
    * Entry point of the controller.
    */
  }();
});
