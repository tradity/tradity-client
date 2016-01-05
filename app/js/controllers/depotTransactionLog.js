(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('DepotTransactionLogCtrl', function($scope, socket) {
		$scope.transactions = [];
		
		socket.emit('list-transactions', function(data) {
			if (data.code != 'list-transactions-success')
				return;
			
			$scope.transactions = data.results;
			
			var transactionTypes = {
				'provision': 'Provision',
				'stockprice': 'Handel',
				'fee': 'Gebühren'
			};
			
			var transactionReasons = {
				'regular-provisions': '(regelmäßig)',
				'trade': 'Handel'
			};
			
			for (var i = 0; i < $scope.transactions.length; ++i) {
				$scope.transactions[i].typeText   = transactionTypes[$scope.transactions[i].type] || $scope.transactions[i].type;
				$scope.transactions[i].reasonText = transactionReasons[$scope.transactions[i].json.reason] || $scope.transactions[i].json.reason;
				
				var activePayer = $scope.transactions[i].amount >= 0;
				$scope.transactions[i].payerId   = activePayer ? $scope.transactions[i].a_user : $scope.transactions[i].p_user;
				$scope.transactions[i].payerName = activePayer ? $scope.transactions[i].aname  : $scope.transactions[i].pname;
				$scope.transactions[i].payeeId   = activePayer ? $scope.transactions[i].p_user : $scope.transactions[i].a_user;
				$scope.transactions[i].payeeName = activePayer ? $scope.transactions[i].pname  : $scope.transactions[i].aname;
			}
		});
	});

})();
