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

		

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
			if(toParams.userId) {
				socket.emit('chat-get',{
					endpoints: [toParams.userId]
				}, function(data) {
					//$scope.messages = data.chat.messages;
					$scope.eventId = data.chat.eventid || data.chat.chatstartevent;
				}, $scope);
			} else if (toParams.id) {
				socket.emit('chat-get',{
					chatid:toParams.id
				}, function(data) {
					//$scope.messages = data.chat.messages;
					$scope.eventId = data.chat.eventid || data.chat.chatstartevent;
				}, $scope);
			}
		})

		$scope.loadChatList = function() {
			socket.emit('list-all-chats', function(data) {
				$scope.chats = [];
				for (i in data.chats) {
					if (!data.chats[i].profilepic) data.chats[i].profilepic = 'http://placekitten.com/80/80';
					$scope.chats.push(data.chats[i]);
					$scope.getChatImage(data.chats[i].id);
				}
			}, $scope);
		}
		$scope.loadChatList();

		socket.on('comment', function(event) {
			console.log('##', event);
			if (event.baseeventtype == 'chat-start' && event.baseeventid == $scope.eventId) {
				$scope.messages.push({
					comment: event.comment,
					eventid: $scope.eventId,
					profilepic: event.profilepic,
					uid: event.commenter,
					time:event.eventtime
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

		$scope.getChat = function(id) {
			for (var i = $scope.chats.length - 1; i >= 0; i--) {
				if ($scope.chats[i].id == id) return i;
			};
		}

		$scope.getChatImage = function(chatId) {
			var chat = $scope.chats[$scope.getChat(chatId)];
			$scope.getUserInfo(chat.members[0].id,function (data) {
				if (data) chat.profilepic = data.profilepic;
			})
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



