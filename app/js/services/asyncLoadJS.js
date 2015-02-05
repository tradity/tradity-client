'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.asyncLoadJS
 * @description
 * # asyncLoadJS
 * Factory
 */
angular.module('tradity')
	.factory('asyncLoadJS', function ($q, $http) {
		return function(files) {
			return $q.all(files.map(function(file) {
				return $http({url: file}).then(function(response) {
					return eval(response.data);
				});
			}));
		};
	});
