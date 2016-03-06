(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('AdminSchoolsCtrl', function($scope, $stateParams, $state, socket) {
    $scope.name = '';
    $scope.joinmaster = 0;
    $scope.joinsub = 0;
    $scope.schoollist = [];
    $scope.feedblogs = [];
    
    $scope.getSchools = function() {
      socket.get('/schools').then(function(result) {
        $scope.schoollist = result.data;
      });
    };
    
    $scope.getSchools();
    
    $scope.listWordpressFeeds = function() {
      socket.get('/wordpress/feeds').then(function(result) {
        $scope.feedblogs = result.data;
      });
    };
    
    $scope.listWordpressFeeds();
    
    $scope.renameSchool = function(school) {
      var newname = prompt('Neuer Name für „' + school.name + '“');
      if (!newname)
        return;
      
      socket.put('/school/' + school.id + '/name', {
        data: {
          schoolname: newname
        }
      }).then(function(data) {
        if (data._success)
          alert('Ok!');
        else
          alert('Fehler: ' + JSON.stringify(data));
        
        $scope.getSchools();
      });
    };
    
    $scope.rePathSchool = function(school) {
      var newpath = prompt('Neuer Pfad für „' + school.name + '“ (muss dem Pfadmuster entsprechen)');
      if (!newpath)
        return;
      
      socket.put('/school/' + school.id + '/name', {
        data: {
          schoolname: school.name,
          schoolpath: newpath
        }
      }).then(function(data) {
        if (data._success)
          alert('Ok!');
        else
          alert('Error: ' + JSON.stringify(data));
        
        $scope.getSchools();
      });
    };
    
    $scope.deleteSchool = function(school) {
      if (!confirm('Wirklich Schule ' + school.id + ' („' + school.name + '“) löschen?'))
        return;
      
      socket.post('/school/null/merge/' + school.id).then(function(data) {
        if (data._success)
          alert('Ok!');
        else
          alert('Error: ' + JSON.stringify(data));
        
        $scope.getSchools();
      });
    };
    
    $scope.joinSchools = function() {
      socket.post('/school/' + $scope.joinmaster + '/merge/' + $scope.joinsub).then(function(data) {
        if (data._success)
          alert('Ok!');
        else
          alert('Error: ' + JSON.stringify(data));
        
        $scope.getSchools();
      });
    };
    
    $scope.createSchool = function() {
      socket.post('/school', {
        data: {
          schoolname: $scope.name,
          schoolpath: $scope.path
        }
      }).then(function(data) {
        if (data._success)
          alert('Ok!');
        else
          alert('Error: ' + JSON.stringify(data));
        
        $scope.getSchools();
      });
    };
    
    $scope.setJoinMaster = function(entry) {
      $scope.joinmaster = entry.id;
    };
    
    $scope.setJoinSub = function(entry) {
      $scope.joinsub = entry.id;
    };
  });

})();
