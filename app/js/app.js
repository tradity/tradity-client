(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity', [
  'ui.router',
  'ui.bootstrap',
  'ui.keypress',
  'ui.event',
  'dialogs.main',
  'angular-md5',
  'infinite-scroll',
  'rt.debounce',
  'tradityFilters',
  'eventsCalendar',
  'nsPopover',
  'gettext' // override translate filter from dialogs.main, so this comes last
]).config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $compileProvider) {
  $compileProvider.debugInfoEnabled(document.cookie.indexOf('devmode') !== -1);
  
  /* Create custom angular-ui-router parameter types.
   * This is necessary since 0.2.12; Since then,
   * angular-ui-router encodes slashes in parameters. */

  var schoolIdRegexp = /\/[\w_/-]*[\w_-]/;
  var genericEntityRegexp = /\/[\w_/-]*/;
  $urlMatcherFactoryProvider
    .type('SchoolID', {
      encode: function (val) { return String(val); },
      decode: function (val) { return String(val); },
      is: function (val) { return schoolIdRegexp.test(String(val)); },
      pattern: schoolIdRegexp
    })
    .type('GenericEntityID', {
      encode: function (val) { return String(val); },
      decode: function (val) { return String(val); },
      is: function (val) { return genericEntityRegexp.test(String(val)); },
      pattern: genericEntityRegexp
    });

  $urlRouterProvider.
  // redirect abstract states to child
  when('/depot', '/depot/overview').
  when('/ranking', '/ranking/all').
  when('/admin', '/admin/userlist').
  when('/register', '/register/step1').
  otherwise('/error/404');

  $stateProvider.
    state('index', {
      url: '/',
      templateUrl: 'templates/index.html',
      controller: 'IndexCtrl'
    }).
    state('index.login', {
      url: 'login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    }).
    state('index.loginverif', {
      url: 'login/:emailVerifCode/:uid',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    }).
    state('register', {
      url: '/register',
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration'
    }).
    state('register.step1', {
      url: '/step1',
      templateUrl: 'templates/registration.step1.html',
      // controller: 'RegistrationCtrl',
      // controllerAs: 'step1'
    }).
    state('register.step2', {
      url: '/step2',
      templateUrl: 'templates/registration.step2.html',
      // controller: 'RegistrationCtrl',
      // controllerAs: 'registration'
    }).
    state('survey', {
      url: '/survey/:questionnaire',
      templateUrl: 'templates/survey.html',
      controller: 'SurveyCtrl',
      controllerAs: 'survey'
    }).
    
    //change to register/:inviteCode
    state('invite', {
      url: '/join/:inviteCode',
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration'
    }).
    state('schoolregister', {
      url: '/register/s{schoolid:SchoolID}',
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration'
    }).
    state('game', {
      abstract: true,
      templateUrl: 'templates/game.html'
    }).
    state('game.feed', {
      url: '/feed',
      templateUrl: 'templates/feed.html',
      controller: 'FeedCtrl',
      controllerAs: 'feed'
    }).
    state('game.learning', {
      url: '/learning',
      templateUrl: 'templates/learning.html',
      controller: 'LearningCtrl'
    }).
    state('game.learning.catalog', {
      url: '/catalog',
      templateUrl: 'templates/learning.catalog.html',
      controller: 'LearningCtrl'
    }).
    state('game.learning.questions', {
      url: '/catalog/:id',
      templateUrl: 'templates/learning.questions.html',
      controller: 'LearningCtrl'
    }).
    state('game.search', {
      url: '/search/:query',
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
    }).
    state('game.chats', {
      url: '/chats/',
      templateUrl: 'templates/chats.html',
      controller: 'ChatCtrl'
    }).
    state('game.chat', {
      url: '/chat',
      templateUrl: 'templates/chat.html',
      controller: 'ChatCtrl'
    }).
    state('game.chat.id', {
      url: '/id/:id',
      controller: 'ChatCtrl'
    }).
    state('game.chat.user', {
      url: '/user/:userId',
      controller: 'ChatCtrl'
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
    state('game.depot.transactionlog', {
      url: '/transactionlog',
      templateUrl: 'templates/depot.transactionlog.html',
      controller: 'DepotTransactionLogCtrl'
    }).
    state('game.depot.watchlist', {
      url: '/watchlist',
      templateUrl: 'templates/depot.watchlist.html'
    }).
    state('game.trade', {
      url: '/trade',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl',
            controllerAs: 'trade'
    }).
    state('game.tradesellbuy', {
      url: '/trade/:sellbuy/:stockId/:amount',
      templateUrl: 'templates/trade.html',
      controller: 'TradeCtrl',
            controllerAs: 'trade'
    }).
    state('game.ranking', {
      url: '/ranking/:spec',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
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
      templateUrl: 'templates/profile.pinboard.html',
      controller: 'CommentCtrl'
    }).
    state('game.profile.achievements', {
      url: '/achievements',
      templateUrl: 'templates/profile.achievements.html',
      controller: 'AchievementsCtrl'
    }).
    state('game.profile.achievements.categories', {
      url: '/categories',
      templateUrl: 'templates/profile.achievements.categories.html',
      controller: 'AchievementsCtrl'
    }).
    state('game.profile.achievements.list', {
      url: '/list/:id',
      templateUrl: 'templates/profile.achievements.list.html',
      controller: 'AchievementsCtrl'
    }).
    state('admin', {
      abstract: true,
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('admin.userlist', {
      url: '/userlist',
      templateUrl: 'templates/admin.userlist.html',
      controller: 'AdminUserlistCtrl'
    }).
    state('admin.statistics', {
      url: '/statistics',
      templateUrl: 'templates/admin.statistics.html',
      controller: 'AdminStatisticsCtrl'
    }).
    state('admin.events', {
      url: '/events',
      templateUrl: 'templates/admin.events.html',
      controller: 'AdminEventsCtrl'
    }).
    state('admin.notifications', {
      url: '/notifications',
      templateUrl: 'templates/admin.notifications.html',
      controller: 'AdminNotificationsCtrl'
    }).
    state('admin.schools', {
      url: '/schools',
      templateUrl: 'templates/admin.schools.html',
      controller: 'AdminSchoolsCtrl'
    }).
    state('admin.userdetails', {
      url: '/userdetails/:uid',
      templateUrl: 'templates/admin.userdetails.html',
      controller: 'AdminUserDetailsCtrl'
    }).
    state('game.groupOverview', {
      url: '/s/',
      templateUrl: 'templates/groupOverview.html',
      controller: 'GroupOverviewCtrl'
    }).
    state('game.group', {
      url: '/s{schoolid:SchoolID}',
      templateUrl: 'templates/group.html',
      controller: 'GroupCtrl'
    }).
    state('game.group.pinboard', {
      url: '/+pinboard',
      templateUrl: 'templates/group.pinboard.html',
      controller: 'CommentCtrl'
    }).
    state('game.group.ranking', {
      url: '/+ranking/:spec',
      templateUrl: 'templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('error', {
      templateUrl: 'templates/error.html'
    }).
    state('error.404', {
      url:'/error/404',
      templateUrl: 'templates/error.404.html'
    }).
    state('error.connection', {
      url:'/error/connection',
      templateUrl: 'templates/error.connection.html'
    }).
    state('unknownEntity', {
      url:'{entity:GenericEntityID}',
      controller: 'UnknownEntityCtrl'
    });

  $locationProvider.
    html5Mode(true).
    hashPrefix('!');
    
}).run(function($templateCache, languageManager, $rootScope) {
  $rootScope.$on('user-update', function(ev, data) {
    if (data && data.lang)
      languageManager.setCurrentLanguage(data.lang);
  });
  
  languageManager.setCurrentLanguage(null);
  
  $templateCache.put('/dialogs/error.html',   "<ng-include src=\"'templates/dialogs/error.html'\"></ng-include>");
  $templateCache.put('/dialogs/wait.html',    "<ng-include src=\"'templates/dialogs/wait.html'\"></ng-include>");
  $templateCache.put('/dialogs/notify.html',  "<ng-include src=\"'templates/dialogs/notify.html'\"></ng-include>");
  $templateCache.put('/dialogs/confirm.html', "<ng-include src=\"'templates/dialogs/confirm.html'\"></ng-include>");
  
  $rootScope.loadState = false;
  $rootScope.$on("$stateChangeStart", function () {
    $rootScope.loadState = true;
  });

  var end = function() {
    $rootScope.loadState = false;
  };

  $rootScope.$on("$stateChangeSuccess", end);
  $rootScope.$on("$stateChangeError", end);
});

})();
