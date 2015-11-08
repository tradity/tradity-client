'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
	controller('SponsorsCtrl', function($scope, $rootScope, socket, $stateParams) {
		$scope.sponsors = [
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/02/Tradity_EckernfoerderBank_Unterstuetzer.png',
				link: 'https://www.eckernfoerder-bank.de/privatkunden.html',
				schoolPathRegex: /^\/eckernfoerde(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/02/Boersenspiel_Tradity_Unterstuetzer_FS-Christan-Sellhorn.png',
				link: 'http://www.fahrschulesellhorn.de/',
				schoolPathRegex: /^\/elmshorn(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_Fahrschule-Tiedemann.png',
				link: 'http://www.fahrschule-tiedemann.de/',
				schoolPathRegex: /^\/Schleswig(\/|$)/i,
				group: true
			},*/
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_FahrschuleSchneiderNMS.png',
				link: 'http://www.fahrschule-nms.de/',
				schoolPathRegex: /^\/Neumuenster(\/|$)/i,
				group: true
			},*/
			// {
			// 	picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_VR-Bank-Niebuell.png',
			// 	link: 'https://www.vrbankniebuell.de/privatkunden.html',
			// 	schoolPathRegex: /^\/niebuell(\/|$)/i,
			// 	group: true
			// },
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Logo_VRStormarn.png',
				link: 'https://www.volksbank-stormarn.de/privatkunden.html',
				schoolPathRegex: /^\/BadOldesloe(\/|$)/i,
				group: true
			},*/
			// {
			// 	picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_Husumer-Volksbank.png',
			// 	link: 'https://www.husumer-volksbank.de/homepage.html',
			// 	schoolPathRegex: /^\/Husum(\/|$)/i,
			// 	group: true
			// },
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_Nordseefahrschule-Husum.png',
				link: 'http://www.nordseefahrschule.de/',
				schoolPathRegex: /^\/Husum(\/|$)/i,
				group: true
			},*/
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/10/Boersenspiel_Tradity_Volksbank-Ahlen-Sassenberg-Warendorf_Unterstuetzer.png',
				link: 'https://www.vbasw.de/homepage.html',
				schoolPathRegex: /^\/sassenberg(\/|$)/i,
				group: true
			},*/
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Flatex_Unterstuetzer-e1403979869133.png',
				link: 'https://www.flatex.de/',
				group: true
			},*/
/*			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Logitech_Unterstuetzer-e1403979928493.png',
				link: 'http://www.logitech.com/de-de/speakers-audio/home-pc-speakers',
				group: true,
			},*/
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Passau.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Passau.png',
				schoolPathRegex: /^\/passau(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				schoolPathRegex: /^\/muenchen(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				schoolPathRegex: /^\/whu(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
				schoolPathRegex: /^\/unistgallen(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Victoria-Partners.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Victoria-Partners.png',
				schoolPathRegex: /^\/ebs(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Bertelsmann.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Bertelsmann.png',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_zeb.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_zeb.png',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU-Finance-Society.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU-Finance-Society.png',
				schoolPathRegex: /^\/whu(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_TUIC.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_TUIC.png',
				schoolPathRegex: /^\/muenchen(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_MIC.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_MIC.png',
				schoolPathRegex: /^\/uni-mannheim(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_FSI.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_FSI.png',
				schoolPathRegex: /^\/fsof(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_EBS.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_EBS.png',
				schoolPathRegex: /^\/ebs(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_HSG.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_HSG.png',
				schoolPathRegex: /^\/unistgallen(\/|$)/i,
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_BAML.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_BAML.png',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU.png',
				group: true,
			},
			{
				picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/03/Boersenspiel_Tradity_Unterstuetzer_BoerseFrankfurt.png',
				link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/03/Boersenspiel_Tradity_Unterstuetzer_BoerseFrankfurt.png',
				group: true,
			},
		];
		
		$scope.group = null;
		$scope.count = 0;

		$scope.getShown = function (data, group) {
			$scope.group = $scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.school;
		
			data = data || $rootScope.ownUser;
			group = group || $scope.group;
			
			if (!data)
				return;

			var userSchoolPath = group ? group.path : (data.bottomLevelSchool || {path: '/'}).path;

			$scope.count = 0;

			for (var i = $scope.sponsors.length - 1; i >= 0; i--) {
				$scope.sponsors[i].show = !$scope.sponsors[i].schoolPathRegex ||
					$scope.sponsors[i].schoolPathRegex.test(userSchoolPath);
				
				if ($scope.sponsors[i].show)
					$scope.count++;
			}
		}
		
		$scope.getShown();

		$scope.$on('user-update', function(event, data) {
			$scope.getShown(data);
		});
		
		$scope.$on('school-info-update', function(event, data) {
			$scope.getShown(null, data);
		});
		
		$scope.$on('$stateChangeSuccess', function() {
			$scope.getShown();
		});

		$scope.getWidth = function() {
			if ($scope.horizontal) 
				return 95/$scope.count+'%';
			else 
				return;
		}
	});
