angular.module('tradity').
	controller('UnknownEntityCtrl', function($scope, $stateParams, $state, socket) {
		socket.emit('get-school-info', {
			lookfor: $stateParams.entity,
			_cache: 30
		}, function(data) {
			if (data.code == 'get-school-info-success') {
				$state.go('game.group', {schoolid: data.result.path});
			} else {
				var strippedEntity = $stateParams.entity.replace(/^\//, '');
				
				socket.emit('get-user-info', {
					lookfor: strippedEntity,
					_cache: 30
				}, function(data) {
					if (data.code == 'get-user-info-success') {
						$state.go('game.profile', {userId: strippedEntity});
					} else {
						$state.go('error.404');
					}
				});
			}
		});
	});
