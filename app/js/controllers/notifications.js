angular.module('tradity').
	controller('NotificationsCtrl', function($scope, $stateParams, $state, socket, $timeout) {
		$scope.show = false;
		$scope.notifications = [];

		$scope.add = function(notification) {
			var index = $scope.notifications.push(notification);

			
		};

		$scope.test = function() {
			$scope.add({
				message: 'test nachricht app gestartet',
				link:function() {

				},
				sticky: false,
			})
		}

		$scope.close = function(index) {
			$scope.notifications.splice(index,1);
		}

		$scope.test();

		socket.on('comment', function(event) {
			if (event.baseeventtype == 'chat-start') {
				//console.log('##push', event);
			}
		});
	});
