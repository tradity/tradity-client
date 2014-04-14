angular.module('tradity').
	controller('RankingAllCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			rtype: 'general',
			schoolid: $scope.schoolid,
			_cache: 20
		},
		function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = data.result;
				$scope.results.sort(function(a, b) { return a.rank - b.rank; });

				var admins = [];
				
				var curScope = $scope;
				
				while (curScope) {
					if (curScope.school && curScope.school.admins)
						for (var i = 0; i < curScope.school.admins.length; ++i)
							admins.push(curScope.school.admins[i].adminname);
					
					curScope = curScope.$parent;
				}
				
				for (var i = 0; i < $scope.results.length; ++i) {
					$scope.results[i].rank = i + 1;
					$scope.results[i].admin = admins.indexOf($scope.results[i].name) != -1;
				}
			}
		});
	});
 
