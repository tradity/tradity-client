(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.dailyLoginAchievements
 * @description
 * # dailyLoginAchievements
 * Factory
 */
angular.module('tradity')
  .factory('dailyLoginAchievements', function (socket, config, safestorage) {
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
      return socket.get('/options').then(function(data) {
        var certs = safestorage.getEntry('dl_certificates') || [];
      
        if ((data.result && data.result.dla_optin) || force) {
          var serverCerts = [];
          for (var i = 0; i < certs.length; ++i)
            serverCerts.push(certs[i].cert);
          
          return socket.post('/achievements/client/daily-login-submit', {
            data: { certs: serverCerts }
          });
        }
      });
    };
    
    /**
     * @ngdoc method
     * @kind function
     * @name tradity.dailyLoginAchievements#getCertificates
     * @methodOf tradity.dailyLoginAchievements
     */
    DailyLoginAchievements.prototype.getCertificates = function() {
      var DLAValidityDays = config.server().DLAValidityDays;
      var minValidDate = DLAValidityDays ? 
        new Date(Date.now() - (DLAValidityDays+1) * 86400 * 1000) : new Date(0);
      
      // read certificates and filter out invalid ones
      return (safestorage.getEntry('dl_certificates') || []).filter(function(cert) {
        return new Date(cert.date) >= minValidDate;
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
      
      var certs = self.getCertificates();
      
      for (var i = 0; certs && i < certs.length; ++i) {
        if (certs[i].date == today)
          return; // already have an certificate for today
      }
      
      socket.get('/achievements/client/daily-login-cert').then(function(result) {
        if (result.data) {
          certs.push({cert: result.data, date: today});
          safestorage.setEntry('dl_certificates', certs);
        }
        
        return self.submitToServer(false);
      });
    };
    
    return new DailyLoginAchievements();
  });

})();
