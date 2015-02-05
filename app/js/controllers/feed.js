angular.module('tradity').
	controller('FeedCtrl', function($scope, $feed) {
		$scope.displaymessages = [];
		$scope.messageCount = 12;
		
		$scope.displayFeed = function() {
			$scope.displaymessages = $feed.items.slice(0, parseInt($scope.messageCount));
		};

		$scope.lastScrollCheck = 0;
		$(window).scroll(function(e) {
			var now = new Date().getTime();
			if (now - $scope.lastScrollCheck < 250)
				return;
			$scope.lastScrollCheck = now;
			
			var d = document.documentElement;
			if ((d.scrollTop + d.clientHeight)/(d.scrollHeight) > 0.7 && $scope.messageCount < $feed.items.length) {
				$scope.messageCount /= 0.8;
				$scope.$apply($scope.displayFeed);
			}
		});
		
		$feed.$on('change', function() {
			$scope.displayFeed();
		});
		
		$scope.displayFeed();
	});
