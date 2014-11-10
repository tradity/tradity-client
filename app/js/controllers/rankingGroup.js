angular.module('tradity').
	controller('RankingGroupCtrl', function($scope, $stateParams, $location, socket) {
		$scope.results = [];
		$scope.school = {};
		$scope.interGroupResults = [];

		$scope.$on('user-update', function() {
			$scope.computeGroupRanking();
		});
		
		socket.emit('get-ranking', {
			since: 0,
			schoolid: $scope.schoolid,
			_cache: 20
		}, function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = data.result;
				$scope.computeGroupRanking();
			}
		});
	});
