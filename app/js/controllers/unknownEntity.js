angular.module('tradity').
	controller('UnknownEntityCtrl', function($scope, $stateParams, $state, socket) {
		var entity = $stateParams.entity;
		if (!entity)
			$state.go('game.feed');
		
		console.log(entity);
		if (entity && entity.toString().toLowerCase() == '/bad-oldesloe')
			entity = '/BadOldesloe';
		console.log(entity);
		
		socket.emit('school-exists', {
			lookfor: entity,
			_cache: 30
		}, function(data) {
			if (data.code == 'school-exists-success' && data.exists) {
				$state.go('game.group', {schoolid: data.path});
			} else {
				var strippedEntity = entity.replace(/^\//, '');
				
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
