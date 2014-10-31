app.controller("MainCtrl", function($scope, $http, $routeParams, $location, Page, Auth) {

  $scope.Page = Page;
  $scope.Auth = Auth;

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
});
