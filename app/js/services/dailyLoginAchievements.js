'use strict';

/**
 * @ngdoc service
 * @name tradity.dailyLoginAchievements
 * @description
 * # dailyLoginAchievements
 * Factory
 */
angular.module('tradity')
	.factory('dailyLoginAchievements', function (socket, safestorage) {
		function DailyLoginAchievements () {
		}
		/**
		 * @ngdoc method
		 * @kind function
		 * @name tradity.dailyLoginAchievements#submitToServer
		 * @methodOf tradity.dailyLoginAchievements
		 * @param {object} force force
		 */
		DailyLoginAchievements.prototype.submitToServer = function(force) {
			return socket.emit('get-own-options').then(function(data) {
				var certs = safestorage.getEntry('dl_certificates') || [];
			
				if ((data.result && data.result.dla_optin) || force) {
					var serverCerts = [];
					for (var i = 0; i < certs.length; ++i)
						serverCerts.push(certs[i].cert);
					
					return socket.emit('dl-achievement', {
						certs: serverCerts
					});
				}
			});
		};
		/**
		 * @ngdoc method
		 * @kind function
		 * @name tradity.dailyLoginAchievements#check
		 * @methodOf tradity.dailyLoginAchievements
		 */
		DailyLoginAchievements.prototype.check = function() {
			var self = this;
			
			if (!safestorage.hasLoadedRemoteData)
				return;
			
			var today = new Date().toJSON().substr(0, 10);
			
			var certs = safestorage.getEntry('dl_certificates') || [];
			
			for (var i = 0; certs && i < certs.length; ++i)
				if (certs[i].date == today)
					return; // already have an certificate for today
			
			socket.emit('get-daily-login-certificate').then(function(data) {
				if (data.cert) {
					certs.push({cert: data.cert, date: today});
					safestorage.setEntry('dl_certificates', certs);
				}
				
				return self.submitToServer(false);
			});
		}
		
		return new DailyLoginAchievements();
	});
