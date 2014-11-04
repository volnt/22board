app.controller("IndexCtrl", function($scope, $http, $routeParams, $location, Page, Auth, Alert) {

  $scope.Page = Page;
  $scope.Auth = Auth;
  $scope.Alert = Alert;

  $scope.main = function() {
    /*
    * Entry point of the controller.
    */
    $(".navbar").addClass("navbar-transparent");
  }();
});
