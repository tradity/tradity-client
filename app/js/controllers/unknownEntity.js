(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('UnknownEntityCtrl', function($scope, $stateParams, $state, socket) {
    var entity = $stateParams.entity.replace(/\/$/, ''); // strip trailing slash
    socket.get('/school-exists', {
      params: { lookfor: entity }
    }).then(function(result) {
      if (result._success && result.data.exists) {
        $state.go('game.group', {schoolid: result.data.path});
      } else {
        var strippedEntity = entity.replace(/^\//, ''); // strip leading slash
        
        socket.get('/user/' + strippedEntity, {
          params: { nohistory: true }
        }).then(function(result) {
          if (result._success) {
            $state.go('game.profile', {userId: strippedEntity});
          } else {
            $state.go('error.404');
          }
        });
      }
    });
  });

})();
