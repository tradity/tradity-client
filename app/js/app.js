'use strict';

angular.module('tradity', [
  'ui.router',
  'ui.bootstrap',
  'pasvaz.bindonce',
  'infinite-scroll'
]).config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.
    // create routes for login and register
    state('loginverif', {
      url: '/login/:emailVerifCode/:uid',
      templateUrl: 'templates/login.html',
      controller: 'HerounitCtrl'
    }).
    //change to register/:inviteCode
    state('invite', {
      url: '/join/:inviteCode',
      templateUrl: 'templates/register.html',
      controller: 'HerounitCtrl'
    }).
    state('feed', {
      url: '/',
      templateUrl: 'templates/feed.html',
      controller: 'FeedCtrl'
    }).
    state('options', {
      url: '/options',
      templateUrl: 'templates/options.html',
      controller: 'OptionsCtrl'
    }).
    state('depot', {
      url: '/depot',
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('depottabs', {
      url: '/depot/:pageid',
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('trade', {
      url: '/trade',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    state('tradesellbuy', {
      url: '/trade/:sellbuy/:stockId/:amount',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    state('tradeDetails', {
      url: '/trade/:tradeId',
      templateUrl: 'templates/tradeDetails.html',
      controller: 'TradeDetailsCtrl'
    }).
    state('ranking', {
      url: '/ranking',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('rankingtabs', {
      url: '/ranking/:pageid',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('profile', {
      url: '/user/:userId',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('profiletabs', {
      url: '/user/:userId/:pageid',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('faq', {
      url: '/faq',
      templateUrl: 'templates/faq.html'
    }).
    state('gettingstarted', {
      url: '/gettingstarted',
      templateUrl: 'templates/gettingstarted.html'
    }).
    state('admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('admintabs', {
      url: '/admin/:pageid',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('adminuserid', {
      url: '/admin/:pageid/:userId',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('grouptabs', {
      url: '/s/:pageid/*schoolid',
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    }).
    state('group', {
      url: '/s/*schoolid',
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    });
});
