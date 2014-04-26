angular.module('tradity').
	controller('DepotCtrl', function($scope, socket) {
		var ownDepotOrUser = function() {
			if (!$scope.ownUser)
				return;
			
			$scope.ownUser.depotvalue = 0;
			for (var i in $scope.results) {
				$scope.ownUser.depotvalue += parseInt($scope.results[i].total);
			}
		}

		socket.on('list-own-depot', function(data) {
			if (data.code == 'list-own-depot-success') {
				$scope.results = data.results;
				ownDepotOrUser();
			}
		}, $scope);

		socket.on('get-user-info', function(data) {
			if (!data.result.isSelf)
				return;

			var orders = data.orders;
			if (!orders)
				return;

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
		}, $scope);

		socket.on('dquery-list', function(data) {
			$scope.delayedOrders = [];
			for (var i = 0; i < data.results.length; ++i) {
				var q = data.results[i];
				if (q.query.type == 'stock-buy') {
					q.buysell = q.query.amount < 0 ? 'sell' : 'buy';
					q.amount = Math.abs(q.query.amount);
					$scope.delayedOrders.push(q);
				}
			}
		}, $scope);

		$scope.$on('user-update', ownDepotOrUser);

		socket.emit('get-user-info', { lookfor: '$self', _cache: 20 });
		socket.emit('list-own-depot', { _cache: 20 });
		socket.emit('dquery-list', { _cache: 20 });

		$scope.removeDelayedOrder = function(id) {
			socket.emit('dquery-remove', {
				queryid: id
			},
			function(data) {
				if (data.code == 'dquery-remove-success') {
					socket.emit('dquery-list');
				} else if (data.code == 'dquery-remove-notfound') {
					alert('Order nicht gefunden. Möglicherweise wurde sie bereits ausgeführt.');
				}
			});
		};
		
		socket.on('watchlist-show', function(data) {
			if (data.code == 'watchlist-show-success') {
				$scope.watchlist = data.results;
			}
		}, $scope);

		$scope.showWatchlist = function(nocache) {
			socket.emit('watchlist-show', nocache ? null : { _cache: 20 });
		};
		
		$scope.removeFromWatchlist = function(entry) {
			socket.emit('watchlist-remove', {
				stockid: entry.id
			},
			function(data) {
				if (data.code == 'watchlist-remove-success') {
					alert(entry.stockname + ' von der Watchlist entfernt');
					$scope.showWatchlist(true);
				}
			});
		};
		
		$scope.showWatchlist();
	});
