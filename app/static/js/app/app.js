var app = angular.module("app", ["ngRoute"]);

app.filter('safe', ['$sce', function($sce) {
  return (function(text) {
    return $sce.trustAsHtml(text);
  });
}]).filter('formatDate', function() {
  return (function(date) {
    var fDate = new Date(date);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (fDate.getDate() + " " + months[fDate.getMonth()] + " " + fDate.getFullYear());
  });
}).filter('startFrom', function() {
  return (function(input, start) {
    return input.slice(start);
  });
});

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "index.html",
    controller: "IndexCtrl"
  })
  .when("/:type", {
    templateUrl: "messages.html",
    controller: "MessagesCtrl"
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

app.factory('Alert', function() {
  var success = "";
  var danger = "";
  
  return {
    getSuccess: function() {
      return success;
    },
    getDanger: function() {
      return danger;
    },
    setSuccess: function(message) {
      danger = "";
      success = message;
    },
    setDanger: function(message) {
      danger = message;
      success = "";
    },
    reset: function() {
      danger = "";
      success = "";
    }
  };
});

app.factory('Auth', function($http) {
  var is_authenticated = false;
  var token = {};

  var token_save = function() {
    localStorage.setItem('token', JSON.stringify(token));
  };
  var token_load = function() {
    token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      token = {};
    } else {
      token_verify();
    }
  };

  var token_verify = function() {
    $http.get('/api/token/verify', {"params": token}).success(function(response) {
      is_authenticated = true;
      token_save();
    }).error(function() {
      is_authenticated = false;
      token = {};
    });
  };
  var token_request = function() {
    $http.get('/api/token/request').success(function(response) {
      token = {};
      token_save();
      token.sha = response.sha;
      token.captcha_img = response.captcha;
      is_authenticated = false;
    }).error(function() {
    });
  };

  return {
    is_authenticated: function() { return is_authenticated; },
    token: function() { return token; },
    token_load: token_load,
    token_save: token_save,
    token_verify: token_verify,
    token_request: token_request
  };
});
