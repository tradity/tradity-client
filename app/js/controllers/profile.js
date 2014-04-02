angular.module('tradity').
	controller('ProfileCtrl', function($scope, $sce, $state, $stateParams, socket) {
		$scope.values = [];
		$scope.user = null;
		
		$scope.getUserInfo = function() {
			socket.emit('get-user-info', {
				lookfor: $stateParams.userId,
				_cache: 20
			},
			function(data) {
				if (data.code == 'get-user-info-notfound') {
					alert('Benutzer existiert nicht');
				} else if (data.code == 'get-user-info-success') {
					$scope.user = data.result;
					$scope.values = data.values;
					var orders = data.orders;
					orders.sort(function(a,b) { return b.buytime - a.buytime; });
					for (var i in orders) {
						if (orders[i].money > 0) {
							orders[i].ordertype = 'depot-buy';
						} else if (orders[i].money < 0) {
							orders[i].ordertype = 'depot-sell';
						} else {
							orders[i].ordertype = '';
						}
						orders[i].price = Math.abs(orders[i].money / orders[i].amount);
					}
					$scope.orders = orders;
					if (!$scope.user.profilepic)
						$scope.user.profilepic = $scope.serverConfig.defaultprofile;
					data.pinboard.sort(function(a,b) { return b.time - a.time; });
					$scope.comments = data.pinboard;
					$.each($scope.comments, function(i, e) {
						if (e.trustedhtml)
							e.comment = $sce.trustAsHtml(e.comment);
					});
				}
			});
		};
		$scope.addToWatchlist = function() {
			socket.emit('watchlist-add', {
				stockid: $scope.user.lstockid
			},
			function(data) {
				if (data.code == 'watchlist-add-success') {
					alert($scope.user.name + ' zur Watchlist hinzugefügt');
				} else if (data.code == 'watchlist-add-notfound') {
					alert('Benutzer nicht gefunden. Hier läuft etwas falsch.');
				}
			});
		};
		$scope.getUserInfo();
		// in case a profile gets called without /overview
		if ($state.includes('*.profile'))
			$state.go('.overview');
	});
