'use strict';

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, $routeParams, $location, socket) {
    if ($routeParams.emailVerifCode && $routeParams.uid) {
      socket.emit('emailverif', {
        key: $routeParams.emailVerifCode,
        uid: $routeParams.uid
      },
      function(data) {
        switch (data.code) {
          case 'email-verify-success':
            alert('Emailadresse erfolgreich bestätigt');
            break;
          case 'email-verify-already-verified':
            alert('Emailadresse bereits bestätigt');
            break;
          case 'email-verify-other-already-verified':
            alert('Jemand anderes hat diese Emailadresse bereits bestätigt');
            break;
          case 'email-verify-failure':
            alert('Fehler beim Bestätigen der Emailadresse');
        }
      });
    }
    $scope.login = function() {
      socket.emit('login', {
        name: $scope.username,
        pw: $scope.password,
        stayloggedin: false
      },
      function(data) {
        switch (data.code) {
          case 'login-success':
            $location.path('/')
            break;
          case 'login-badname':
            alert('Benutzer existiert nicht');
            break;
          case 'login-wrongpw':
            alert('Falsches Passwort');
            break;
          case 'login-email-not-verified':
            alert('Emailadresse noch nicht bestätigt');
        }
      });
    };
  }).
  controller('MainCtrl', function($scope, $location, socket) {
    socket.on('response', function(data) {
      if (data.code == 'not-logged-in') {
        alert('Nicht eingeloggt');
        $location.path('/login');
      }
    });
  }).
  controller('RegistrationCtrl', function($scope, $location, socket) {
    $scope.school = null;
    socket.emit('list-schools', {}, function(data) {
      $scope.schools = data.result;
    });
    socket.on('register', function(data) {
      if (data.code == 'reg-success') {
        alert('Registrierung erfolgreich');
        $location.path('/');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
    $scope.register = function() {
      socket.emit('register', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.school,
        betakey: $scope.betakey
      },
      function(data) {
        switch (data.code) {
          case 'reg-email-sending':
            alert('Aktivierungsmail wird versandt');
            break;
          case 'reg-email-already-present':
            alert('Email bereits vorhanden');
            break;
          case 'reg-name-already-present':
            alert('Benutzername bereits vergeben');
            break;
          case 'reg-unknown-school':
            alert('Unbekannte Schule');
            break;
          case 'reg-too-short-pw':
            alert('Das Passwort ist zu kurz');
            break;
          case 'reg-beta-necessary':
            alert('Beta-Schlüssel ungültig oder nicht angegeben');
            break;
          case 'reg-name-invalid-char':
            alert('Der Benutzername enthält unerlaubte Zeichen');
        }
      });
    };
  }).
  controller('OptionsCtrl', function($scope, socket) {
    socket.emit('get-own-options', {}, function(data) {
      $scope.name = data.result.name;
      $scope.giv_name = data.result.giv_name;
      $scope.fam_name = data.result.fam_name;
      $scope.realnamepublish = data.result.realnamepublish;
      $scope.password = null;
      $scope.password_check = null;
      $scope.email = data.result.email;
      $scope.gender = data.result.gender;
      $scope.school = data.result.school;
      $scope.birthday = data.result.birthday;
      $scope.desc = data.result.desc;
      $scope.provision = data.result.provision;
      $scope.address = data.result.address;
    });
    $scope.changeOptions = function() {
      socket.emit('change-options', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.school,
        birthday: $scope.birthday,
        desc: $scope.desc,
        provision: $scope.provision,
        address: $scope.address
      },
      function(data) {
        switch (data.code) {
          case 'reg-email-sending':
            alert('Aktivierungsmail wird versandt');
            break;
          case 'reg-email-already-present':
            alert('Email bereits vorhanden');
            break;
          case 'reg-name-already-present':
            alert('Benutzername bereits vergeben');
            break;
          case 'reg-unknown-school':
            alert('Unbekannte Schule');
            break;
          case 'reg-too-short-pw':
            alert('Das Passwort ist zu kurz');
            break;
          case 'reg-name-invalid-char':
            alert('Der Benutzername enthält unerlaubte Zeichen');
            break;
          case 'invalid-provision':
            alert('Ungültige Provision');
        }
      }
    )};
    socket.on('change-options', function(data) {
      if (data.code == 'reg-success') {
        alert('Aktivierungsmail erfolgreich versandt');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
  }).
  controller('DepotCtrl', function($scope, socket) {
    socket.emit('list-own-depot', {}, function(data) {
      $scope.results = data.results;
    });
  }).
  controller('ProfileCtrl', function($scope, $routeParams, socket) {
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $routeParams.userId
      },
      function(data) {
        if (data.code == 'get-user-info-notfound') {
          alert('Benutzer existiert nicht');
        } else if (data.code == 'get-user-info-success') {
          $scope.user = data.result;
          $scope.orders = data.orders;
          $scope.values = data.values;
        }
      });
    };
    $scope.getUserInfo();
    var data = {
      labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'],
      datasets: [{
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        data: [65, 59, 90, 81, 56, 55]
      }]
    };
    var ctx = document.getElementById("depotPerformanceChart").getContext("2d");
    var depotPerformanceChart = new Chart(ctx).Line(data);
  }).
  controller('RankingCtrl', function($scope, socket) {
    $scope.rtype = 'general';
    $scope.startindex = 1;
    $scope.endindex = 100;
    $scope.studentonly = false;
    $scope.fromschool = null;
    $scope.results = [];
    $scope.getRanking = function() {
      socket.emit('get-ranking', {
        rtype: $scope.rtype,
        startindex: $scope.startindex,
        endindex: $scope.endindex,
        studentonly: $scope.studentonly,
        fromschool: $scope.fromschool
      },
      function(data) {
        $scope.results = data.result;
      });
    };
    $scope.getRanking();
  }).
  controller('TradeDetailsCtrl', function($scope, $routeParams, socket) {
    $scope.getTradeInfo = function() {
      socket.emit('get-trade-info', {
        tradeid: $routeParams.tradeId
      },
      function(data) {
        if (data.code == 'get-trade-info-notfound') {
          alert('Trade existiert nicht');
        } else if (data.code == 'get-trade-info-success') {
          $scope.trade = data.trade;
          $scope.comments = data.comments;
        }
      });
    };
    $scope.getTradeInfo();
  }).
  controller('TradeCtrl', function($scope, socket) {
    $scope.amount = null;
    $scope.value = null;
    $scope.stockid = null;
    $scope.leader = null;
    $scope.comment = '';
    $scope.xtype = 'market';
    $scope.xvalue = null;
    $scope.sellbuy = 1;
    $scope.buy = function() {
      socket.emit('stock-buy', {
        amount: $scope.amount * $scope.sellbuy,
        value: $scope.value,
        stockid: $scope.stockid,
        leader: $scope.leader,
        comment: $scope.comment,
        xtype: $scope.xtype,
        xvalue: $scope.xvalue
      },
      function(data) {
        switch (data.code) {
          case 'stock-buy-success':
            alert('Kauf erfolgreich');
            break;
          case 'stock-buy-out-of-money':
            alert('Nicht genügend Geld zum Kauf');
            break;
          case 'stock-buy-not-enough-stocks':
            alert('Nicht genug Wertpapiere');
            break;
          case 'stock-buy-stock-not-found':
            alert('Wertpapier existiert nicht');
            break;
          case 'stock-buy-round-result-zero':
            alert('Zu niedriger Kaufwert');
        }
      });
    };
    $scope.search = function() {
      socket.emit('stock-search', {
        name: $scope.stockid
      });
    };
  });
