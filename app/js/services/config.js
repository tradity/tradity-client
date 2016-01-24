(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.config
 * @description
 * all config parameters
 * ```json
 * {
 *  API_HOST:String,
 *  DEFAULT_PROFILE_IMG:String,
 *  server:A function returning the server config
 * }
 * ```
 */
angular.module('tradity')
  .factory('config', function (API_HOST, DEFAULT_PROFILE_IMG, WIKIFOLIO_API, socket) {
    return {
      API_HOST: API_HOST,
      DEFAULT_PROFILE_IMG: DEFAULT_PROFILE_IMG,
      WIKIFOLIO_API: WIKIFOLIO_API,
      server: function() { return socket.serverConfig || {}; }
    };
  });

})();
