angular.module('tradity').
	controller('RankingAllCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'general',
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success') 
				$scope.results = data.result;
		});
	});