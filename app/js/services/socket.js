(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var enterDevMode = function() { document.cookie = 'devmode=1;expires=Fri, 31 Dec 9999 23:59:59 GMT'; };
var enterSrvDevMode = function() { document.cookie = 'srvdevmode=1;expires=Fri, 31 Dec 9999 23:59:59 GMT'; };

/**
 * @ngdoc service
 * @name tradity.socket
 * @description
 * # socket
 * Factory
 */
angular.module('tradity')
  .factory('socket', function ($rootScope, $q, API_HOST, lzma) {
    var webKeyStorage = {
      getKey: function() {
        var s = localStorage || window.localStorage;
        if (s && s['sotradekey'])
          return s['sotradekey'];
        
        var cookie = document.cookie.split(';');
        for (var i = 0; i < cookie.length; ++i) {
          var c = cookie[i].trim().split('=');
          if (c[0].toLowerCase() == 'key')
            return c[1];
        }
        
        return null;
      },
      setKey: function(k) {
        var s = localStorage || window.localStorage;
        
        if (s)
          s['sotradekey'] = k;
        
        if (this.getKey() != k)
          document.cookie = 'key=' + k + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        else
          document.cookie = 'key=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        
        return k;
      }
    };
    
    var tradityClientVersion = typeof TRADITY_BUILD_STAMP != 'undefined' ? TRADITY_BUILD_STAMP : 'TDYC0';
    
    var socket = new SoTradeConnection({
      connect: function() { return io.connect(API_HOST); },
      applyWrap: $rootScope.$apply.bind($rootScope),
      logDevCheck: function() { return document.cookie.indexOf('devmode') != -1; },
      logSrvCheck: function() { return document.cookie.indexOf('srvdevmode') != -1; },
      lzma: lzma,
      keyStorage: webKeyStorage,
      Promise: $q,
      clientSoftwareVersion: tradityClientVersion
    });
    
    return socket;
  });

})();
