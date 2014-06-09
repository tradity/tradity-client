angular.module('tradity').
	controller('SponsorsCtrl', function($scope, socket, $stateParams) {
		$scope.sponsors = [
			{
				picture: 'http://placekitten.com/200/300',
				link: 'http://google.de',
				group: false,
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
