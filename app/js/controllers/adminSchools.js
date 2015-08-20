'use strict';

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
		
		socket.on('list-schools', function(data) {
			$scope.schoollist = data.result;
		}, $scope);
		
		socket.emit('list-schools');
		
		socket.on('list-wordpress-feeds', function(data) {
			$scope.feedblogs = data.results;
		}, $scope);
		
		socket.emit('list-wordpress-feeds');
		
		$scope.renameSchool = function(school) {
			var newname = prompt('Neuer Name für „' + school.name + '“');
			if (!newname)
				return;
			
			socket.emit('rename-school', {
				schoolid: school.id,
				schoolname: newname
			}, function(data) {
				if (data.code == 'rename-school-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
				
				socket.emit('list-schools');
			});
		};
		
		$scope.rePathSchool = function(school) {
			var newpath = prompt('Neuer Pfad für „' + school.name + '“ (muss dem Pfadmuster entsprechen)');
			if (!newpath)
				return;
			
			socket.emit('rename-school', {
				schoolid: school.id,
				schoolname: school.name,
				schoolpath: newpath
			}, function(data) {
				if (data.code == 'rename-school-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
				
				socket.emit('list-schools');
			});
		};
		
		$scope.deleteSchool = function(school) {
			if (!confirm('Wirklich Schule ' + school.id + ' („' + school.name + '“) löschen?'))
				return;
			
			socket.emit('join-schools', {
				masterschool: null,
				subschool: school.id
			}, function(data) {
				if (data.code == 'join-schools-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
				
				socket.emit('list-schools');
			});
		};
		
		$scope.joinSchools = function() {
			socket.emit('join-schools', {
				masterschool: parseInt($scope.joinmaster),
				subschool: parseInt($scope.joinsub)
			}, function(data) {
				if (data.code == 'join-schools-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
				
				socket.emit('list-schools');
			});
		};
		
		$scope.createSchool = function() {
			socket.emit('create-school', {
				schoolname: $scope.name,
				schoolpath: $scope.path
			}, function(data) {
				if (data.code == 'create-school-success')
					alert('Ok!');
				else
					alert('Fehler: ' + data.code);
				
				socket.emit('list-schools');
			});
		};
		
		$scope.setJoinMaster = function(entry) {
			$scope.joinmaster = entry.id;
		};
		
		$scope.setJoinSub = function(entry) {
			$scope.joinsub = entry.id;
		};
	});
