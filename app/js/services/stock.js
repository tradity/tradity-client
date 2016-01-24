/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() { 'use strict';

angular.module('tradity')
  /**
   * @ngdoc service
   * @name tradity.stock
   * @description
   * # stock
   * Get stock info with the isin over different apis
   */
  .factory('stock', function ($http, config) {
    return {
      getComments: function(isin) {
        return $http.get(config.WIKIFOLIO_API + '/comments?underlyingISIN=' + isin + '&limit=3').then(function(res) {
          return res.data;
        }).catch(function(err) {
          console.log(err);
        });
      }
    };
  });

})();
