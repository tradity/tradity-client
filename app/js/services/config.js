'use strict';

/**
 * @ngdoc service
 * @name tradity.config
 * @description
 * all config parameters
 * ```json
 * {
 *	API_HOST:String,
 *	DEFAULT_PROFILE_IMG:String,
 *	server:A function returning the server config
 * }
 * ```
 */
angular.module('tradity')
	.factory('config', function (API_HOST, DEFAULT_PROFILE_IMG, socket) {
		return {
			API_HOST: API_HOST,
			DEFAULT_PROFILE_IMG: DEFAULT_PROFILE_IMG,
			server: function() { return socket.serverConfig || {}; }
		};
	})
