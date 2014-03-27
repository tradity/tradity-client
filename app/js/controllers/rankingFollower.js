angular.module('tradity').
	controller('RankingFollowerCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'following',
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success')
				$scope.resultsFollower = data.result;
		});
	});