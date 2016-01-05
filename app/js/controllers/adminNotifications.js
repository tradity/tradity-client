(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('AdminNotificationsCtrl', function($scope, $sce, $stateParams, $state, socket) {
		$scope.content = '';
		$scope.sticky = false;
		$scope.ishtml = false;
	
		$scope.maybeHTMLizeContentSCE = function() {
			return $sce.trustAsHtml($scope.maybeHTMLizeContent());
		};
		
		$scope.maybeHTMLizeContent = function() {
			return $scope.ishtml ? $scope.content : escapeHTML($scope.content);
		};
		
		$scope.submitNotification = function() {
			socket.emit('notify-all', {
				sticky: $scope.sticky,
				content: $scope.maybeHTMLizeContent()
			}, function(data) {
				alert('Ok!');
			});
		};
		
		$scope.unstickNotification = function() {
			socket.emit('notify-unstick-all', function(data) {
				alert('Ok!');
			});
		};
	});

})();
