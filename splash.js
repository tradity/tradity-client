var App = {};

App.email = function($scope){
	$scope.success = false;
	$scope.submit = function() {
		email = this.email;
		$scope.success = true;
		this.email = '';
		console.log(email);
    };	
}