angular.module('tradity').
 	controller('RankingAllWithProvCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'general-wprov',
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success')
				$scope.resultsWithProvision = data.result;
		});
	});