angular.module('tradity').
	controller('ProfileCtrl', function($scope, user, $sce, $state, $stateParams, DEFAULT_PROFILE_IMG, socket) {
		$scope.values = [];
		$scope.userAchievements = [];
		$scope.user = null;
		$scope.orders = [];

		user.get($stateParams.userId).then(function(user){
			if (!user) {
				alert('Ups')
				return;
			}
			$scope.user = user;
			$scope.values = user.values;
			$scope.userAchievements = user.achievements;
			var orders = user.orders;
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
			user.pinboard.sort(function(a,b) { return b.time - a.time; });
			$scope.comments = user.pinboard;
			$.each($scope.comments, function(i, e) {
				e.comment = $sce.trustAsHtml(e.trustedhtml ? e.comment : escapeHTML(e.comment));
			});

		})
		
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
		
		// in case a profile gets called without /overview
		if ($state.includes('*.profile'))
			$state.go('.overview');
	});
