'use strict';

angular.module('tradity', [
  'tradity.controllers',
  'tradity.services'
]).config(['$routeProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/feed.html',
      controller: 'FeedCtrl'
    }).
    when('/trade', {
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    when('/trade/:tradeId', {
      templateUrl: 'templates/tradeDetails.html',
      controller: 'TradeDetailsCtrl'
    }).
    when('/trade/:sellbuy/:stockId/:amount', {
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    when('/depot', {
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    when('/depot/:pageid', {
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    when('/ranking', {
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    when('/ranking/:pageid', {
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    when('/options', {
      templateUrl: 'templates/options.html',
      controller: 'OptionsCtrl'
    }).
    when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    when('/login/:emailVerifCode/:uid', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    when('/register', {
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl'
    }).
    when('/user/:userId', {
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/watchlist', {
      templateUrl: 'templates/watchlist.html',
      controller: 'WatchlistCtrl'
    }).
    when('/faq', {
      templateUrl: 'templates/faq.html'
    }).
    when('/imprint', {
      templateUrl: 'templates/imprint.html'
    }).
    when('/about', {
      templateUrl: 'templates/about.html'
    }).
    when('/tos', {
      templateUrl: 'templates/tos.html'
    }).
    when('/gettingstarted', {
      templateUrl: 'templates/gettingstarted.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
