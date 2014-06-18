angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Tradity_Boersenspiel_Flatex.jpg',
				link: 'https://www.flatex.de/',
				group: true
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
				school:'Niebüll',
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRStormarn.png',
				link: 'https://www.volksbank-stormarn.de/privatkunden.html',
				school:'Badoldesloe',
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBANKHUSUM.png',
				link: 'https://www.husumer-volksbank.de/homepage.html',
				school:'Husum',
				group: true
			},
		]

		$scope.getShown = function (data) {
			if (!data && $rootScope.ownUser)
				data = $rootScope.ownUser;
			if (!data)
				return;
			for (var i = $scope.sponsors.length - 1; i >= 0; i--)
				$scope.sponsors[i].show = (data.topLevelSchool.name == $scope.sponsors[i].school || !$scope.sponsors[i].school);
		}
		$scope.getShown(false);

		$scope.$on('user-update', function(event, data) {
			$scope.getShown(data);
		});

		$scope.group = !!($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.school);
	});
