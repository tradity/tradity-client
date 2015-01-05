angular.module('tradity').
	controller('HerounitCtrl', function($scope, $rootScope, $stateParams, $state, socket, $window) {

		socket.on('get-user-info', function(data) {
			if (data.code != 'not-logged-in')
				$state.go('game.feed');
		}, $scope);

		$scope.fetchSelf();
});
