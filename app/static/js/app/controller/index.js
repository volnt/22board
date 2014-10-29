app.controller("IndexCtrl", function($scope, $http, $routeParams, Page, Auth) {

  $scope.loading = true;
  $scope.Page = Page;
  $scope.Auth = Auth;

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

  $scope.$watch('message', function(nv, ov) {
    var pattern = GeoPattern.generate(nv);
    $('#messages').css('background-image', pattern.toDataUrl());
  });

  $scope.getMessages = function(shas) {
    $http.get("/api/message/lookup", {"params": {"shas": shas.join(",")}}).success(function(response) {
      $scope.alerts.reset();
      for (var sha in response) {
        $scope.messages[sha] = response[sha];
      }
    }).error(function(response) {
      $scope.alerts.setDanger(response.error);
    });
  }

  $scope.submitMessage = function() {
    $http.post("/api/message", {"message": $scope.message, "auth": $scope.Auth.token()}).success(function(response) {
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
      $scope.getMessages($scope.shas);
    }).error(function(response) {
      $scope.alerts.setDanger(response.error);
    });
  }();
});
