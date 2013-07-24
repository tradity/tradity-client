'use strict';

angular.module('tradity', [
  'tradity.controllers',
  'tradity.services'
]).config(['$routeProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/feed.html'
    }).
    when('/trade', {
      templateUrl: 'templates/trade.html'
    }).
    when('/stats', {
      templateUrl: 'templates/stats.html'
    }).
    when('/options', {
      templateUrl: 'templates/options.html'
    }).
    when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);