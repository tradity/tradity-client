'use strict';

angular.module('tradity', [
  'ngRoute',
  'tradity.controllers',
  'tradity.services',
  'pasvaz.bindonce',
  'infinite-scroll'
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
    when('/login/:emailVerifCode/:uid', {
      templateUrl: 'templates/login.html',
      controller: 'HerounitCtrl'
    }).
    when('/user/:userId', {
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/user/:userId/:pageid', {
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
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
    when('/admin', {
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    when('/admin/:pageid', {
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    when('/admin/:pageid/:userId', {
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    when('/s/:schoolid', {
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    }).
    when('/s/:pageid/:schoolid*', {
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
