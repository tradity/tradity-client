angular.module('tradity').
	controller('RankingAllCtrl', function($scope, socket) {
		socket.emit('get-ranking', {
			since: 0,
			schoolid: $scope.schoolid,
			_cache: 30,
		}, function(data) {
			if (data.code == 'get-ranking-success') {
				$scope.results = rankify(data.result);

				var admins = [];
				
				var curScope = $scope;
				
				while (curScope) {
					if (curScope.school && curScope.school.admins)
						for (var i = 0; i < curScope.school.admins.length; ++i)
							admins.push(curScope.school.admins[i].adminname);
					
					curScope = curScope.$parent;
				}
				
				for (var i = 0; i < $scope.results.length; ++i) 
					$scope.results[i].admin = admins.indexOf($scope.results[i].name) != -1;
			}
		});
	});
 
