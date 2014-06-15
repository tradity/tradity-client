angular.module('tradity').
	controller('WalkthroughCtrl', function($rootScope, $scope, $timeout, $location, $state, socket, $rootScope) {

		$rootScope.walkthrough = false;
		$scope.steps = [
			{
				name: "Newsfeed",
				description: "Du befindest dich hier in deinem Feed. Wenn du von den neuesten Aktionen und Kommentaren deiner „Leader“ (was das für Leute sind, sagen wir dir nachher) und Freunde oder wichtigen Spielmeldungen erfahren willst, bist du hier richtig.",
				init: function() {
					$state.go('game.feed');
					$timeout(function() {
						//$("#feed").addClass('blink');
					},0)
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
				description: "Nun zeigen wir dir, wo du Aktien und „Leaderpapiere“ (was die sind, erklären wir dir nachher) kaufen und verkaufen kannst. Klicke dazu auf „Trade“ oben im Navigationsmenü.",
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
				description: "Hier findest du allerlei Informationen, die für den Handel von Bedeutung sind. Wenn du bei „Weitere Informationen“ auf den Link klickst, kommst du auf eine externe Seite, zu der du mehr Informationen findest. Wird dir langsam langweilig? Keine Angst, jetzt musst du gleich selbst aktiv werden!",
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
			{
				name: "Kaufen",
				description: "Du kaufst zum Kaufpreis und verkaufst zum Verkaufspreis – logisch. Der Unterschied zwischen den beiden Preisen heißt „Spread“ und ist umso größer, je weniger die Aktie auf dem Markt gehandelt wird. Achtung! Du würdest bei einem sofortigen Verkauf also Verlust machen.",
				init: function() {
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Kaufen",
				description: "Die ISIN ist eine eindeutige Kennnummer für Aktien. Wenn du also die ISIN einer Aktie kennst, kannst du dir sicher sein, dass es überall die gleiche Aktie ist. Du kannst so z. B. auch die ISIN in das Suchfenster eingeben, um eine bestimmte Aktie zu suchen.",
				init: function() {
					$timeout(function() {
						$(".isin").addClass('blink');
						$scope.okayButton = true;
						$scope.okay = $scope.next;
					},0)
				},
				exit: function() {
					$(".isin").removeClass('blink');
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
			 	name: "Suche",
			 	description: "Im Suchfeld kannst du nach Aktien oder sog. „Leader-Papieren“ suchen. Gib „Google“ ein.",
			 	init: function() {
			 		$timeout(function() {
						$("#paper").addClass('blink');
						$("#paper").on('input',function(e){
							if(this.value.toLowerCase() == 'google'.toLowerCase())
								$scope.next();
						});
					});
			 	},
			 	exit: function() {
			 		$("#paper").off('input');
			 		$("#paper").removeClass('blink');
			 	}
			 },
			 {
				name: "Kaufen",
				description: "Rechts findest du Informationen zum Wertpapier.",
				init: function() {
					$timeout(function() {
						$(".buyprice").addClass('blink');
						$scope.okayButton = true;
						$scope.okay = $scope.next;
					},0)
				},
				exit: function() {
					$(".buyprice").removeClass('blink');
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Kaufen",
				description: "Gib nun an, wie viele du kaufen möchtest (Am besten gibst du dort 1 ein, weil sonst das Tutorial nicht weitergeht) und klicke auf Trade.",
				init: function() {
					$timeout(function() {
						$("#amount").addClass('blink');
					},0)
					$scope.routeChange = function(next) {
						if(next.name == 'game.depot.listing') $scope.next();
					}
				},
				exit: function() {
					$("#amount").removeClass('blink');
					$scope.routeChange = function(next) {};
				}
			},
			{
				name: "Wertpapiere in Besitz",
				description: "Hier siehst Du nun die 1 Stück, die Du gekauft hast. Verkaufe sie nun wieder, indem Du auf das Trade-Symbol rechts in der Zeile klickst.",
				init: function() {
					$scope.routeChange = function(next) {
						if(next.name == 'game.tradesellbuy') $scope.next();
					}
				},
				exit: function() {
					$scope.routeChange = function(next) {};
				}
			},
			{
				name: "Trade",
				description: "Es wurde alles automatisch für Dich vorausgefüllt – Du musst nur noch auf Trade klicken und Du hast deine 1 Stück zum Verkaufspreis verkauft.",
				init: function() {
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Trade",
				description: "Nochmal überprüfen, ob alles so ist, wie Du Dir das vorgestellt hast, und dann den Trade bestätigen.",
				init: function() {
					$scope.routeChange = function(next) {
						if(next.name == 'game.ranking.all') $scope.next();
					}
				},
				exit: function() {
					$scope.routeChange = function(next) {};
				}
			},
			{
				name: "Rangliste",
				description: "Hier kannst Du deine Mitspieler sehen. Gib in der Suchleiste „Tradity_Admin“ ein und klicke auf den Namen. Du gelangst auf das Profil des Spielers.",
				init: function() {
					$scope.routeChange = function(next) {
						if(next.name == 'game.profile.overview') $scope.next();
					}
				},
				exit: function() {
					$scope.okay = function() {};
				}
			},
			{
				name: "Profil",
				description: "Du kannst in „Tradity_Admin“ investieren, indem Du auf „Folgen“ klickst und dann die sog. „Leaderpapiere“ von ihm kaufst – das ist Following... erläutern wir in einem anderen Walkthrough näher.",
				init: function() {
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Profil",
				description: "Du kannst „Tradity_Admin“ adden, um Nachrichten über seine Aktionen zu bekommen. Adde „Tradity-Admin“",
				init: function() {
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Einstellungen",
				description: "Hier kannst Du allerlei Einstellungen verändern.",
				init: function() {
					$state.go('game.options');
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Einstellungen",
				description: "Dort kannst Du Freunde per E-Mail zum Mitspielen einladen oder Du schickst ihnen deinen Link. Ihr erhaltet beide Bonus-XP für das Achievementsystem (erklären wir dir bei einem anderen Walkthrough). Außerdem gewinnst Du damit vielleicht einen Follower und hast dann größere Chancen auf den Leaderpreis – ein iPad 4.",
				init: function() {
					$scope.okayButton = true;
					$scope.okay = $scope.next;
				},
				exit: function() {
					$scope.okayButton = false;
					$scope.okay = function() {};
				}
			},
			{
				name: "Ende",
				description: "So – der Walkthrough ist durch. Wende dich bei Fragen gern an „Tradity_Admin“ oder schreibe uns an team@tradity.de eine Mail. Wir würden uns freuen, wenn Du unsere FB-Seite likest, weil dort über die Wochen- und Gesamtsieger und besondere Angebote berichtet wird. Viel Erfolg! – das Tradity Team",
				init: function() {
					$state.go('game.feed');
					$scope.success();

				},
				exit: function() {
				}
			},

		]

		$scope.step = 0;
		$scope.show = false;
		$rootScope.walkthrough = $scope.show;
		$scope.pp;
		$scope.okayButton = false;

		$scope.firstUserUpdate = null;
		/* temporarily disabled */
		/*$scope.$on('user-update', function (event, user) {
			if (!user || ($scope.firstUserUpdate == user.uid))
				return;
			
			$scope.firstUserUpdate = user.uid;
			if(user.result.skipwalkthrough  == 0)
				$scope.show = true;
			if(user.result.skipwalkthrough  == 1)
				$scope.show = false;
			if ($scope.show)
				$scope.start();
		});*/
		
		$scope.fetchSelf();

		$scope.routeChange =  function() {};
		$scope.okay = function () {};
		$rootScope.$on('$stateChangeSuccess', function(cur,next){
			$scope.routeChange(next);
		});



		var thisStep = $scope.steps[$scope.step];


		$scope.next = function() {
			$scope.step++;
			$scope.steps[$scope.step-1].exit();
			$scope.steps[$scope.step].init();
			$scope.name = $scope.steps[$scope.step].name;
			$scope.description = $scope.steps[$scope.step].description;
		}

		$scope.start = function() {
			$scope.steps[0].init();
			$scope.name = $scope.steps[$scope.step].name;
			$scope.description = $scope.steps[$scope.step].description;
		}

		$scope.success = function() {
			socket.emit('get-own-options', function(data) {
				data.result.skipwalkthrough = 1;
				socket.emit('change-options', data.result);
			});
		}
	});

