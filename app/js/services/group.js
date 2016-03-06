(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.group
 * @description
 * # group
 * Factory
 */
angular.module('tradity')
  .factory('group', function ($q,socket) {
    var parseGroup = function(result) {
      return result.data;
    };

    return {
      /**
       * @ngdoc method
       * @name tradity.group#get
       * @methodOf tradity.group
       * @param  {string} schoolid uschoolid
       * @return {Promise} promise
       * @description
       * get schoolinfo
       */
      get:function(schoolid) {
        return socket.get('/school', {
          params: { lookfor: schoolid }
        }).then(function(result){
          return parseGroup(result);
        });
      },
    };
  });

})();
