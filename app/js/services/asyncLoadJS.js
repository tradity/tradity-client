
/**
 * @ngdoc service
 * @name tradity.asyncLoadJS
 * @description
 * # asyncLoadJS
 * Factory
 */
angular.module('tradity')
	.factory('asyncLoadJS', function ($q, $http) {
		return function(files) {
			return $q.all(files.map(function(file) {
				return $http({url: file}).then(function(response) {
					return eval(response.data);
				});
			}));
		};
	});
