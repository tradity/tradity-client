angular.module('tradity').
	controller('GroupOverviewCtrl', function($scope, $sce, $state, $stateParams, DEFAULT_GROUP_BANNER, socket) {
		$scope.groups = [];

		socket.emit('list-schools', { 
			_cache: 60
		}, function(schoollist) {
			$scope.groups = schoollist.result;
		});
	});
