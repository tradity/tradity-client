(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('SearchCtrl', function($rootScope, $scope, $stateParams, $state, socket) {
    $scope.users = [];
    $scope.searchText = $stateParams.query;
    $scope.filter = "";
    $scope.groups = [];

    $scope.search = function() {
      if ($scope.searchText.length !== 0) {
        socket.get('/ranking', {
          params: { search: $scope.searchText, includeAll: true }
        }).then(function(result) {
          if (result._success) {
            $scope.users = result.data;
          }
        });
        
        $scope.filter = $scope.searchText;
        socket.get('/schools', { 
          params: { search: $scope.searchText }
        }).then(function(result) {
          $scope.groups = result.data;
        });  
      }

      if ($scope.searchText.length > 2) 
        socket.get('/stocks/search', { 
          params: { name: $scope.searchText }
        }).then(function(result) {
          $scope.stocks = result.data;
        });  
    };
    
    if($stateParams.query)
      $scope.search();
  });

})();
