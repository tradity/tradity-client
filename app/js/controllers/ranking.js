angular.module('tradity').
	controller('RankingCtrl', function($scope, socket) {
		$scope.totalDisplayed = 20;

		$scope.loadMore = function() {
			$scope.totalDisplayed += 10;
		};
	});
