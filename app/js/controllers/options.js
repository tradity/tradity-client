angular.module('tradity').
  controller('OptionsCtrl', function($scope, socket) {
    socket.emit('get-own-options', function(data) {
      $scope.name = data.result.name;
      $scope.giv_name = data.result.giv_name;
      $scope.fam_name = data.result.fam_name;
      $scope.realnamepublish = data.result.realnamepublish;
      $scope.password = null;
      $scope.password_check = null;
      $scope.email = data.result.email;
      $scope.gender = data.result.gender;
      $scope.prevschool = data.result.school;
      $scope.school = data.result.school;
      $scope.schoolname = document.getElementById('schoolname').value = data.result.schoolname;
      $scope.desc = data.result.desc;
      $scope.lprovision = data.result.lprovision;
      $scope.wprovision = data.result.wprovision;
      $scope.street = data.result.street;
      $scope.zipcode = data.result.zipcode;
      $scope.town = data.result.town;
      $scope.traderse = data.result.traderse&&true;
      $scope.tradersp = data.result.tradersp&&true;
      $scope.traditye = data.result.traditye&&true;
      $scope.wot = data.result.wot&&true;
      $scope.delayorderhist = data.result.delayorderhist;
      
      if (data.result.birthday !== null) {
        var d = new Date(data.result.birthday);
        $scope.birthdayd = d.getUTCDate();
        $scope.birthdaym = d.getUTCMonth()+1;
        $scope.birthdayy = d.getUTCFullYear();
      }
    });
    $scope.changeOptions = function() {
      $scope.schoolname = document.getElementById('schoolname').value;
      var d = Date.UTC($scope.birthdayy, $scope.birthdaym-1, $scope.birthdayd);
      if (!$scope.birthdayy)
        d = null;
      
      var piFile = document.getElementById('profileimage').files[0];
      if (piFile) {
        fileemit(socket, piFile, 'publish', {
          base64: true,
          role: 'profile.image',
        }, $scope.serverConfig, function(code) {
          switch (code) {
            case 'publish-success':
              alert('Profilbild erfolgreich hochgeladen!');
              break;
            case 'publish-quota-exceed':
              alert('Die Profilbilddatei ist leider zu groß (höchstens 3 MB)');
              break;
            case 'publish-inacceptable-role':
            case 'publish-inacceptable-mime':
              alert('Es gab beim Hochladen Deines Profilbilds leider technische Schwierigkeiten.\nWende dich bitte an tech@tradity.de');
              break;
          }
        });
      }
      
      var school;
      if (!$scope.schoolname && $scope.school) {
        school = null;
      } else {
        var foundSNameInList = null;
        for (var i = 0; i < $scope.schoolList.length; ++i) {
          if ($scope.schoolList[i].name == $scope.schoolname) {
            foundSNameInList = $scope.schoolList[i].id;
            break;
          }
        }
        
        if (foundSNameInList)
          school = foundSNameInList;
        else
          school = $scope.schoolname;
      }
      
      socket.emit('change-options', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.schoolname ? ($scope.school ? $scope.school : $scope.schoolname) : null,
        birthday: d,
        desc: $scope.desc,
        lprovision: $scope.lprovision,
        wprovision: $scope.wprovision,
        street: $scope.street,
        zipcode: $scope.zipcode,
        town: $scope.town,
        traderse: $scope.traderse,
        tradersp: $scope.tradersp,
        traditye: $scope.traditye,
        wot: $scope.wot,
        delayorderhist: $scope.delayorderhist
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
      });
    };
    
    $scope.resetUser = function() {
      socket.emit('reset-user', null, function(data) {
        if (data.code == 'reset-user-success')
          alert('Reset erfolgreich!');
      });
    };
    
    socket.on('change-options', function(data) {
      if (data.code == 'reg-success') {
        alert('Optionen erfolgreich gespeichert');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
    useSchoolAC($scope, socket);
  });
