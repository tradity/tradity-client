'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('UnknownEntityCtrl', function($scope, $stateParams, $state, socket) {
		var entity = $stateParams.entity.replace(/\/$/, ''); // strip trailing slash
		socket.emit('school-exists', {
			lookfor: entity,
			_cache: 30
		}, function(data) {
			if (data.code == 'school-exists-success' && data.exists) {
				$state.go('game.group', {schoolid: data.path});
			} else {
				var strippedEntity = entity.replace(/^\//, ''); // strip leading slash
				
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
