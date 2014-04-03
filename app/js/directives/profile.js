angular.module('tradity').
	directive('tradityProfile', function() {
		return function(scope, element, attrs) {
			console.log(element)
			attrs.$set('popover', 'popover-test');
			attrs.$set('popover-trigger', 'mouseenter');
		};
	});
