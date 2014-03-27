angular.module('tradity').
	controller('RankingFollowerWeekCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'following-week',
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success')
				$scope.resultsFollowerWeek = data.result;
		});
	});