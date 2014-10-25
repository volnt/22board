app.controller("MainCtrl", function($scope, $http, $routeParams, $location, Page) {

  $scope.Page = Page;
  $scope.is_authenticated = false;
  $scope.token = {};

  $scope.token_verify = function() {
    $http.post('/api/token/verify', $scope.token).success(function(response) {
      $scope.is_authenticated = true;
    }).error(function() {
      $scope.is_authenticated = false;
      $scope.token = {};
    });
  }

  $scope.token_request = function() {
    $http.get('/api/token/request').success(function(response) {
      $scope.token.sha = response.sha;
    }).error(function() {
    });
  }

  $scope.main = function() {
    /*
    * Entry point of the controller.
    */
  }();
});
