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
