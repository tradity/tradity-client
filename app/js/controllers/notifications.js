angular.module('tradity').
	controller('NotificationsCtrl', function($scope, $stateParams, $state, socket, $timeout) {
		$scope.notifications = [];

		$scope.add = function(notification) {
			var index = $scope.notifications.push(notification);

			if (!notification.sticky)
				$timeout(function(){
					$scope.notifications.splice(index-1,1);
					console.log(index)
					console.log($scope.notifications)
				},5000);
		};

		$scope.test = function() {
			$scope.add({
				message:'test nachricht app gestartet',
				link:function() {

				},
				sticky:false,
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
