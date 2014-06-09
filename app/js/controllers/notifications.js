angular.module('tradity').
	controller('NotificationsCtrl', function($scope, $rootScope, $stateParams, $state, socket, $timeout) {
		$scope.show = false;
		$scope.notifications = [];

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

			$scope.notifications = $scope.notifications.slice(0,5);
		};

		socket.on('comment', function(event) {
			if (event.baseeventtype == 'chat-start') {
				//console.log('##push', event); }
			}
		});

		socket.on('achievement', function(data) {
			if (data.srcusername == $scope.$parent.$parent.ownUser.name) {
				$scope.add(data);
			}
		})



	});
