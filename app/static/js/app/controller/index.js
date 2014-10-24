app.controller("IndexCtrl", function($scope, $http, $routeParams, Page) {

  $scope.loading = true;
  $scope.Page = Page;

  $scope.shas = [];
  $scope.messages = {};
  $scope.message = "";

  $scope.alerts = {
    success: "",
    danger: "",

    setSuccess: function(message) {
      $scope.alerts.danger = "";
      $scope.alerts.success = message;
    },
    setDanger: function(message) {
      $scope.alerts.danger = message;
      $scope.alerts.success = "";
    },
    reset: function() {
      $scope.alerts.danger = "";
      $scope.alerts.success = "";
    }
  }

  $scope.getMessage = function(sha) {
    $http.get("/api/message/"+sha).success(function(response) {
      $scope.alerts.reset();
      $scope.messages[sha] = response;
    }).error(function(response) {
      $scope.alerts.setDanger(response.error);
    });
  }

  $scope.submitMessage = function() {
    $http.post("/api/message", {"message": $scope.message}).success(function(response) {
      $scope.alerts.reset();
      $scope.messages[response.sha] = response;
      $scope.shas.push(response.sha);
      $scope.message = "";
    }).error(function(response) {
      $scope.alerts.setDanger(response.error);
    });
  }

  $scope.main = function() {
    $http.get("/api/messages").success(function(response) {
      $scope.alerts.reset();
      $scope.shas = response.messages;
    }).error(function(response) {
      $scope.alerts.setDanger(response.error);
    });
  }();
});
