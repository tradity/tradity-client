angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Tradity_Boersenspiel_Flatex.jpg',
				link: 'https://www.flatex.de/',
				group: true,
				schoolPathRegex: /^\/TestSchule(\/|$)/
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Logo_Logitech.png',
				link: 'http://www.logitech.com/de-de/speakers-audio/home-pc-speakers',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Logo_Boerse_Frankfurt.png',
				link: 'http://www.boerse-frankfurt.de/de/start#&reiter=vedesanleihe',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_Campello.png',
				link: 'http://www.campello-store.com/',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBankNiebuell.png',
				link: 'https://www.vrbankniebuell.de/privatkunden.html',
				schoolPathRegex: /^\/niebuell(\/|$)/,
				group: true
			},
		]

		$scope.$on('user-update', function(event, data) {
			var userSchoolPath = (data.bottomLevelSchool || {path: '/'}).path;
			
			for (var i = $scope.sponsors.length - 1; i >= 0; i--)
				$scope.sponsors[i].show = !$scope.sponsors[i].schoolPathRegex || $scope.sponsors[i].schoolPathRegex.test(userSchoolPath);
		});

		$scope.group = !!$scope.$parent.$parent.school;
	});
