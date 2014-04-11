angular.module('tradity').
	controller('HerounitCtrl', function($scope, $rootScope, $stateParams, $state, socket, $window) {

		var onResize = function () {
			setTimeout(function() {
						$('#herounit').css('margin-top', -($('#herounit').height()/2));
						$('[ng-model="username"]').focus();
			}, 50);
		};

		$scope.goto = function (id) {
			$("body").animate({scrollTop:$('#'+id).offset().top}, 1700)
		}

		socket.on('get-user-info', function(data) {
			if (data.code != 'not-logged-in')
				$state.go('game.feed');
		}, $scope);

		$scope.fetchSelf();
});
