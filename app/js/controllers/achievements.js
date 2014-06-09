angular.module('tradity').
	controller('AchievementsCtrl', function($scope, socket, $stateParams) {
		$scope.achievements = [];
		$scope.achievementTexts = {
			'TRADE_COUNT_1': 'Mache 1 Trade.',
			'TRADE_COUNT_2': 'Mache 2 Trades.',
			'TRADE_COUNT_5': 'Mache 5 Trades.',
			'TRADE_COUNT_10': 'Mache 10 Trades.',
			'TRADE_COUNT_25': 'Mache 25 Trades.',
			'TRADE_COUNT_50': 'Mache 50 Trades.',
			'TRADE_COUNT_100': 'Mache 100 Trades.',
			'TRADE_COUNT_250': 'Mache 250 Trades.',
			'o.we': 'Gib eine Order am Wochenende auf.',
			'o.mo10uhr': 'Gib eine Order am Montag vor 10 Uhr auf.',
			't.10uhr5': 'Führe 5 Trades vor 10 Uhr aus.',
			't.uhr19': 'Führe 1 Trade nach 10 Uhr aus.',
			't.fruhr19': 'Führe 1 Trade nach 19 Uhr am Freitag aus.',
			'TRADE_VOLUME_25K': 'Führe 1 Trade mit mehr als 25.000 € Volumen aus.',
			'TRADE_STOCKNAME_AZ': 'Trade ein Wertpapier, das mit A und eines, das mit Z beginnt.',
			'TRADE_RESELL_1H': 'Kaufe und verkaufe ein Wertpapier innerhalb von einer Stunde.',
			'TRADE_RESELL_10D': 'Kaufe und verkaufe ein Wertpapier erst nach 10 Tagen.',
			'TRADE_SPLIT_BUY': 'Kaufe ein Wertpapier, das du bereits im Depot hast.',
			'TRADE_SPLIT_SELL': 'Verkaufe einen Teil eines Wertpapieres aus deinem Depot.',
			't.buylimit': 'Führe eine Buy Limit Order aus.',
			't.buystop': 'Führe eine Buy Stop Order aus.',
			't.selllimit': 'Führe eine Sell Limit Order aus.',
			't.sellstop': 'Führe eine Sell Stop Order aus.',
			'd.plus1': 'Mache heute insgesamt Plus.',
			'd.plus3row': 'Mache an drei aufeinanderfolgenden Tagen Plus (ohne Wochenende).',
			'd.plus5row': 'Mache an fünf aufeinanderfolgenden Tagen Plus (ohne Wochenende).',
			'w.plus1': 'Habe am Ende der Woche Plus.',
			'TRADE_FOLLOWER_COUNT_1': 'Führe 1 Followertrade aus (kaufe ein Leaderpapier).',
			'TRADE_FOLLOWER_COUNT_5': 'Führe 5 Followertrades aus.',
			'TRADE_FOLLOWER_COUNT_25': 'Führe 25 Followertrades aus.',
			'TRADE_FOLLOWER_COUNT_50': 'Führe 50 Followertrades aus.',
			't.ftop10': 'Führe 1 Followertrade aus, bei dem du ein Leaderpapier kaufst, dass in den Top 10 ist.',
			'COMMENT_COUNT_1_1': 'Mache 1 Kommentar.',
			'COMMENT_COUNT_5_2': 'Mache 5 Kommentare in 2 verschiedenen Feeds.',
			'COMMENT_COUNT_15_10': 'Mache 15 Kommentare in 10 verschiedenen Feeds.',
			'COMMENT_COUNT_50_25': 'Mache 50 Kommentare in 25 verschiedenen Feeds.',
			'COMMENT_COUNT_100_50': 'Mache 100 Kommentare in 50 verschiedenen Feeds.',
			'COMMENT_COUNT_5_1': 'Mache 5 Kommentare im selben Feed.',
			'CHAT_PARTICIPANTS_5': 'Führe einen Chat mit 5 Leuten.',
			'REFERRAL_COUNT_1': 'Lade 1 Person über deinen Referrallink ein. Diese muss sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_3': 'Lade 3 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_5': 'Lade 5 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_10': 'Lade 10 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_20': 'Lade 20 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_30': 'Lade 30 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_50': 'Lade 50 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_75': 'Lade 75 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_100': 'Lade 100 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'REFERRAL_COUNT_222': 'Lade 222 Personen über deinen Referrallink ein. Diese müssen sich anschließend registrieren und mind. 1 Trade machen.',
			'LEADER_PROFILE_IMAGE': 'Lade ein Profilbild hoch.',
			'e.followme1': 'Fordere 1 Person auf, dir zu folgen',
			'LEADER_WPROV_CHANGE': 'Ändere deine Gewinnprovision.',
			'LEADER_LPROV_CHANGE': 'Ändere deine Verlustprovision.',
			'LEADER_DESC_CHANGE': 'Schreibe eine Kurzbeschreibung über dich.',
			'DAILY_LOGIN_DAYS_2': 'Sei 2 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_3': 'Sei 3 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_4': 'Sei 4 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_5': 'Sei 5 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_6': 'Sei 6 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_7': 'Sei 7 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_8': 'Sei 8 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_9': 'Sei 9 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_10': 'Sei 10 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_11': 'Sei 11 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_12': 'Sei 12 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_13': 'Sei 13 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_14': 'Sei 14 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_15': 'Sei 15 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_16': 'Sei 16 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_17': 'Sei 17 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_18': 'Sei 18 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_19': 'Sei 19 Tage nacheinander angemeldet.',
			'DAILY_LOGIN_DAYS_20': 'Sei 20 Tage nacheinander angemeldet.'
		};
		
		socket.emit('list-all-achievements', {
			_cache: 1800
		}, function(data) {
			$scope.achievements = data.result;
			
			for (var i = 0; i < $scope.achievements.length; ++i) 
				$scope.achievements[i].text = $scope.achievementTexts[$scope.achievements[i].name];
		});

		$scope.categories = {
			'TRADING': {
				name: "Trader",
				description: "Deine Achievements im Trading",
				// img: "http://placekitten.com/80/80",
				achievements: 0,
				achieved: 0,
			},
			'FOLLOWER': {
				name: "Follower",
				description: "Deine Achievements im Following",
				achievements: 0,
				achieved: 0,
			},
			'SOCIAL': {
				name: "Socializer",
				description: "Wie 'social' bist du?",
				achievements: 0,
				achieved: 0,
			},
			'LEADER': {
				name: "Leader",
				description: "Wie gut bist du als Leader?",
				achievements: 0,
				achieved: 0,
			},
		};
		
		for (var i in $scope.categories)
			$scope.categories[i].linkId = i.toLowerCase();

		$scope.userAchievements = [];

		$scope.categoryId = '';
		if ($stateParams.id) 
			$scope.categoryId = $stateParams.id.toUpperCase();

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
			}, function(data) {
				for (i in data.achievements) {
					$scope.userAchievements.push(data.achievements[i].achname);
				}

				for (var i = $scope.achievements.length - 1; i >= 0; i--) {
					$scope.achievements[i].achieved = ($scope.userAchievements.indexOf($scope.achievements[i].name) != -1);

					if (!$scope.categories[$scope.achievements[i].category])
						continue;
					
					$scope.categories[$scope.achievements[i].category].achievements++;
					
					if ($scope.achievements[i].achieved)
						$scope.categories[$scope.achievements[i].category].achieved++;
				};

			});
		}

		$scope.get();

	});
