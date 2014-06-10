angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Tradity_Boersenspiel_Flatex.jpg',
				link: 'https://www.flatex.de/',
				group: true,
				school:'TestSchule',
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
				group: true,
			},
		]
		$scope.group = false;

		var isIn = function(ob,val) {
			for (var i = ob.length - 1; i >= 0; i--) {
				if (ob[i].name == val) return true;
			};
			return false;
		}

		socket.on('self-info', function(data) {
				for (var i = $scope.sponsors.length - 1; i >= 0; i--) {
					if ($scope.sponsors[i].school)
						if (isIn(data.result.schools,$scope.sponsors[i].school))
							$scope.sponsors[i].show = true;
						else
							$scope.sponsors[i].show = false;
					else
						$scope.sponsors[i].show = true;
				};
		});

		if ($scope.$parent.$parent.school) 
			$scope.group = true;
		else
			$scope.group = false;
	});

