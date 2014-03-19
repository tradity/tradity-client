'use strict';

angular.module('tradity', [
  'ui.router',
  'ui.bootstrap',
  'pasvaz.bindonce',
  'infinite-scroll'
]).config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.
    state('index', {
      url: '/',
      templateUrl: 'templates/index.html',
      controller: 'HerounitCtrl'
    }).
    state('index.login', {
      url: 'login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    state('index.loginverif', {
      url: 'login/:emailVerifCode/:uid',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    state('index.register', {
      url: 'register',
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl'
    }).
    //change to register/:inviteCode
    state('index.invite', {
      url: 'join/:inviteCode',
      templateUrl: 'templates/register.html',
      controller: 'RegistrationCtrl'
    }).
    state('index.schoolregister', {
      url: 'register/s/:schoolid',
      controller: 'RegistrationCtrl'
    }).
    state('game', {
      templateUrl: 'templates/game.html'
    }).
    state('game.feed', {
      url: '/feed',
      templateUrl: 'templates/feed.html',
      controller: 'FeedCtrl'
    }).
    state('game.options', {
      url: '/options',
      templateUrl: 'templates/options.html',
      controller: 'OptionsCtrl'
    }).
    state('game.depot', {
      url: '/depot',
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('game.depottabs', {
      url: '/depot/:pageid',
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('game.trade', {
      url: '/trade',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    state('game.tradesellbuy', {
      url: '/trade/:sellbuy/:stockId/:amount',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl'
    }).
    state('game.tradeDetails', {
      url: '/trade/:tradeId',
      templateUrl: 'templates/tradeDetails.html',
      controller: 'TradeDetailsCtrl'
    }).
    state('game.ranking', {
      url: '/ranking',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('game.rankingtabs', {
      url: '/ranking/:pageid',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('game.profile', {
      url: '/user/:userId',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('game.profiletabs', {
      url: '/user/:userId/:pageid',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('game.faq', {
      url: '/faq',
      templateUrl: 'templates/faq.html'
    }).
    state('game.gettingstarted', {
      url: '/gettingstarted',
      templateUrl: 'templates/gettingstarted.html'
    }).
    state('game.admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('game.admintabs', {
      url: '/admin/:pageid',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('game.adminuserid', {
      url: '/admin/:pageid/:userId',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('game.grouptabs', {
      url: '/s/p|:pageid/*schoolid',
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    }).
    state('game.group', {
      url: '/s/*schoolid',
      templateUrl: 'templates/school.html',
      controller: 'RankingCtrl'
    });
});
