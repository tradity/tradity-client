angular.module('tradity').
	controller('AchievementsCtrl', function($scope, socket, $stateParams) {
		$scope.achievements = [
			{
				id: "TRADE_COUNT_1",
				name: "Mache 1 Trade.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_5",
				name: "Mache 5 Trades.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_11",
				name: "Mache 11 Trades.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_23",
				name: "Mache 23 Trades.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_49",
				name: "Mache 49 Trades.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_101",
				name: "Mache 101 Trades.",
				category: 0,
			},
			{
				id: "TRADE_COUNT_251",
				name: "Mache 251 Trades.",
				category: 0,
			},
			{
				id: "o.we",
				name: "Gib eine Order am Wochenende auf.",
				category: 0,
			},
			{
				id: "o.mo10uhr",
				name: "Gib eine Order am Montag vor 10 Uhr auf.",
				category: 0,
			},
			{
				id: "t.10uhr5",
				name: "Führe 5 Trades vor 10 Uhr aus.",
				category: 0,
			},
			{
				id: "t.uhr19",
				name: "Führe 1 Trade nach 10 Uhr aus.",
				category: 0,
			},
			{
				id: "t.fruhr19",
				name: "Führe 1 Trade nach 19 Uhr am Freitag aus.",
				category: 0,
			},
			{
				id: "TRADE_VOLUME_25K",
				name: "Führe 1 Trade mit mehr als 25.000 € Volumen aus.",
				category: 0,
			},
			{
				id: "TRADE_STOCKNAME_AZ",
				name: "Trade ein Wertpapier, das mit A und eines, das mit Z beginnt.",
				category: 0,
			},
			{
				id: "t.i1h",
				name: "Kaufe und verkaufe ein Wertpapier innerhalb von einer Stunde.", 
				category: 0,
			},
			{
				id: "t.imin10d",
				name: "Kaufe und verkaufe ein Wertpapier erst nach 10 Tagen.",
				category: 0,
			},
			{
				id: "TRADE_SPLIT_BUY",
				name: "Kaufe ein Wertpapier, das du bereits im Depot hast.",
				category: 0,
			},
			{
				id: "TRADE_SPLIT_SELL",
				name: "Verkaufe einen Teil eines Wertpapieres aus deinem Depot.",
				category: 0,
			},
			{
				id: "t.buylimit",
				name: "Führe eine Buy Limit Order aus.",
				category: 0,
			},
			{
				id: "t.buystop",
				name: "Führe eine Buy Stop Order aus.",
				category: 0,
			},
			{
				id: "t.selllimit",
				name: "Führe eine Sell Limit Order aus.",
				category: 0,
			},
			{
				id: "t.sellstop",
				name: "Führe eine Sell Stop Order aus.",
				category: 0,
			},
			{
				id: "d.plus1",
				name: "Mache heute insgesamt Plus.",
				category: 0,
			},
			{
				id: "d.plus3row",
				name: "Mache an drei aufeinanderfolgenden Tagen Plus (ohne Wochenende).",
				category: 0,
			},
			{
				id: "d.plus5row",
				name: "Mache an fünf aufeinanderfolgenden Tagen Plus (ohne Wochenende).",
				category: 0,
			},
			{
				id: "w.plus1",
				name: "Habe am Ende der Woche Plus.",
				category: 0,
			},
			{
				id: "TRADE_FOLLOWER_COUNT_1",
				name: "Führe 1 Followertrade aus (kaufe ein Leaderpapier).",
				category: 0,
			},
			{
				id: "TRADE_FOLLOWER_COUNT_5",
				name: "Führe 5 Followertrades aus.",
				category: 0,
			},
			{
				id: "TRADE_FOLLOWER_COUNT_19",
				name: "Führe 19 Followertrades aus.",
				category: 0,
			},
			{
				id: "TRADE_FOLLOWER_COUNT_51",
				name: "Führe 51 Followertrades aus.",
				category: 0,
			},
			{
				id: "t.ftop10",
				name: "Führe 1 Followertrade aus, bei dem du ein Leaderpapier kaufst, dass in den Top 10 ist.",
				category: 0,
			},
			{
				id: "c.1",
				name: "Mache 1 Kommentar.",
				category: 0,
			},
			{
				id: "c.5",
				name: "Mache 5 Kommentare in 2 verschiedenen Feeds.",
				category: 0,
			},
			{
				id: "c.17",
				name: "Mache 17 Kommentare in 10 verschiedenen Feeds.",
				category: 0,
			},
			{
				id: "c.47",
				name: "Mache 47 Kommentare in 25 verschiedenen Feeds.",
				category: 0,
			},
			{
				id: "c.101",
				name: "Mache 101 Kommentare in 50 verschiedenen Feeds.",
				category: 0,
			},
			{
				id: "c.5same",
				name: "Mache 5 Kommentare im selben Feed.",
				category: 0,
			},
			{
				id: "c.5people",
				name: "Führe einen Chat mit 5 Leuten.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_1",
				name: "Lade 1 Person über deinen Referrallink ein. Diese muss sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_3",
				name: "Lade 3 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_5",
				name: "Lade 5 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_7",
				name: "Lade 7 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_11",
				name: "Lade 11 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_17",
				name: "Lade 17 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "REFERRAL_COUNT_29",
				name: "Lade 29 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.",
				category: 0,
			},
			{
				id: "LEADER_PROFILE_IMAGE",
				name: "Lade ein Profilbild hoch.",
				category: 0,
			},
			{
				id: "e.followme1",
				name: "Fordere 1 Person auf, dir zu folgen",
				category: 0,
			},
			{
				id: "LEADER_WPROV_CHANGE",
				name: "Ändere deine Gewinnprovision.",
				category: 0,
			},
			{
				id: "LEADER_LPROV_CHANGE",
				name: "Ändere deine Verlustprovision.",
				category: 0,
			},
			{
				id: "LEADER_DESC_CHANGE",
				name: "Schreibe eine Kurzbeschreibung über dich.",
				category: 0,
			}
		];

		$scope.categories = {
			0: {
				name: "Tradity",
				description: "Allgemeines um Tradity",
				img: "http://placekitten.com/80/80"
			},
			1: {
				name: "Trading",
				description: "Alle Erfolge beim Traden"
			}
		}

		$scope.userAchievements = [];

		$scope.categoryId = 0;
		if ($stateParams.id) 
			$scope.categoryId = $stateParams.id;

		$scope.category = function(id) {
			var achievements = [];
			for (var i = $scope.achievements.length - 1; i >= 0; i--) {
				if ($scope.achievements[i].category == id) 
					achievements.push($scope.achievements[i]);
			};
			return achievements;
		}

		$scope.achieved = function(id) {
			return ($scope.userAchievements.indexOf(id) != -1);
		}

		$scope.get = function() {
			socket.emit('get-user-info', {
				lookfor: '$self',
				_cache: 20
			},
			function(data) {
				console.log(data);
				
				for (i in data.achievements) {
					console.log(data.achievements[i]);
					$scope.userAchievements.push(data.achievements[i].achname);
				}
			});
		}

		$scope.get();

	});
