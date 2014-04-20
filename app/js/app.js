'use strict';

angular.module('tradity', [
	'ui.router',
	'ui.bootstrap',
	'ui.keypress',
	'dialogs',
	'infinite-scroll'
]).config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.
	// redirect abstract states to child
	when('/depot', '/depot/overview').
	when('/ranking', '/ranking/all').
	when('/admin', '/admin/userlist').
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
			templateUrl: 'templates/registration.html',
			controller: 'RegistrationCtrl'
		}).
		state('index.schoolregister', {
			url: 'register/s/:schoolid',
			templateUrl: 'templates/registration.html',
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
		state('game.search', {
			url: '/search/:query',
			templateUrl: 'templates/search.html',
			controller: 'SearchCtrl'
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
			abstract: true,
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
		state('game.faq', {
			url: '/faq',
			templateUrl: 'templates/faq.html'
		}).
		state('game.gettingstarted', {
			url: '/gettingstarted',
			templateUrl: 'templates/gettingstarted.html'
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
			controller: 'GroupCtrl'
		}).
		state('game.group', {
			url: '/s/{schoolid:[\\w_/-]*[\\w_-]}',
			templateUrl: 'templates/group.html',
			controller: 'GroupCtrl'
		}).
		state('game.group.pinboard', {
			url: '/+pinboard',
			templateUrl: 'templates/group.pinboard.html',
			controller: 'CommentCtrl'
		}).
		state('game.group.intragroup', {
			url: '/+ranking',
			templateUrl: 'templates/group.intragroup.html',
			controller: 'RankingAllCtrl'
		}).
		state('game.group.intragroup-follower', {
			url: '/+follower',
			templateUrl: 'templates/ranking.follower.html',
			controller: 'RankingFollowerCtrl'
		}).
		state('game.group.intragroup-week', {
			url: '/+week',
			templateUrl: 'templates/ranking.all-week.html',
			controller: 'RankingAllWeekCtrl'
		}).
		state('game.group.intragroup-follower-week', {
			url: '/+follower-week',
			templateUrl: 'templates/ranking.follower-week.html',
			controller: 'RankingFollowerWeekCtrl'
		}).
		state('game.group.intergroup', {
			url: '/+intergroup',
			templateUrl: 'templates/group.intergroup.html',
			controller: 'RankingGroupCtrl'
		}).
		state('sponsors', {
			url: '/sponsors',
			templateUrl: 'templates/sponsors.html',
			controller: 'RankingGroupCtrl'
		});
}).run(['$templateCache',function($templateCache){
	['error', 'wait', 'notify', 'confirm'].forEach(function(t) {
		$templateCache.put('/dialogs/' + t + '.html','<ng-include src="\'templates/dialogs/' + t + '.html\'"></ng-include>');
	});
}]);
