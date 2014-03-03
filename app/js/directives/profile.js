angular.module('tradity').
	directive('tradityProfile', function() {
		return function(scope, element) {
			element.tooltip();
		};
	});