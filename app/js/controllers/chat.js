angular.module('tradity').
	controller('ChatCtrl', function($scope, socket, $stateParams) {
		$scope.chats = [
			{
				name:"Bahkai",
				id:0,
				img:'http://placekitten.com/80/80'
			}
		];

		$scope.messages = [];
		$scope.eventId = 0;

		socket.emit('list-all-chats', function(data) {
			console.log(data);
		}, $scope);		

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if(toParams.userId) {
				console.log('chat get')
				socket.emit('chat-get',{
					endpoints: [toParams.userId]
				}, function(data) {
					$scope.messages = data.chat.messages.reverse();
					$scope.eventId = data.chat.eventid || data.chat.chatstartevent;
				}, $scope);
			}
		})

		socket.on('comment', function(event) {
			console.log(event)
		});

		$scope.send = function(message) {
			console.log($scope.eventId);
			socket.emit('comment', {
				eventid: $scope.eventId,
				comment: message
			}, function(data) {
				if (data.code == 'comment-success') {
					$scope.comment = "";
					$scope.messages.unshift({
						comment: message,
						eventid: $scope.eventId,
						profilepic: "/dynamic/files/35-7503-6c839031c5780df337a24d6c0d087b44",
						uid: false,
						username: "einfacheruser",
					});	
				}		
			});
		}

		$scope.getUserInfo = function(userId, cb) {
			socket.emit('get-user-info', {
				lookfor: userId,
				_cache: 20
			},
			function(data) {
				if (data.code == 'get-user-info-success')
					cb(data.result);
				else
					cb(false);
			});
		};


	});



