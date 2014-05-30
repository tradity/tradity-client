angular.module('tradity').
	controller('WalkthroughCtrl', function($rootScope, $scope, $timeout, $location, $state, socket, $rootScope) {

		$scope.steps = [
			{
				name: "Newsfeed",
				description: "Du befindest dich hier in deinem Feed. Wenn du von den neuesten Aktionen und Kommentaren deiner „Leader“ (was das für Leute sind, sagen wir dir nachher) und Freunde oder wichtigen Spielmeldungen erfahren willst, bist du hier richtig.",
				init: function() {
					$("#feed").addClass('blink');
					$scope.okayButton = true;
					$scope.okay = $scope.next;

				},
				exit: function() {
					$scope.okayButton = false;
					$("#feed").removeClass('blink');
					$scope.okay = function() {};
				}
			},
			{
				name: "Trade",
				description: "Nun zeigen wir dir, wo du Aktien und „Leaderpapiere“ (was die sind, erklären wir dir nachher) kaufen und verkaufen kannst. Klicke dazu auf „Trade“ links im Navigationsmenü.",
				init: function() {
					$("a[ui-sref='.trade']").addClass('blink');

					$scope.routeChange = function(next) {
						if(next.name == 'game.trade') $scope.next();
					}
				},
				exit: function() {
					$("a[ui-sref='.trade']").removeClass('blink');
					$scope.routeChange = function(next) {};
				}
			},
			{
				name: "Trade",
				description: "Hier findest du die Liste der meistgehandelten Aktien und Leader-Papiere bei Tradity. Wähle das Erste aus.",
				init: function() {
					$timeout(function() {
						$(".popularstocks").addClass('blink');

						$('.popularstocks').click(function () {
							$scope.next();
						});
					},0)
				},
				exit: function() {
					$(".popularstocks").removeClass('blink');
					$('.popularstocks a').unbind('click');
				}
			},
			{
				name: "Trade",
				description: "Hier findest du allerlei Informationen, die für den Handel von Bedeutung sind. Wenn du bei „Weitere Informationen“ auf den Link klickst, kommst du auf eine externe Seite, zu der du mehr Informationen findest. Wird die langsam langweilig? Keine Angst, jetzt musst du gleich selbst aktiv werden!",
				init: function() {
					$timeout(function() {
						$(".paper-preview-box").addClass('blink');
					},0)
					$scope.okayButton = true;
					$scope.okay = $scope.next;				
				},
				exit: function() {
					$(".paper-preview-box").removeClass('blink');
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			// {
			// 	name: "Suche",
			// 	description: "Hier kannst Du Aktien und „Leaderpapiere“ suchen. Gib z.B. „Bob der“ ein.",
			// 	init: function() {
			// 		$(".search-btn").addClass('blink');
			// 		$scope.routeChange = function(next) {
			// 			console.log(next);
			// 			if(next.name == 'game.search') $scope.next();
			// 		}
			// 	},
			// 	exit: function() {
			// 		$(".search-btn").removeClass('blink');
			// 		$scope.routeChange = function(next) {}
			// 	}
			// },
			// {
			// 	name: "Suche",
			// 	description: "Siehe da! Die „Bob der Baumeister AG“. Die Aktie gibt es nicht wirklich, aber sie soll hier als Beispiel dienen ;) Wähle die Aktie aus.",
			// 	init: function() {
					
			// 	},
			// 	exit: function() {
					
			// 	}
			// },
			{
				name: "Kaufen",
				description: "Du kaufst zum Kaufpreis und verkaufst zum Verkaufspreis – logisch. Der Unterschied zwischen den beiden Preisen heißt „Spread“ und ist umso größer, je weniger die Aktie auf dem Markt gehandelt wird. Achtung! Du würdest bei einem sofortigen Verkauf also Verlust machen.",
				init: function() {
					$scope.okayButton = true;
					$scope.routeChange = function() {
						$scope.routeChange = function(next) {};
						$timeout(function() {

						},0);
					}
				},
				exit: function() {
					
				}
			},
			{
				name: "Kaufen",
				description: "Die ISIN ist eine eindeutige Kennnummer für Aktien. Wenn du also die ISIN einer Aktie kennst, kannst du dir sicher sein, dass es überall die gleiche Aktie ist. Du kannst so z. B. auch die ISIN in das Suchfenster eingeben, um eine bestimmte Aktie zu suchen.",
				init: function() {
					
				},
				exit: function() {
					
				}
			}
		]

		$scope.step = 0;
		$scope.show = true;
		$scope.pp;
		$scope.okayButton = false;

		$scope.routeChange =  function() {};
		$scope.okay = function () {};
		$rootScope.$on('$stateChangeSuccess', function(cur,next){
			$scope.routeChange(next);
		});



		var thisStep = $scope.steps[$scope.step];


		$scope.next = function() {
			$scope.step++;
			$scope.steps[$scope.step].init();
			$scope.steps[$scope.step-1].exit();
			$scope.name = $scope.steps[$scope.step].name;
			$scope.description = $scope.steps[$scope.step].description;
		}

		$scope.start = function() {
			$scope.steps[0].init();
			$scope.name = $scope.steps[$scope.step].name;
			$scope.description = $scope.steps[$scope.step].description;
		}

		if ($scope.show) {
			$scope.start();
		}


	});

