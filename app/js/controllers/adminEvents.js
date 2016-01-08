(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('AdminEventsCtrl', function($scope, socket) {
		$scope.eventCounts = [];
		$scope.lookupDay = {};
		$scope.eventStatistics = [];
		$scope.selectedDay = null;
		$scope.dayInfo = {};
		$scope.typeFilters = {};
		
		socket.emit('get-event-statistics').then(function(result) {
			if (result.code !== 'get-event-statistics-success') {
				return alert('Error get-event-statistics: ' + result.code);
			}
			
			$scope.eventStatistics = result.result;
			$scope.eventCounts = $scope.eventStatistics.map(function(e) {
				var date = new Date(e.timeindex*1000);
				e.date = date;
				
				$scope.lookupDay[date.toJSON()] = e;
				return {
					day: date,
					count: e.nevents
				};
			});
		});
		
		$scope.$watch('selectedDay', function() {
			if (!$scope.selectedDay || !new Date($scope.selectedDay).toJSON())
				return;
			
			var dayID = $scope.selectedDay.toJSON();
			$scope.dayInfo = $scope.lookupDay[dayID];
			
			socket.emit('list-all-events', {
				omitUidFilter: true,
				includeDeletedComments: true,
				since: parseInt($scope.selectedDay.getTime() / 1000),
				upto: parseInt($scope.selectedDay.getTime() / 1000 + 86400),
				_cache: 60
			}).then(function(result) {
				if (result.code !== 'list-all-events-success') {
					return alert('Error list-all-events: ' + result.code);
				}
				
				$scope.lookupDay[dayID].events = result.results;
				$scope.lookupDay[dayID].eventTypes = [];
				
				result.results.forEach(function(ev) {
					if (typeof $scope.typeFilters[ev.type] === 'undefined') {
						$scope.typeFilters[ev.type] = true;
					}
					
					if ($scope.lookupDay[dayID].eventTypes.indexOf(ev.type) === -1) {
						$scope.lookupDay[dayID].eventTypes.push(ev.type);
					}
				});
			});
		});
	});

})();
