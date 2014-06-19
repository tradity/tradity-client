angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_FahrschuleTiedemann.png',
				link: 'http://www.fahrschule-tiedemann.de/',
				schoolPathRegex: /^\/Schleswig(\/|$)/i,
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_FahrschuleSchneiderNMS.png',
				link: 'http://www.fahrschule-nms.de/',
				schoolPathRegex: /^\/Neumuenster(\/|$)/i,
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBankNiebuell.png',
				link: 'https://www.vrbankniebuell.de/privatkunden.html',
				schoolPathRegex: /^\/niebuell(\/|$)/i,
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRStormarn.png',
				link: 'https://www.volksbank-stormarn.de/privatkunden.html',
				schoolPathRegex: /^\/BadOldesloe(\/|$)/i,
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRBANKHUSUM.png',
				link: 'https://www.husumer-volksbank.de/homepage.html',
				schoolPathRegex: /^\/Husum(\/|$)/i,
				group: true
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_NordseefahrschuleHusum.png',
				link: 'http://www.nordseefahrschule.de/',
				schoolPathRegex: /^\/Husum(\/|$)/i,
				group: true
			},
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
		]		
		$scope.group = null;

		$scope.getShown = function (data) {
			$scope.group = $scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.school;
		
			data = data || $rootScope.ownUser;

			
			if (!data)
				return;


			var userSchoolPath = $scope.group ? $scope.group.path : (data.topLevelSchool || {path: '/'}).path;

			for (var i = $scope.sponsors.length - 1; i >= 0; i--)
				$scope.sponsors[i].show = !$scope.sponsors[i].schoolPathRegex || $scope.sponsors[i].schoolPathRegex.test(userSchoolPath);
		}
		
		$scope.getShown();

		$scope.$on('user-update', function(event, data) {
			$scope.getShown(data);
		});
		
		$scope.$on('$stateChangeSuccess', function() {
			$scope.getShown();
		});
	});
