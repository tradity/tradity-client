(function() {'use strict';

angular.module('tradity').
	factory('socket', function ($rootScope, API_HOST) {
		var connect = function() {
			return io.connect(API_HOST);
		};
		
		var socket = new SoTradeConnection(connect);
		
		return {
			on: function (eventName, callback, angularScope) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				}, angularScope);
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},
			hasOpenQueries: function () { return socket.hasOpenQueries(); },
			txPackets: function() { return socket.txPackets(); },
			rxPackets: function() { return socket.rxPackets(); }
		};
	});

})();
