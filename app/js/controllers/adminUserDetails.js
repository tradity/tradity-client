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
      socket.get('/user/' + $scope.inspectuid + '/followers').then(function(result) {
        if (data.result == 'get-followers-success') {
          $scope.followers = result.data;
        }
      });
      
      socket.get('/user/' + $scope.inspectuid, {
        params: { nohistory: true }
      }).then(function(result) {
        if (result._success) {
          $scope.inspectuser = result.data;
        } else {
          alert('Error: ' + JSON.stringify(data));
        }
      });
    }
  });

})();
