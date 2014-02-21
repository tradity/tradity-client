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
        var filename = piFile.name;
        var mime = null;
        if (/\.jpe?g$/.test(filename)) mime = 'image/jpeg';
        if (/\.png$/.test(filename))   mime = 'image/png';
        if (/\.gif$/.test(filename))   mime = 'image/gif';
        
        if (!mime) {
          alert('Dein Profilbild musst du als JPEG, PNG oder GIF hochladen');
        } else {
          var reader = new FileReader();
          
          reader.onload = function() {
            var buf = reader.result;
            if (!buf)
              return alert('Konnte Profilbild nicht laden');
            if (reader.result.length > $scope.serverConfig.fsdb.userquota)
              return alert('Die Profilbilddatei ist leider zu groß (höchstens 2 MB)');
            
            var bytes = new Uint8Array(buf);
            
            var uint6ToB64 = function (nUint6) {
              return nUint6 < 26 ?
                  nUint6 + 65
                : nUint6 < 52 ?
                  nUint6 + 71
                : nUint6 < 62 ?
                  nUint6 - 4
                : nUint6 === 62 ?
                  43
                : nUint6 === 63 ?
                  47
                :
                  65;
            }

            var base64EncArr = function (aBytes) {
              var nMod3, sB64Enc = "";
              for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                nMod3 = nIdx % 3;
                nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                  sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
                  nUint24 = 0;
                }
              }
              return sB64Enc.replace(/A(?=A$|$)/g, "=");
            }
            
            var encoded = base64EncArr(bytes);
            
            socket.emit('publish', {
              base64: true,
              content: encoded,
              role: 'profile.image',
              mime: mime,
              name: filename
            }, function(data) {
              switch (data.code) {
                case 'publish-success':
                  alert('Profilbild erfolgreich hochgeladen!');
                  break;
                case 'publish-quota-exceed':
                  alert('Die Profilbilddatei ist leider zu groß (höchstens 2 MB)');
                  break;
                case 'publish-inacceptable-role':
                case 'publish-inacceptable-mime':
                  alert('Es gab beim Hochladen Deines Profilbilds leider technische Schwierigkeiten.\nWende dich bitte an tech@tradity.de');
                  break;
              }
            });
          };
          
          reader.readAsArrayBuffer(piFile);
        }        
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