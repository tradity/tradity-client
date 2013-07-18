angular.module('tradity', []).config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {templateUrl: 'templates/feed.html'}).
		when('/trade', {templateUrl: 'templates/trade.html'}).
		when('/stats', {templateUrl: 'templates/stats.html'}).
		when('/options', {templateUrl: 'templates/options.html'}).
		otherwise({redirectTo: '/'});
}]);