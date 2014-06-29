angular.module('tradity').
	controller('ChatCtrl', function($scope, $rootScope, socket, $stateParams, DEFAULT_PROFILE_IMG) {
		$scope.chats = $rootScope.chats;
		$scope.messages = [];
		$scope.eventId = 0;

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (!toParams.userId && !toParams.id)
				return;
			
			$scope.getChat(toParams.userId,toParams.id);
		})

		$scope.getChat = function(user,id) {
			console.log(user,id)
			socket.emit('chat-get', user ? {
				endpoints: [user]
			} : {
				chatid: id
			}, function(data) {
				/*$scope.messages = data.chat.messages;
				for (var i = 0; i < $scope.messages.length; ++i) {
					if (!$scope.messages[i].profilepic)
						$scope.messages[i].profilepic = DEFAULT_PROFILE_IMG;
				}
				*/
				//console.log(data)
				$scope.eventId = data.chat.eventid || data.chat.chatstartevent;
			}, $scope);
		}


		$scope.send = function(message) {
			socket.emit('comment', {
				eventid: $scope.eventId,
				comment: message
			}, function(data) {
				if (data.code == 'comment-success')
					$scope.comment = "";
			});
		}

		$scope.getLastMessage = function(chat) {
			var last = {time:false,comment:""};
			if ($scope.chats[chat].messages) for (var i = $scope.chats[chat].messages.length - 1; i >= 0; i--) {
				if ($scope.chats[chat].messages[i].time > last.time) last = $scope.chats[chat].messages[i];
			};
			return last;
		}

		$scope.getMessages = function(id) {
			if ($scope.chats[id]) return $scope.chats[id].messages;
			else return [];
		}


		if ($stateParams.userId || $stateParams.id)
			$scope.getChat($stateParams.userId,$stateParams.id);
	});
