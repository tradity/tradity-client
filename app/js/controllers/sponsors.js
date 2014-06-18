angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Tradity_Boersenspiel_Flatex.jpg',
				link: 'https://www.flatex.de/'
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Logo_Logitech.png',
				link: 'http://www.logitech.com/de-de/speakers-audio/home-pc-speakers'
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Logo_Boerse_Frankfurt.png',
				link: 'http://www.boerse-frankfurt.de/de/start#&reiter=vedesanleihe'
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_Campello.png',
				link: 'http://www.campello-store.com/'
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBankNiebuell.png',
				link: 'https://www.vrbankniebuell.de/privatkunden.html',
				schoolPathRegex: /^\/niebuell(\/|$)/i
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRStormarn.png',
				link: 'https://www.volksbank-stormarn.de/privatkunden.html',
				schoolPathRegex: /^\/BadOldesloe(\/|$)/i
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBANKHUSUM.png',
				link: 'https://www.husumer-volksbank.de/homepage.html',
				schoolPathRegex: /^\/Husum(\/|$)/i
			},
		]

		$scope.getShown = function (data) {
			data = data || $rootScope.ownUser;
			
			if (!data)
				return;

			var userSchoolPath = (data.bottomLevelSchool || {path: '/'}).path;
			for (var i = $scope.sponsors.length - 1; i >= 0; i--)
				$scope.sponsors[i].show = !$scope.sponsors[i].schoolPathRegex || $scope.sponsors[i].schoolPathRegex.test(userSchoolPath);
		}
		
		$scope.getShown();

		$scope.$on('user-update', function(event, data) {
			$scope.getShown(data);
		});

		$scope.group = !!($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.school);
	});
