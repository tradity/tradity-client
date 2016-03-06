(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('AdminCtrl', function($scope, $stateParams, $state, safestorage, $feed, socket) {
    $scope.$emit('makeadmin');
    
    $scope.impersonateUser = function(uid) {
      socket.post('/impersonate/' + uid).then(function(result) {
        if (result._success) {
          safestorage.clear();
          $feed.clearFull();
          safestorage.check();
          $feed.fetch();
          $state.go('game.feed');
        } else {
          alert('Error: ' + JSON.stringify(result));
        }
      });
    };
  });

})();
