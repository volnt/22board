app.controller("MessagesCtrl", function($scope, $http, $routeParams, Page, Auth, Alert) {
  $scope.Page = Page;
  $scope.Auth = Auth;
  $scope.Alert = Alert;

  $scope.shas = [];
  $scope.messages = {};
  $scope.message = "";
  $scope.currentPage = 1;
  $scope.pageSize = 10;

  $scope.addKarma = function(sha) {
    $http.post("/api/message/"+sha+"/karma", {"auth": $scope.Auth.token()}).success(function(response) {
      Alert.reset();
      $scope.messages[sha] = response;
    }).error(function(response) {
      Alert.setDanger(response.error);
    });
  }

  $scope.getMessages = function(shas) {
    $http.get("/api/message/lookup", {"params": {"shas": shas.join(",")}}).success(function(response) {
      Alert.reset();
      for (var sha in response) {
        $scope.messages[sha] = response[sha];
      }
      console.log($scope.messages);
    }).error(function(response) {
      Alert.setDanger(response.error);
    });
  }

  $scope.getTrending = function() {
    $http.get("/api/messages/trending").success(function(response) {
      Alert.reset();
      $scope.shas = response.messages;
      $scope.getMessages($scope.shas);
    }).error(function(response) {
      Alert.setDanger(response.error);
    });
  }

  $scope.getNew = function() {
    $http.get("/api/messages/new").success(function(response) {
      Alert.reset();
      $scope.shas = response.messages;
      $scope.getMessages($scope.shas);
    }).error(function(response) {
      Alert.setDanger(response.error);
    });
  }

  $scope.main = function() {
    if ($routeParams.type == "new") {
      $scope.getNew();
    } else if ($routeParams.type == "trending") {
      $scope.getTrending();
    }
  }();
});
