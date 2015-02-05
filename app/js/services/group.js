'use strict';

/**
 * @ngdoc service
 * @name tradity.group
 * @description
 * # group
 * Factory
 */
angular.module('tradity')
	.factory('group', function ($q,socket) {
		var parseGroup = function(data) {
			return data;
		}

		return {
			/**
			 * @ngdoc method
			 * @name tradity.group#get
			 * @methodOf tradity.group
			 * @param  {string} schoolid uschoolid
			 * @return {Promise} promise
			 * @description
			 * get schoolinfo
			 */
			get:function(schoolid) {
				return socket.emit('get-school-info', {
					lookfor: schoolid,
					_cache: 30
				}).then(function(data){
					parseGroup(data)
				})
			},
		};
	})
