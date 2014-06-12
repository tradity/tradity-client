angular.module('tradity').
	controller('NotificationsCtrl', function($scope, $rootScope, $stateParams, $state, socket, $timeout) {
		$scope.show = false;
		$scope.notifications = [];
		$scope.count = 0;
		$scope.amount = 7;

		$scope.isIn = function(a,b) {
			for (var i = a.length - 1; i >= 0; i--) {
				if (a[i].achname == b)
					return true;
			};
			return false;
		}

		$scope.add = function(notification) {

			if (notification.type == 'achievement') {
				notification.name = $rootScope.achievementTexts[notification.achname];
				if ($scope.isIn($scope.notifications,notification.achname))
					return false;
			}

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
			if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.ownUser && data.srcusername == $scope.$parent.$parent.ownUser.name)
				$scope.add(data);
		})

		socket.on('comment', function(data) {
			if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.ownUser && data.baseeventtype == 'user-register' && data.traderid == $scope.$parent.$parent.ownUser.uid) {
				data.type = "comment-pinboard-self"
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
