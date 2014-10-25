var app = angular.module("app", ["ngRoute"])
                 .filter('safe', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "index.html",
    controller: "IndexCtrl"
  })
  .when("/:message", {
    templateUrl: "message.html",
    controller: "MessageCtrl"
  })
  .otherwise({redirectTo: '/'});
});

app.factory('Page', function() {
  var title = "22board";
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; }
  };
});

app.factory('Auth', function($http) {
  var authenticated = false;
  var tokens = {};

  return {
    is_authenticated: function() {
      return authenticated;
    },
    token: function() {
      return tokens;
    },
    token_verify: function() {
      $http.post('/api/token/verify', tokens).success(function(response) {
        authenticated = true;
      }).error(function() {
        authenticated = false;
        tokens = {};
      });
    },
    token_request: function() {
      $http.get('/api/token/request').success(function(response) {
        tokens.sha = response.sha;
      }).error(function() {
      });
    }
  };
});
