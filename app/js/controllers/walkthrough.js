angular.module('tradity').
	controller('WalkthroughCtrl', function($scope, $timeout, $location, $state, socket, $rootScope) {
		$scope.steps = [
			{
				name: "Willkommen",
				description: "Um den tollsten Menschen der Welt zu Watchen ! Klicke auf die Rangliste !",
				condition:{
					type:'state',
					element:'#rangliste',
					state:'game.ranking.all'
				}
			},
			{
				name: "Toll",
				description: "Du hast es fast Geschaft noch ein Schritt zur Weltherschaft ! Suche einfacheruser",
				condition:{
					type:'keyup',
					value:'einfacheruser',
					element:'#rankingSearch input'
				}
			},
			{
				name: "jaaaa :)",
				description: "Klicke jetzt auf mich ! :D",
				condition:{
					type:'state',
					state:'game.profile.overview',
					key:'userId',
					value:'einfacheruser'
				}
			}
		]

		$scope.step = 0;
		$scope.show = false;
		$scope.pp;

		var thisStep = $scope.steps[$scope.step];


		var nextStep = function() {
			$scope.step++;
			if ($scope.step != $scope.steps.length) $scope.initStep();
			else {
				$scope.show = false;
				reset();
			}
		}

		var reset = function() {
				if ($scope.step != 0) {
					if ($scope.steps[$scope.step-1].condition.cb) $scope.steps[$scope.step-1].condition.cb();
					$($scope.steps[$scope.step-1].condition.element).unbind().removeClass('blink');
					if ($scope.pp.destroyPointPoint) $scope.pp.destroyPointPoint();
				}

				$scope.name = thisStep.name;
				$scope.description = thisStep.description;
				$scope.pp = $(thisStep.condition.element).pointPoint().addClass('blink');

		}


		$scope.initStep = function() {
			thisStep = $scope.steps[$scope.step];
			reset();

			switch (thisStep.condition.type) {
				case "state":
					thisStep.condition.cb = $rootScope.$on("$viewContentLoaded", function(event) {
						console.log($state)
						if (thisStep.condition.key && thisStep.condition.value) {
							if ($state.params[thisStep.condition.key] == thisStep.condition.value) nextStep();
						}
						else if ($state.current.name == thisStep.condition.state)
							nextStep();

					});
					break;
				default:
					$(thisStep.condition.element).bind($scope.steps[$scope.step].condition.type,function() {
						if (thisStep.condition.value) {
							if (thisStep.condition.value == $(thisStep.condition.element).val())
								$timeout(nextStep(),500);
						}
						else $timeout(nextStep,500);
					})
				break;
			}
		}

		if ($scope.show) $scope.initStep();
	});

