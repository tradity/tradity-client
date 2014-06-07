angular.module('tradity').
	controller('ChatCtrl', function($scope, socket, $stateParams) {
		$scope.chats = [];
		$scope.messages = [];
		$scope.eventId = 0;

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (!toParams.userId && !toParams.id)
				return;
			
			socket.emit('chat-get', toParams.userId ? {
				endpoints: [toParams.userId]
			} : {
				chatid: toParams.id
			}, function(data) {
				$scope.messages = data.chat.messages;
				$scope.eventId = data.chat.eventid || data.chat.chatstartevent;
			}, $scope);
		})

		socket.on('list-all-chats', function(data) {
			$scope.chats = data.chats;
		}, $scope);
		
		socket.emit('list-all-chats');

		socket.on('comment', function(event) {
			if (event.baseeventtype == 'chat-start' && event.baseeventid == $scope.eventId) {
				for (var i = 0; i < $scope.messages.length; ++i)
					if ($scope.messages[i].commentid == event.commentid)
						return;
				
				$scope.messages.push({
					comment: event.comment,
					eventid: $scope.eventId,
					profilepic: event.profilepic,
					uid: event.commenter,
					time: event.eventtime
				});
			}
		}, $scope);

		$scope.send = function(message) {
			console.log($scope.eventId);
			socket.emit('comment', {
				eventid: $scope.eventId,
				comment: message
			}, function(data) {
				if (data.code == 'comment-success')
					$scope.comment = "";
			});
		}
	});
