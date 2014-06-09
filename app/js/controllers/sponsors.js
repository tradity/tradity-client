angular.module('tradity').
	controller('SponsorsCtrl', function($scope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/05/Tradity_Boersenspiel_Flatex.jpg',
				link: 'https://www.flatex.de/',
				group: true,
			},
			{
				picture: 'http://placekitten.com/200/70',
				link: 'http://google.de',
				group: true,
			}
		]
		$scope.group = false;

		if ($scope.$parent.$parent.school) 
			$scope.group = true;
		else
			$scope.group = false;
	});
