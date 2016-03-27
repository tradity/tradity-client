(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.socket
 * @description
 * # socket
 * Factory
 */
angular.module('tradity')
  .factory('socket', function ($rootScope, API_HOST, $http) {
    var webKeyStorage = {
      getKey: function() {
        var s = localStorage || window.localStorage;
        if (s && s['sotradekey'])
          return s['sotradekey'];
        
        var cookie = document.cookie.split(';');
        for (var i = 0; i < cookie.length; ++i) {
          var c = cookie[i].trim().split('=');
          if (c[0].toLowerCase() == 'sotradekey')
            return c[1];
        }
        
        return null;
      },
      setKey: function(k) {
        var s = localStorage || window.localStorage;
        
        if (s)
          s['sotradekey'] = k;
        
        if (this.getKey() != k)
          document.cookie = 'sotradekey=' + k + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        else
          document.cookie = 'sotradekey=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        
        return k;
      }
    };
    
    var tradityClientVersion = typeof TRADITY_BUILD_STAMP != 'undefined' ? TRADITY_BUILD_STAMP : 'TDYC0';
    
    var $scope = $rootScope.$new(true);
    
    var socket = function(options, url, method) {
      options = options || {};
      
      if (!options.url) {
        options.url = url;
      }
      
      var origURL = options.url;
      
      options.url = API_HOST + '/api/v1' + options.url;
      
      if (!options.method) {
        options.method = method;
      }
      
      options.headers = options.headers || {};
      options.headers['Authorization'] = webKeyStorage.getKey();
      
      if (options.json) {
        options.responseType = 'json';
      }
      
      socket.openQueries++;
      socket.sent++;
      return $http(options).then(function(response) {
        return response;
      }, function(error) {
        if (error.status) {
          return error;
        }
        
        throw error;
      }).then(function(response) {
        socket.openQueries--;
        socket.received++;
        
        var body = response.data || {};
        
        body._success = response.status >= 200 && response.status <= 299;
        
        if (body.key) {
          webKeyStorage.setKey(body.key);
        }
        
        if (body._success && origURL.match(/^\/config/)) {
          socket.serverConfig = body.data;
        }
        
        $rootScope.$emit(options.uri, body);
        $rootScope.$emit(origURL, body);
        $rootScope.$emit('socket:answer', {
          request: options,
          response: response,
          result: body,
          origURL: origURL
        });
        
        return body;
      });
    };
    
    socket.openQueries = 0;
    socket.sent = 0;
    socket.received = 0;
    socket.hasOpenQueries = function() {
      return socket.openQueries > 0;
    };
    socket.serverConfig = {};
    
    socket.get    = function(url, opt) { return socket(opt, url, 'GET'); };
    socket.post   = function(url, opt) { return socket(opt, url, 'POST'); };
    socket.delete = function(url, opt) { return socket(opt, url, 'DELETE'); };
    socket.update = function(url, opt) { return socket(opt, url, 'UPDATE'); };
    socket.put    = function(url, opt) { return socket(opt, url, 'PUT'); };
    
    return socket;
  });
})();
