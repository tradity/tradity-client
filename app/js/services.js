(function() {'use strict';

angular.module('tradity').
	factory('socket', function ($rootScope, API_HOST) {
		var socket = new SoTradeConnection(io.connect(API_HOST));
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
			}
		};
	});

})();
