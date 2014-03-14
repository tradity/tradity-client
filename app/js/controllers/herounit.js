angular.module('tradity').
  controller('HerounitCtrl', function($scope, $stateParams, $location, socket, $window) {
    var onResize = function () {
      setTimeout(function() {
            $('#herounit').css('margin-top', -($('#herounit').height()/2));
            $('[ng-model="username"]').focus();
      }, 50);
    };
    $scope.$watch('ownUser', function() {
      if ($scope.ownUser == null) 
        $window.document.getElementsByTagName('html')[0].className = 'herounitFix';
      else
        $window.document.getElementsByTagName('html')[0].className = '';
    });

    $scope.actions = true;
    $scope.loginForm = false;
    $scope.registerForm = $stateParams.inviteCode ? true : false;
    
    
    $scope.showLogin = function () {
      $scope.actions = false;
      $scope.loginForm = true;
      $scope.registerForm = false;
      onResize();
    };

    $scope.showRegister = function () {
      $scope.actions = false;
      $scope.loginForm = false;
      $scope.registerForm = true;
      onResize();
    };

    $scope.goto = function (id) {
      $("#hero-wrapper").animate({scrollTop:$('#'+id).offset().top}, 1700)
    }

  });
