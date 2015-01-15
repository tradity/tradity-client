'use strict';

/**
 * @ngdoc service
 * @name tradity.config
 * @description
 * all config parameters
 * ```json
 * {
 *	API_HOST:String,
 *	HOST:String,
 *	DEFAULT_PROFILE_IMG:String
 * }
 * ```
 */
angular.module('tradity')
	.factory('config', function (API_HOST,DEFAULT_PROFILE_IMG) {
		return {
			API_HOST:API_HOST,
			HOST:'https://tradity.de', // wie kann man das variable machen ?
			DEFAULT_PROFILE_IMG:DEFAULT_PROFILE_IMG
		}
	})