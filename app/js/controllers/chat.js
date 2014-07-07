angular.module('tradity').
	controller('ChatCtrl', function($scope, $rootScope, socket, $stateParams, DEFAULT_PROFILE_IMG, chat) {
		console.log(chat)
		$scope.chats = chat.chats;
		$scope.chat = {};
		$scope.id = false;
		$scope.comment = "";

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (!toParams.userId && !toParams.id)
				return;
			$scope.id = toParams.id;
		})

		$scope.$on("getMessage",function(){
			$scope.chats = chat.chats;
			$scope.chat = chat.getById($scope.id);
		})

		$scope.$on("getChat",function(){
			$scope.chats = chat.chats;
		})

		$scope.send = function(message) {
			socket.emit('comment', {
				eventid: $scope.chat.event,
				comment: message
			}, function(data) {
				console.log(data)
				if (data.code == 'comment-success')
					$scope.comment = "";
			});
		}
	});
