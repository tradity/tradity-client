(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('GroupOverviewCtrl', function($scope, $sce, $state, $stateParams, DEFAULT_GROUP_BANNER, socket) {
    $scope.groups = [];

    socket.get('/schools').then(function(result) {
      $scope.groups = result.data;
    });
    
    $scope.createNewSchool = function () {
      socket.get('/options').then(function(result) {
        var t = prompt("Deine Schule, Organisation, Institut");
        result.data.school = t;
        $scope.selfIsSchoolMember = true;
        return socket.put('/options', { data: result.data });
      });
    };
  });

})();
