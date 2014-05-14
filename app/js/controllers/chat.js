angular.module('tradity').
	controller('ChatCtrl', function($scope, socket, $stateParams) {
		$scope.chats = {};

		socket.emit('list-all-chats', function(data) {
			console.log(data)
		}, $scope);
		
		if($stateParams.id) {
			socket.emit('list-all-chats',{
				type: 'chat-get',
				endpoints: []
			}, function(data) {
				console.log(data)
			}, $scope);
		}
	});



