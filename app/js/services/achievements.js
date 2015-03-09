'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.achievements
 * @description
 * # achievements
 * Factory
 */
angular.module('tradity')
	.factory('achievements', function ($q, socket) {
		var achievements = {
			_list: null
		};
		
		var handleAchievementList = function(data) {
			if (data.code != 'list-all-achievements-success') {
				achievements._list = null;
				
				return socket.once('self-info').then(function() {
					return achievements.list();
				});
			}
			
			return achievements._list = data.result;
		};
		
		socket.on('list-all-achievements', handleAchievementList);
		achievements._list = null;
		
		achievements.list = function() {
			if (achievements._list)
				return $q.when(achievements._list);
			
			return achievements._list = socket.emit('list-all-achievements').then(handleAchievementList);
		};
		
		achievements.listClientAchievements = function() {
			return achievements.list().then(function(achievements) {
				return achievements.filter(function(ach) {
					return ach.isClientAchievement;
				});
			});
		};
		
		return achievements;
	});
