angular.module('tradity').
	controller('NotificationsCtrl', function($scope, $rootScope, $stateParams, $state, socket, $timeout) {
		$scope.show = false;
		$scope.notifications = [];
		$scope.count = 0;
		$scope.amount = 10;

		$scope.add = function(notification) {
			if (notification.type == 'achievement')
				notification.name = $rootScope.achievementTexts[notification.achname];
			var index = $scope.notifications.push(notification);			

			$scope.notifications.sort(function (a,b) {
				if (a.eeventtime < b.eventtime)
					return -1;
				if (a.leventtime > b.eventtime)
					return 1;
				return 0;
			})

			$scope.notifications = $scope.notifications.slice(0,$scope.amount+1);
			$scope.countUnseen();
		};

		socket.on('achievement', function(data) {
			if (data.srcusername == $scope.$parent.$parent.ownUser.name) {
				$scope.add(data);
			}
		})

		$scope.seen = function (id) {
			if ($scope.notifications[id].seen == 0) {
				$scope.notifications[id].seen = 1;
				socket.emit('mark-as-seen', {
					eventid: $scope.notifications[id].eventid,
					_cache: 30
				}, function(data) {
					
				});
				$scope.countUnseen();
			}
		}

		$scope.countUnseen = function() {
			$scope.count = 0;
			for (var i = $scope.notifications.length - 1; i >= 0; i--) {
				if ($scope.notifications[i].seen == 0) 
					$scope.count++;
			};
		}

	});
