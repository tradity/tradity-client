angular.module('tradity').
	controller('RankingFollowerWeekCtrl', function($scope, socket) {
		var now = new Date();
		var weekStart = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay(), 0, 0, 0, 0);
		var weekStartUnix = weekStart.getTime() / 1000;
		
		socket.emit('get-ranking', {
			since: weekStartUnix,
			schoolid: $scope.schoolid,
			_cache: 30
		},
		function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = rankify(data.result, function(r) { return r.hastraded ? r.fperfval : -Infinity; }, function(r) { return r.fperf != null; });
			}
		});
	});
