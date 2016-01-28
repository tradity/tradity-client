(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  directive('tradityGroupChooser', function(socket, gettextCatalog, orderByFilter, searchStringSimilarity, $q) {
    return {
      templateUrl: 'app/templates/group-chooser.html',
      scope: { 
        school: '=?schoolModel',
        schoolID: '=schoolIdModel',
        schoolclass: '=schoolClassModel',
        displaylabel: '=displayLabel',
      },
      restrict: 'EA',
      controller: function($scope) {
        $scope.schoolList = $scope.schoolList || [];
        $scope.schoolListDeferred = $q.defer();
        $scope.schoolListPromise = $scope.schoolListDeferred.promise;
        
        $scope.setSchoolByIdentifier = function(identifier) {
          if ($scope.school && $scope.school.schoolid == identifier)
            return;
          
          $scope.schoolListPromise.then(function(schoolList) {
            var currentMatchPriority = -1;
            
            for (var i = 0; i < schoolList.length; ++i) {
              var school = schoolList[i];
              var matchPriority = [school.name, school.path, school.schoolid].indexOf(identifier);
              
              if (matchPriority > currentMatchPriority) {
                matchPriority = currentMatchPriority;
                
                $scope.school = school;
                $scope.schoolID = school.schoolid;
              }
            }
          });
        };
        
        socket.on('list-schools', function(result) {
          $scope.schoolList = result.result;
          $scope.schoolIndexByPath = {};
          var i;
          
          for (i = 0; i < $scope.schoolList.length; ++i)
            $scope.schoolIndexByPath[$scope.schoolList[i].path] = $scope.schoolList[i];
          
          for (i = 0; i < $scope.schoolList.length; ++i) {
            var entry = $scope.schoolList[i];
            entry.extraInfo = entry.usercount + '\u00a0' + gettextCatalog.getPlural(entry.usercount, 'Person', 'Persons');
            
            var sep = ' » '; // note that the spaces here are U+2009 (thin space) for compactness
            entry.displayName = entry.name;
            
            var current = entry;
            
            while (parentPath(current.path) != '/') {
              current = $scope.schoolIndexByPath[parentPath(current.path)];
              entry.displayName = current.name + sep + entry.displayName;
            }
          }
          
          if ($scope.schoolListDeferred) {
            $scope.schoolListDeferred.resolve($scope.schoolList);
            $scope.schoolListDeferred = null;
          }
          
          $scope.schoolListPromise = $q.when($scope.schoolList);
          
          $scope.setSchoolByIdentifier($scope.schoolID);
        }, $scope);
        
        $scope.$watch('school', function(newValue, oldValue) {
          if (!$scope.school) {
            $scope.schoolID = null;
            return;
          }
          
          if (typeof $scope.school.schoolid !== 'undefined')
            $scope.schoolID = $scope.school.schoolid;
          else
            $scope.schoolID = $scope.school;
        });
        
        $scope.$watch('schoolID', function(newValue, oldValue) {
          $scope.setSchoolByIdentifier(newValue);
        });
        
        socket.emit('list-schools', {_cache: 20});
        
        $scope.listGroups = function(enteredText) {
          return $scope.schoolListPromise.then(function(schoolList) {
            return orderByFilter([{
              displayName: gettextCatalog.getString('No Group'),
              schoolid: null,
              sortingRank: +Infinity
            }].concat(schoolList.filter(function(school) {
              return school.displayName.toLowerCase().indexOf(String(enteredText).toLowerCase()) != -1;
            }).map(function(school) {
              school.sortingRank = searchStringSimilarity(enteredText, school.displayName);
              return school;
            })), 'sortingRank', true);
          });
        };
      }
    };
  });

})();
