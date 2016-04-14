/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import TradityComponent from './app.component';
import LoginComponent from './login/login.component';

angular
  .module('tradity', [
    'ngComponentRouter',
    'ui.bootstrap',
    'ui.keypress',
    'ui.event',
    'dialogs.main',
    'angular-md5',
    'infinite-scroll',
    'rt.debounce',
    //'tradityFilters',
    'eventsCalendar',
    'nsPopover',
    'gettext' // override translate filter from dialogs.main, so this comes last
  ])
  //.config(configure)
  //.run(run)
  .value('$routerRootComponent', 'tradity')
  .component('tradity', new TradityComponent())
  .component('login', new LoginComponent());

function configure($urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $compileProvider) {
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

  /*
  $stateProvider.
    state('index', {
      url: '/',
      templateUrl: 'app/templates/index.html',
      controller: 'IndexCtrl'
    }).
    state('index.login', {
      url: 'login',
      templateUrl: 'app/templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    }).
    state('index.loginverif', {
      url: 'login/:emailVerifCode/:uid',
      templateUrl: 'app/templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    }).
    state('register', {
      url: '/register',
      templateUrl: 'app/templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration',
      abstract: true
    }).
    state('register.step1', {
      url: '/step1',
      templateUrl: 'app/templates/registration.step1.html',
      // controller: 'RegistrationCtrl',
      // controllerAs: 'step1'
    }).
    state('register.step2', {
      url: '/step2',
      templateUrl: 'app/templates/registration.step2.html',
      // controller: 'RegistrationCtrl',
      // controllerAs: 'registration'
    }).
    state('survey', {
      url: '/survey/:questionnaire',
      templateUrl: 'app/templates/survey.html',
      controller: 'SurveyCtrl',
      controllerAs: 'survey'
    }).
    
    //change to register/:inviteCode
    state('invite', {
      url: '/join/:inviteCode',
      templateUrl: 'app/templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration'
    }).
    state('schoolregister', {
      url: '/register/s{schoolid:SchoolID}',
      templateUrl: 'app/templates/registration.html',
      controller: 'RegistrationCtrl',
      controllerAs: 'registration'
    }).
    state('game', {
      abstract: true,
      templateUrl: 'app/templates/game.html'
    }).
    state('game.feed', {
      url: '/feed',
      templateUrl: 'app/templates/feed.html',
      controller: 'FeedCtrl',
      controllerAs: 'feed'
    }).
    state('game.learning', {
      url: '/learning',
      templateUrl: 'app/templates/learning.html',
      controller: 'LearningCtrl'
    }).
    state('game.learning.catalog', {
      url: '/catalog',
      templateUrl: 'app/templates/learning.catalog.html',
      controller: 'LearningCtrl'
    }).
    state('game.learning.questions', {
      url: '/catalog/:id',
      templateUrl: 'app/templates/learning.questions.html',
      controller: 'LearningCtrl'
    }).
    state('game.search', {
      url: '/search/:query',
      templateUrl: 'app/templates/search.html',
      controller: 'SearchCtrl'
    }).
    state('game.options', {
      url: '/options',
      templateUrl: 'app/templates/options.html',
      controller: 'OptionsCtrl'
    }).
    state('game.depot', {
      abstract: true,
      url: '/depot',
      templateUrl: 'app/templates/depot.html',
      controller: 'DepotCtrl'
    }).
    state('game.depot.overview', {
      url: '/overview',
      templateUrl: 'app/templates/depot.overview.html'
    }).
    state('game.depot.listing', {
      url: '/listing',
      templateUrl: 'app/templates/depot.listing.html'
    }).
    state('game.depot.transactions', {
      url: '/transactions',
      templateUrl: 'app/templates/depot.transactions.html'
    }).
    state('game.depot.transactionlog', {
      url: '/transactionlog',
      templateUrl: 'app/templates/depot.transactionlog.html',
      controller: 'DepotTransactionLogCtrl'
    }).
    state('game.depot.watchlist', {
      url: '/watchlist',
      templateUrl: 'app/templates/depot.watchlist.html'
    }).
    state('game.trade', {
      url: '/trade',
      templateUrl: 'app/templates/trade.html',
      controller: 'TradeCtrl',
            controllerAs: 'trade'
    }).
    state('game.tradesellbuy', {
      url: '/trade/:sellbuy/:stockId/:amount',
      templateUrl: 'app/templates/trade.html',
      controller: 'TradeCtrl',
            controllerAs: 'trade'
    }).
    state('game.ranking', {
      url: '/ranking/:spec',
      templateUrl: 'app/templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('game.profile', {
      url: '/user/:userId',
      templateUrl: 'app/templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    state('game.profile.overview', {
      url: '/overview',
      templateUrl: 'app/templates/profile.overview.html',
      controller: 'ProfileOverviewCtrl'
    }).
    state('game.profile.history', {
      url: '/history',
      templateUrl: 'app/templates/profile.history.html'
    }).
    state('game.profile.pinboard', {
      url: '/pinboard',
      templateUrl: 'app/templates/profile.pinboard.html',
      controller: 'CommentCtrl'
    }).
    state('game.profile.achievements', {
      url: '/achievements',
      templateUrl: 'app/templates/profile.achievements.html',
      controller: 'AchievementsCtrl'
    }).
    state('game.profile.achievements.categories', {
      url: '/categories',
      templateUrl: 'app/templates/profile.achievements.categories.html',
      controller: 'AchievementsCtrl'
    }).
    state('game.profile.achievements.list', {
      url: '/list/:id',
      templateUrl: 'app/templates/profile.achievements.list.html',
      controller: 'AchievementsCtrl'
    }).
    state('admin', {
      abstract: true,
      url: '/admin',
      templateUrl: 'app/templates/admin.html',
      controller: 'AdminCtrl'
    }).
    state('admin.userlist', {
      url: '/userlist',
      templateUrl: 'app/templates/admin.userlist.html',
      controller: 'AdminUserlistCtrl'
    }).
    state('admin.statistics', {
      url: '/statistics',
      templateUrl: 'app/templates/admin.statistics.html',
      controller: 'AdminStatisticsCtrl'
    }).
    state('admin.sranking', {
      url: '/sustainability-ranking',
      templateUrl: 'app/templates/admin.sranking.html',
      controller: 'adminSustainabilityRankingCtrl'
    }).
    state('admin.events', {
      url: '/events',
      templateUrl: 'app/templates/admin.events.html',
      controller: 'AdminEventsCtrl'
    }).
    state('admin.notifications', {
      url: '/notifications',
      templateUrl: 'app/templates/admin.notifications.html',
      controller: 'AdminNotificationsCtrl'
    }).
    state('admin.schools', {
      url: '/schools',
      templateUrl: 'app/templates/admin.schools.html',
      controller: 'AdminSchoolsCtrl'
    }).
    state('admin.userdetails', {
      url: '/userdetails/:uid',
      templateUrl: 'app/templates/admin.userdetails.html',
      controller: 'AdminUserDetailsCtrl'
    }).
    state('game.groupOverview', {
      url: '/s/',
      templateUrl: 'app/templates/groupOverview.html',
      controller: 'GroupOverviewCtrl'
    }).
    state('game.group', {
      url: '/s{schoolid:SchoolID}',
      templateUrl: 'app/templates/group.html',
      controller: 'GroupCtrl'
    }).
    state('game.group.pinboard', {
      url: '/+pinboard',
      templateUrl: 'app/templates/group.pinboard.html',
      controller: 'CommentCtrl'
    }).
    state('game.group.ranking', {
      url: '/+ranking/:spec',
      templateUrl: 'app/templates/ranking.html',
      controller: 'RankingCtrl'
    }).
    state('error', {
      templateUrl: 'app/templates/error.html'
    }).
    state('error.404', {
      url:'/error/404',
      templateUrl: 'app/templates/error.404.html'
    }).
    state('error.connection', {
      url:'/error/connection',
      templateUrl: 'app/templates/error.connection.html'
    }).
    state('unknownEntity', {
      url:'{entity:GenericEntityID}',
      controller: 'UnknownEntityCtrl'
    });
    */

  $locationProvider.
    html5Mode(true).
    hashPrefix('!');
}

function run($templateCache, languageManager, $rootScope) {
  $rootScope.$on('user-update', function(ev, data) {
    if (data && data.lang) languageManager.setCurrentLanguage(data.lang);
  });
  
  languageManager.setCurrentLanguage(null);
  
  $templateCache.put('/dialogs/error.html',   "<ng-include src=\"'app/templates/dialogs/error.html'\"></ng-include>");
  $templateCache.put('/dialogs/wait.html',    "<ng-include src=\"'app/templates/dialogs/wait.html'\"></ng-include>");
  $templateCache.put('/dialogs/notify.html',  "<ng-include src=\"'app/templates/dialogs/notify.html'\"></ng-include>");
  $templateCache.put('/dialogs/confirm.html', "<ng-include src=\"'app/templates/dialogs/confirm.html'\"></ng-include>");
  
  $rootScope.loadState = false;
  $rootScope.$on("$stateChangeStart", function () {
    $rootScope.loadState = true;
  });

  var end = function() {
    $rootScope.loadState = false;
  };

  $rootScope.$on("$stateChangeSuccess", end);
  $rootScope.$on("$stateChangeError", end);
}

angular.bootstrap(document.documentElement, ['tradity']);