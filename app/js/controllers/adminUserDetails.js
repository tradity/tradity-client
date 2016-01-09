(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('AdminUserDetailsCtrl', function($scope, $stateParams, $state, socket) {
    $scope.inspectuid = $stateParams.uid || null;
    $scope.loginlist = [];
    $scope.followers = [];
    $scope.inspectuser = null;
    
    if ($scope.inspectuid !== null) {
      socket.emit('get-followers', {
        uid: $scope.inspectuid
      }, function(data) {
        if (data.code == 'get-followers-success') {
          $scope.followers = data.results;
        }
      });
      
      socket.emit('get-user-info', {
        _cache: 60,
        lookfor: $scope.inspectuid,
        nohistory: true
      }, function(data) {
        if (data.code == 'get-user-info-success') {
          $scope.inspectuser = data.result;
        } else {
          alert('Fehler: ' + data.code);
        }
      });
    }
  });

})();
