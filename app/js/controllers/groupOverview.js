angular.module('tradity').
	controller('GroupOverviewCtrl', function($scope, $sce, $state, $stateParams, DEFAULT_GROUP_BANNER, socket) {
		$scope.groups = [];

		socket.emit('list-schools', { 
			_cache: 60
		}, function(schoollist) {
			$scope.groups = schoollist.result;
		});
		
		$scope.createNewSchool = function () {
			socket.emit('get-own-options', function(data) {
				var t = prompt("Deine Schule, Organisation, Institut");
				data.result.school = t;
				socket.emit('change-options', data.result);
				$scope.selfIsSchoolMember = true;
			});
		};
	});
