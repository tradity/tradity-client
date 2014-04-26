angular.module('tradity').
	controller('RankingFollowerCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			since: 0,
			schoolid: $scope.schoolid,
			_cache: 30
		},
		function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = rankify(data.result, function(r) { return r.hastraded ? r.fperfval : -Infinity; }, function(r) { return r.fperf != null; });
			}
		});
	});
