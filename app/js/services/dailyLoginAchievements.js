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
		
		DailyLoginAchievements.prototype.submitToServer = function() {
			var certs = safestorage.getEntry('dl_certificates') || [];
		
			if (data.result && data.result.clientopt &&
				data.result.clientopt.dailyLoginAchievements)
			{
				var serverCerts = [];
				for (var i = 0; i < certs.length; ++i)
					serverCerts.push(certs[i].cert);
				
				return socket.emit('dl-achievement', {
					certs: serverCerts
				});
			}
		};
		
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
				
				return socket.emit('get-own-options');
			}).then(function(data) {
				self.submitToServer();
			});
		}
		
		return new DailyLoginAchievements();
	});
