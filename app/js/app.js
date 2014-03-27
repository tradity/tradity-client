'use strict';

angular.module('tradity', [
  'ui.router',
  'ui.bootstrap',
  'ui.keypress',
  'pasvaz.bindonce',
  'infinite-scroll'
]).config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.
  // redirect abstract states to child
  when('/depot', '/depot/overview').
  otherwise('/');
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
      abstract: true,
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
      abstract: true,
      url: '/depot',
      templateUrl: 'templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('game.depot.overview', {
      url: '/overview',
      templateUrl: 'templates/depot.overview.html'
    }).
    state('game.depot.listing', {
      url: '/listing',
      templateUrl: 'templates/depot.listing.html'
    }).
    state('game.depot.transactions', {
      url: '/transactions',
      templateUrl: 'templates/depot.transactions.html'
    }).
    state('game.depot.watchlist', {
      url: '/watchlist',
      templateUrl: 'templates/depot.watchlist.html'
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
    state('game.ranking.all', {
      url: '/all',
      templateUrl: 'templates/ranking.all.html',
      controller: 'RankingAllCtrl'
    }).
    state('game.ranking.all-withprov', {
      url: '/all-withprov',
      templateUrl: 'templates/ranking.all-withprov.html',
      controller: 'RankingAllWithProvCtrl'
    }).
    state('game.ranking.all-week', {
      url: '/all-week',
      templateUrl: 'templates/ranking.all-week.html',
      controller: 'RankingAllWeekCtrl'
    }).
    state('game.ranking.follower', {
      url: '/follower',
      templateUrl: 'templates/ranking.follower.html',
      controller: 'RankingFollowerCtrl'
    }).
    state('game.ranking.follower-week', {
      url: '/follower-week',
      templateUrl: 'templates/ranking.follower-week.html',
      controller: 'RankingFollowerWeekCtrl'
    }).
    state('game.ranking.intergroup', {
      url: '/intergroup',
      templateUrl: 'templates/ranking.intergroup.html',
      controller: 'RankingGroupCtrl'
    }).
    state('game.ranking.intragroup', {
      url: '/intragroup',
      templateUrl: 'templates/ranking.intragroup.html',
      controller: 'RankingGroupCtrl'
    }).
    state('game.profile', {
      url: '/user/:userId',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('game.profile.overview', {
      url: '/overview',
      templateUrl: 'templates/profile.overview.html',
      controller: 'ProfileOverviewCtrl'
    }).
    state('game.profile.history', {
      url: '/history',
      templateUrl: 'templates/profile.history.html'
    }).
    state('game.profile.pinboard', {
      url: '/pinboard',
      templateUrl: 'templates/profile.pinboard.html'
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
    state('game.group', {
      url: '/s/:schoolid',
      templateUrl: 'templates/group.html',
      controller: 'GroupCtrl'
    }).
    state('game.group.pinboard', {
      url: '/pinboard',
      templateUrl: 'templates/group.pinboard.html'
    }).
    state('game.group.intragroup', {
      url: '/intragroup',
      templateUrl: 'templates/group.intragroup.html',
      controller: 'RankingGroupCtrl'
    }).
    state('game.group.intergroup', {
      url: '/intergroup',
      templateUrl: 'templates/group.intergroup.html',
      controller: 'RankingGroupCtrl'
    });
});
