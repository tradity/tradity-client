angular.module('tradity').
	controller('RankingAllWeekCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'general-week',
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success')
				$scope.resultsWeek = data.result;
		});
	});