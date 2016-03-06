(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  controller('SponsorsCtrl', function($scope, $rootScope, $stateParams) {
    $scope.sponsors = [
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/02/Tradity_EckernfoerderBank_Unterstuetzer.png',
        link: 'https://www.eckernfoerder-bank.de/privatkunden.html',
        schoolPathRegex: /^\/eckernfoerde(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_VR-Bank-Niebuell.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_VR-Bank-Niebuell.png',
        schoolPathRegex: /^\/niebuell(\/|$)/i,
        group: true
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-HP_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-HP_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/niebuell(\/|$)/i,
        group: true
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2014/06/Boersenspiel_Tradity_Unterstuetzer_Husumer-Volksbank.png',
        link: 'https://www.husumer-volksbank.de/homepage.html',
        schoolPathRegex: /^\/Husum(\/|$)/i,
        group: true
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Passau.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_Passau.png',
        schoolPathRegex: /^\/passau(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Autzen_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Autzen_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/schleswig(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Roeh_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Roeh_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/schleswig(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Banner_Tradity_Luetjenburg_2.png',
        link: 'www.meine-vrbank.de',
        schoolPathRegex: /^\/luetjenburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/VR-Bank-Heide_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/VR-Bank-Heide_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/heide(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/VR-Bank-Altenburger-Land_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/VR-Bank-Altenburger-Land_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/altenburgerland(\/|$)/i,
        group: true,
      },      
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Porzig_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Porzig_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/altenburgerland(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Tomahaxx_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Tomahaxx_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/flensburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Suatec_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Suatec_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/schwarzenbek-geesthacht(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Raiffeisenbank-Lauenburg_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Raiffeisenbank-Lauenburg_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/ratzeburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/LTG.next_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/LTG.next_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/ratzeburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Lomoth_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Lomoth_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/ratzeburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/MTV-Vorsfelde_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/MTV-Vorsfelde_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/wolfsburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Mexxon_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Mexxon_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/bad-nauheim(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Haspa_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Haspa_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/hamburg(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Kleber_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Fahrschule-Kleber_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/bad-oldesloe(\/|$)/i,
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Expert_Tradity_Boersenspiel.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Expert_Tradity_Boersenspiel.png',
        schoolPathRegex: /^\/husum(\/|$)/i,
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
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_ACXIT-Capital-Partners.png',
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU.png',
        link: 'https://boersenspiel.tradity.de/wp-content/uploads/2015/11/Tradity_Boersenspiel_WHU.png',
        group: true,
      },
      {
        picture: 'https://boersenspiel.tradity.de/wp-content/uploads/2016/02/Wikifolio_Tradity_Boersenspiel.png',
        link: 'https://www.wikifolio.com/de/de/home?utm_source=tradity.de&utm_medium=landingpage&utm_content=wf-logo&utm_campaign=depot',
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
    };
    
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
    };
  });

})();
