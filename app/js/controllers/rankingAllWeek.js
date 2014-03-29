angular.module('tradity').
	controller('RankingAllWeekCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'general-week',
			schoolid: $scope.schoolid,
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = data.result;
				for (var i = 0; i < $scope.results.length; ++i)
					$scope.results[i].rank = ++i;
			}
		});
	});
