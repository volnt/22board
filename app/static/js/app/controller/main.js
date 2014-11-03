app.controller("MainCtrl", function($scope, $http, $routeParams, $location, Page, Auth, Alert) {

  $scope.Page = Page;
  $scope.Auth = Auth;
  $scope.Alert = Alert;

  $scope.main = function() {
    /*
    * Entry point of the controller.
    */
    $scope.Auth.token_load();
    $(window).scroll(function() {
      if ($('html body').scrollTop() == 0) {
        $('.message-input').addClass('hidden');
      } else {
        $('.message-input').removeClass('hidden');
      }
      if ($('html body').scrollTop() > $('#messages').offset().top - 50) {
        $('.navbar').removeClass('navbar-transparent');        
      } else {
        $('.navbar').addClass('navbar-transparent');
      }
    });
  }();

  $scope.submitMessage = function() {
    $http.post("/api/message", {"message": $scope.message, "auth": $scope.Auth.token()}).success(function(response) {
      Alert.reset();
      $scope.messages[response.sha] = response;
      $scope.shas.push(response.sha);
      $scope.message = "";
    }).error(function(response) {
      Alert.setDanger(response.error);
    });
  }
});
