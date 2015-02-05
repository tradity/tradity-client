angular.module('tradity').
	controller('IndexCtrl', function(user,$state) {
		user.me().then(function(){
			$state.go('game.feed');
		})
	});
