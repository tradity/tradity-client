'use strict';

/**
 * @ngdoc service
 * @name tradity.socket
 * @description
 * # socket
 * Factory
 */
angular.module('tradity')
	.factory('socket', function ($rootScope, API_HOST) {
		var connect = function() {
			return io.connect(API_HOST);
		};
		var socket = new SoTradeConnection(connect, $rootScope.$apply.bind($rootScope));
		return {
			on: function (eventName, callback, angularScope) {
				socket.on(eventName, function () {
					var args = arguments;
					callback.apply(socket, args);
				}, angularScope);
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					
					if (callback) {
						callback.apply(socket, args);
					}
				});
			},
			hasOpenQueries: function () { return socket.hasOpenQueries(); },
			txPackets: function() { return socket.txPackets(); },
			rxPackets: function() { return socket.rxPackets(); },
			reconnect: function() { return socket.reconnect(); },
			protocolVersion: function() { return socket.protocolVersion(); }
		};
	});
