'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('TradeDetailsCtrl', function($scope, $stateParams, DEFAULT_PROFILE_IMG, socket, gettext) {
		$scope.getTradeInfo = function() {
			socket.emit('get-trade-info', {
				tradeid: $stateParams.tradeId,
				_cache: 20
			},
			function(data) {
				if (data.code == 'get-trade-info-notfound') {
					notification(gettext('Could not find this trade'));
				} else if (data.code == 'get-trade-info-success') {
					$scope.trade = data.trade;
					$scope.trade.price = Math.abs($scope.trade.money / $scope.trade.amount);
					data.comments.sort(function(a,b) { return b.time - a.time; });
					$scope.comments = data.comments;
					
					$.each($scope.comments, function(i, e) {
						e.comment = $sce.trustAsHtml(e.trustedhtml ? e.comment : escapeHTML(e.comment));
					});
					
					$scope.getUserInfo();
				}
			});
		};
		$scope.getUserInfo = function() {
			socket.emit('get-user-info', {
				lookfor: $scope.trade.userid,
				nohistory: true,
				_cache: 20
			},
			function(data) {
				$scope.user = data.result;
				if (!$scope.user.profilepic)
						$scope.user.profilepic = DEFAULT_PROFILE_IMG;
			});
		};
		$scope.getTradeInfo();
	});
