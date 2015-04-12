'use strict';

angular.module('tradity').
	controller('AdminCtrl', function($scope, $stateParams, $state, safestorage, feed, socket) {
		$scope.$emit('makeadmin');
		
		$scope.impersonateUser = function(uid) {
			socket.emit('impersonate-user', {
				uid: uid
			}, function(data) {
				if (data.code == 'impersonate-user-success') {
					safestorage.clear();
					feed.clearFull();
					safestorage.check();
					feed.fetch();
					$state.go('game.feed');
				} else {
					alert('Fehler: ' + data.code);
				}
			});
		};
	});
