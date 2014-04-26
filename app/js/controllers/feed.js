angular.module('tradity').
	controller('FeedCtrl', function($scope, socket) {
		$scope.displaymessages = [];
		$scope.messageCount = 20;
		
		$scope.displayFeed = function() {
			$scope.displaymessages = $scope.messages.slice(0, parseInt($scope.messageCount));
		};

		$scope.lastScrollCheck = 0;
		$(window).scroll(function(e) {
			var now = new Date().getTime();
			if (now - $scope.lastScrollCheck < 250)
				return;
			$scope.lastScrollCheck = now;
			
			var d = document.documentElement;
			if ((d.scrollTop + d.clientHeight)/(d.scrollHeight) > 0.7 && $scope.messageCount < $scope.messages.length) {
				$scope.messageCount /= 0.8;
				$scope.$apply($scope.displayFeed);
			}
		});
		
		$scope.$on('messages-changed', function() {
			$scope.displayFeed();
		});
		
		$scope.displayFeed();
	});
