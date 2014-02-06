'use strict';

var tabbing = function(div, targeturl, def, $location, $scope) {
  div.tabs();
  $(div.children('ul').get(0)).find('a').each(function(i, e) {
    if ($(e).attr('href').split('/').pop().replace(/#/g, '') == def)
      div.tabs('option', {active: i});
  });
  div.tabs({activate: function(event, ui) {
    if (!ui.newTab)
      return;
    $scope.$apply(function() { $location.path(targeturl.replace(/\?/g, ui.newTab.children('a').attr('href').replace(/#/g, ''))); });
  }});
};

var useSchoolAC = function($scope, socket) {
  $scope.onLSResult = [];
  $scope.schoolList = [];
  socket.on('list-schools', function(result) {
    $scope.schoolList = result.result;
    for (var i = 0; i < $scope.schoolList.length; ++i) {
      $scope.schoolList[i].getInputTextValue = 
      $scope.schoolList[i].getEntryName = function() { return this.name; };
      $scope.schoolList[i].getExtra = function() { return this.usercount + ' Personen'; };
    }
    for (var i = 0; i < $scope.onLSResult.length; ++i)
      $scope.onLSResult[i]();
  }, $scope);
  
  socket.emit('list-schools', {_cache: 20});
  
  $scope.acFetcher = {
    fetchAutoComplete: function(ac, s) {
      var enter = function() { ac.putData($scope.schoolList, s); };
      if ($scope.schoolList.length)
        enter();
      else
        $scope.onLSResult.push(enter);
    },
    submit: function(ac, data) {
      $scope.schoolname = document.getElementById('schoolname').value = data.name;
      $scope.school = data.id;
    },
    valuecreate: function(ac, data, element) {
      if ($scope.prevschool && $scope.prevschool == data.id)
        element.className += ' ac-prevschool';
    }
  };
  $scope.ac = new AC('schoolname', $scope.acFetcher, false, 1, 1, null, true);
};

angular.module('tradity.controllers', []).
  controller('LoginCtrl', function($scope, $routeParams, $location, socket) {
    $scope.username = '';
    $scope.password = '';
    $scope.stayloggedin = false;
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
        stayloggedin: $scope.stayloggedin
      },
      function(data) {        
        switch (data.code) {
          case 'login-success':
            $scope.fetchSelf();
            $scope.pokeEvents();
            $location.path('/');
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
    socket.on('password-reset', function(data) {
      if (data.code == 'password-reset-success') {
        alert('Neues Passwort erfolgreich versandt');
      } else if (data.code == 'password-reset-failed') {
        alert('Das neue Passwort konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      } else if (data.code == 'password-reset-notfound') {
        alert('Benutzer existiert nicht');
      } else if (data.code == 'password-reset-sending') {
        alert('Neues Passwort wird versandt');
      }
    });
    $scope.passwordReset = function() {
      socket.emit('password-reset', {
        name: $scope.username
      });
    };
    socket.emit('ping', function(data) {
      if (data.uid)
        $location.path('/');
    });
  }).
  controller('MainCtrl', function($scope, $location, socket) {
    $scope.Math = Math;
    $scope.vtime = function(t) { return vagueTime.get({to: t, units: 's', lang: 'de'}); };
    
    $scope.ownUser = null;
    $scope.serverConfig = {};

    $scope.isActive = function(route) {
        return route === $location.path(); 
    };
    
    $scope.logout = function() {
      $scope.eventIDs = {};
      $scope.messages = [];
      socket.emit('logout', function(data) {
        if (data.code == 'logout-success') {
          $scope.ownUser = null;
          $scope.$broadcast('user-update');
          $location.path('/login');
        }
      });
    };
    socket.on('response', function(data) {
      if (data.code == 'not-logged-in' && !/^fetch-events/.test(data['is-reply-to'])) {
        $scope.ownUser = null;
        $location.path('/login');
      }
    }, $scope);
    socket.on('self-info', function(data) {
      $scope.ownUser = data;
      $scope.$broadcast('user-update', data);
    }, $scope);
    socket.on('get-user-info', function(data) {
      var r = data.result;
      if (r && r.isSelf) {
        $scope.ownUser = r;
        $scope.$broadcast('user-update', r);
      }
    }, $scope);
    socket.on('get-config', function(data) {
      var cfg = data.config;
      for (var k in cfg)
        $scope.serverConfig[k] = cfg[k];
    });
    
    var feedEvents = ['trade', 'watch-add', 'comment', 'dquery-exec', 'user-provchange', 'user-namechange', 'user-reset'];
    $scope.messages = [];
    $scope.eventIDs = {};
    
    for (var i = 0; i < feedEvents.length; ++i) {
      socket.on(feedEvents[i], function(ev) {
        var id = ev.eventid;
        if ($scope.eventIDs[id])
          return;
        $scope.eventIDs[id] = true;
        $scope.$broadcast(ev.type, ev);
        $scope.messages.sort(function(a, b) { return b.time - a.time; });
        $scope.$broadcast('messages-changed');
      }, $scope);
    }
    
    $scope.pokeEvents = function(cb) {
      socket.emit('fetch-events', {
        since: 0,
        count: null
      }, cb);
    }
    
    $scope.fetchSelf = function(cb) {
      socket.emit('get-user-info', {
        lookfor: '$self',
        nohistory: true,
        _cache: 20
      }, cb);
    }
    
    $scope.fetchSelf(function() {
      $scope.pokeEvents();
    });
    socket.emit('get-config');
    
    /* events */
    $scope.$on('watch-add', function(angEv, data) {
      var typePerson = 'somebody';
      var type = 'watch-add';
      if (data.srcuser == $scope.ownUser.uid) {
        var typePerson = 'yourself';
        type += '-self';
      } else if (data.watcheduser == $scope.ownUser.uid) {
        type += '-me';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        targetid: data.watcheduser,
        targetname: data.watchedname,
        time: data.eventtime
      });
    });
    
    $scope.$on('trade', function(angEv, data) {
      var typePerson = 'somebody';
      if (data.amount < 0) {
        var type = 'trade-sell';
      } else {
        var type = 'trade-buy';
      }
      if (data.srcuser == $scope.ownUser.uid) {
        type += '-self';
        typePerson = 'yourself';
      } else if (data.stocktextid == '__LEADER_' + $scope.ownUser.uid + '__') {
        type += '-me';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        targetid: data.targetid,
        stocktextid: data.stocktextid,
        stockname: data.stockname,
        time: data.eventtime,
        leader: data.leader,
        amount: Math.abs(data.amount)
      });
    });

    $scope.$on('comment', function(angEv, data) {
      var typePerson = 'somebody';
      var type = 'comment';
      if (data.baseeventtype == 'trade') {
        type += '-trade';
      } else if (data.baseeventtype == 'user-register') {
        type += '-pinboard';
      }
      if (data.srcuser == $scope.ownUser.uid) {
        typePerson = 'yourself';
        type += '-self';
      }
      if (data.traderid == $scope.ownUser.uid) {
        type += '-me';
      }
      var tn = data.tradername;
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        orderid: data.orderid,
        tradername: tn,
        tradername_genitive: 'xsXS'.indexOf(tn.charAt(tn.length-1)) == -1 ? tn + 's' : tn + '’',
        time: data.eventtime
      });
    });
    /*
    $scope.$on('dquery-exec', function(angEv, data) {
      if (data.result == 'stock-buy-success') {
        $scope.messages.push({
          type: 'dquery-exec',
          orderid: data.orderid,
          stockname: data.name,
          amount: data.amount,
          time: data.eventtime
        });
      }
    });*/
    $scope.$on('user-provchange', function(angEv, data) {
      var type = 'provchange';
      if (data.srcuser == $scope.ownUser.uid) {
        var typePerson = 'yourself';
        type += '-self';
      } else {
        var typePerson = 'somebody';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        oldprov: data.oldprov,
        newprov: data.newprov,
        time: data.eventtime
      });
    });
    $scope.$on('user-namechange', function(angEv, data) {
      var type = 'namechange';
      if (data.srcuser == $scope.ownUser.uid) {
        var typePerson = 'yourself';
        type += '-self';
      } else {
        var typePerson = 'somebody';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        oldname: data.oldname,
        newname: data.newname,
        time: data.eventtime
      });
    });
    $scope.$on('user-reset', function(angEv, data) {
      var type = 'reset';
      if (data.srcuser == $scope.ownUser.uid) {
        var typePerson = 'yourself';
        type += '-self';
      } else {
        var typePerson = 'somebody';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        time: data.eventtime
      });
    });
  }).
  controller('RegistrationCtrl', function($scope, $location, socket) {
    $scope.school = null;
    $scope.schoolname = document.getElementById('schoolname').value = '';
    $scope.traderse = 0;
    $scope.tradersp = 0;
    $scope.traditye = 0;
    $scope.wot = 0;
    $scope.zipcode = '';
    $scope.town = '';
    $scope.street = '';
    socket.on('register', function(data) {
      switch (data.code) {
        case 'reg-success':
          var extra = '';
          if (/@freenet\.\w+$/.test($scope.email))
            extra = '\nBei Deinem E-Mail-Provider ist es schon häufiger zu Problemen mit der Anmeldung gekommen.\nSchicke bitte ggf. selbst eine E-Mail an tech@tradity.de';
          alert('Registrierung erfolgreich' + extra);
          $location.path('/');
          break;
        case 'reg-email-failed':
          alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
          break;
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
          break;
      }
    });
    $scope.register = function() {
      if (!$scope.agbread)
        return alert('Bitte bestätige, dass du die AGB gelesen hast.');
      socket.emit('register', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.schoolname ? ($scope.school ? $scope.school : $scope.schoolname) : null,
        betakey: $scope.betakey,
        street: $scope.street,
        zipcode: $scope.zipcode,
        town: $scope.town,
        traderse: $scope.traderse,
        tradersp: $scope.tradersp,
        traditye: $scope.traditye,
        wot: $scope.wot
      });
    };
    useSchoolAC($scope, socket); 
  }).
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
      $scope.provision = data.result.provision;
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
        provision: $scope.provision,
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
  }).
  controller('DepotCtrl', function($scope, $routeParams, $location, socket) {    
    tabbing($('#tabs'), '/depot/?', $routeParams.pageid, $location, $scope);
    
    var ownDepotOrUser = function() {
      if (!$scope.ownUser)
        return;
      $scope.ownUser.depotvalue = 0;
      for (var i in $scope.results) {
        $scope.ownUser.depotvalue += parseInt($scope.results[i].total);
      }
    }
    
    socket.on('list-own-depot', function(data) {
      if (data.code == 'list-own-depot-success') {
        $scope.results = data.results;
        ownDepotOrUser();
      }
    }, $scope);
  
    socket.on('get-user-info', function(data) {
      if (!data.result.isSelf)
        return;
      
      var orders = data.orders;
      if (!orders)
        return;
      
      orders.sort(function(a,b) { return b.buytime - a.buytime; });
      for (var i in orders) {
        if (orders[i].money > 0) {
          orders[i].ordertype = 'depot-buy';
        } else if (orders[i].money < 0) {
          orders[i].ordertype = 'depot-sell';
        } else {
          orders[i].ordertype = '';
        }
        orders[i].price = Math.abs(orders[i].money / orders[i].amount);
      }
      $scope.orders = orders;
    }, $scope);
    
    socket.on('dquery-list', function(data) {
      $scope.delayedOrders = [];
      for (var i = 0; i < data.results.length; ++i) {
        var q = data.results[i];
        if (q.query.type == 'stock-buy') {
          q.buysell = q.query.amount < 0 ? 'sell' : 'buy';
          q.amount = Math.abs(q.query.amount);
          $scope.delayedOrders.push(q);
        }
      }
    }, $scope);
    
    $scope.$on('user-update', ownDepotOrUser);
    
    socket.emit('get-user-info', { lookfor: '$self', _cache: 20 });
    socket.emit('list-own-depot', { _cache: 20 });
    socket.emit('dquery-list', { _cache: 20 });
    
    $scope.removeDelayedOrder = function(id) {
      socket.emit('dquery-remove', {
        queryid: id
      },
      function(data) {
        if (data.code == 'dquery-remove-success') {
          socket.emit('dquery-list');
        } else if (data.code == 'dquery-remove-notfound') {
          alert('Order nicht gefunden. Möglicherweise wurde sie bereits ausgeführt.');
        }
      });
    };
    socket.on('watchlist-show', function(data) {
      if (data.code == 'watchlist-show-success') {
        $scope.watchlist = data.results;
      }
    }, $scope);
    
    $scope.showWatchlist = function(nocache) {
      socket.emit('watchlist-show', nocache ? null : { _cache: 20 });
    };
    $scope.removeFromWatchlist = function(entry) {
      socket.emit('watchlist-remove', {
        stockid: entry.id
      },
      function(data) {
        if (data.code == 'watchlist-remove-success') {
          alert(entry.stockname + ' von der Watchlist entfernt');
          $scope.showWatchlist(true);
        }
      });
    };
    $scope.showWatchlist();
  }).
  controller('ProfileCtrl', function($scope, $routeParams, $location, socket) {
    tabbing($('#tabs'), '/user/' + $routeParams.userId + '/?', $routeParams.pageid, $location, $scope);
    
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $routeParams.userId,
        _cache: 20
      },
      function(data) {
        if (data.code == 'get-user-info-notfound') {
          alert('Benutzer existiert nicht');
        } else if (data.code == 'get-user-info-success') {
          $scope.user = data.result;
          $scope.values = data.values;
          var orders = data.orders;
          orders.sort(function(a,b) { return b.buytime - a.buytime; });
          for (var i in orders) {
            if (orders[i].money > 0) {
              orders[i].ordertype = 'depot-buy';
            } else if (orders[i].money < 0) {
              orders[i].ordertype = 'depot-sell';
            } else {
              orders[i].ordertype = '';
            }
            orders[i].price = Math.abs(orders[i].money / orders[i].amount);
          }
          $scope.orders = orders;
          if (!$scope.user.profilepic)
            $scope.user.profilepic = $scope.serverConfig.defaultprofile;
          data.pinboard.sort(function(a,b) { return b.time - a.time; });
          $scope.comments = data.pinboard;
          
          $scope.draw();
        }
      });
    };
    $scope.drawMode = 4;  
    $scope.drawModes = [
      {name: '24 h', days: 1,  marker: true},
      {name: '48 h', days: 2,  marker: true},
      {name: '7 d',  days: 7,  marker: false},
      {name: '14 d', days: 14, marker: false},
      {name: 'seit Beginn', days: 1/0, marker: false}
    ];
    $scope.curPlot = null;
    $scope.draw = function(newMode) {    
      if (newMode != null)
        $scope.drawMode = newMode;
      
      var mode = $scope.drawModes[$scope.drawMode];
      console.log(mode, $scope.drawMode);
      var now = new Date().getTime();
      var tmin = now, tmax = 0,vmin = 1/0,vmax=0;
      var data = $.map($.grep($scope.values, function(e) {
        return now/1000 - e.time < 86400 * mode.days;
      }), function(e) {
        if (e.time*1000 < tmin) tmin = e.time*1000;
        if (e.time*1000 > tmax) tmax = e.time*1000;
        if (e.value/10000 < vmin) vmin = e.value/10000;
        if (e.value/10000 > vmax) vmax = e.value/10000;
        return [[e.time*1000, e.value/10000]];
      });
      if ($scope.curPlot) $scope.curPlot.destroy();
      $scope.curPlot = $.jqplot('chart', [data], {
        title: 'Performance ' + mode.name,
        axes: {
          xaxis: {
            renderer: $.jqplot.DateAxisRenderer,
            min: tmin,
            max: tmax,
            tickRenderer: $.jqplot.CanvasAxisTickRenderer,
            tickOptions: {
              angle: -30,
              formatString: '%d.%m, %R',
            }
          },
          yaxis: {
            min: vmin * 0.85,
            max: vmax / 0.85,
            tickOptions: {
              formatString: '%.2f €'
            }
          }
        },
        highlighter: {
          show: true,
          sizeAdjust: 2
        },
        cursor: {
          show: true,
          zoom: true
        },
        shadow: false,
        shadowAlpha: 1,
        series: [
          {
            showMarker: mode.marker,
            markerOptions: { style: 'circle', size: 2 }
          }
        ]
      });
    };
    $scope.addToWatchlist = function() {
      socket.emit('watchlist-add', {
        stockid: $scope.user.lstockid
      },
      function(data) {
        if (data.code == 'watchlist-add-success') {
          alert($scope.user.name + ' zur Watchlist hinzugefügt');
        } else if (data.code == 'watchlist-add-notfound') {
          alert('Benutzer nicht gefunden. Hier läuft etwas falsch.');
        }
      });
    };
    $scope.sendComment = function() {
      socket.emit('comment', {
        eventid: $scope.user.registerevent,
        comment: $scope.comment
      },
      function(data) {
        if (data.code == 'comment-notfound') {
          alert('Benutzer nicht gefunden. Hier läuft etwas falsch.');
        } else if (data.code == 'comment-success') {
          var time = new Date();
          $scope.comments.unshift({
            comment: $scope.comment,
            username: $scope.ownUser.name,
            time: time.getTime() / 1000 - 1
          });
          $scope.comment = '';
        }
      });
    };
    $scope.getUserInfo();
    /*
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
    */
  }).
  controller('RankingCtrl', function($scope, $routeParams, $location, socket) {    
    tabbing($('#tabs'), '/ranking/?', $routeParams.pageid, $location, $scope);

    $scope.resultsPerPage = 5;
    $scope.page = 0;

    $scope.results = [];
    $scope.resultsCount = 0;

    $scope.resultsWithProvision = [];
    $scope.resultsWithProvisionCount = 0;

    $scope.resultsWeek = [];
    $scope.resultsWeekCount = 0;

    $scope.resultsFollower = [];
    $scope.resultsFollowerCount = 0;

    $scope.resultsFollowerWeek = [];
    $scope.resultsFollowerCount = 0;

    $scope.intraGroupResults = [];
    $scope.intraGroupResultsCount = 0;

    $scope.interGroupResults = [];
    $scope.interGroupResultsCount = 0;

    $scope.getPages = function(n) {
      if (n == 0) 
        return [];
      n = Math.ceil(n/$scope.resultsPerPage);
      var pages = [];
      for (var i=0;i < n;i++) pages[i] = i;
      return  pages;
    };

    $scope.setPage = function (page) {
      $scope.page = page;
      $scope.getRanking();
    }

    $scope.activePage = function(item) {
      return item === $scope.page ? 'active' : undefined;
    };

    
    $scope.$on('user-update', function() { $scope.computeGroupRanking(); });
    
    $scope.computeGroupRanking = function() {
      $scope.intraGroupResults = [];
      $scope.interGroupResults = [];
      var schools = [];
      
      $.each($scope.results, function(i, e) {
        if (e.school == null)
          return;
        
        if (schools.indexOf(e.school) == -1 && e.hastraded)
          schools.push(e.school);
        
        if ($scope.ownUser && e.school == $scope.ownUser.schoolid) 
          $scope.intraGroupResults.push(e);
      });
      
      // linearize intergroup results
      $.each(schools, function(i, s) {
        var students = [];
        $.each($scope.results, function(i, e) {
          if (e.school == s && e.hastraded)
            students.push(e);
        });
    
        students.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
        
        if (students.length == 0)
          throw new Error('School ' + s + ' has no students');
          
        var avg = {prov_recvd: 0, totalvalue: 0, school: s, schoolname: students[0].schoolname};
        var n = 0;
        for (var i = 0; i < students.length && i < 3; ++i) {
          ++n;
          avg.prov_recvd += students[i].prov_recvd;
          avg.totalvalue += students[i].totalvalue;
        }
        
        avg.count = students.length;
        avg.prov_recvd /= n;
        avg.totalvalue /= n;
        
        $scope.interGroupResults.push(avg);
      });
      
      $scope.interGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
      for (var i = 0; i < $scope.interGroupResults.length; ++i)
        $scope.interGroupResults[i].rank = i+1;
      
      /* linearize intragroup results */
      $scope.intraGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
      for (var i = 0; i < $scope.intraGroupResults.length; ++i)
        $scope.intraGroupResults[i].igrank = i+1;
    };
    
    $scope.getRanking = function() {
      var page = $routeParams.pageid;

      if ($routeParams.pageid == 'all' || !page) socket.emit('get-ranking', {
        rtype: 'general',
        startindex:$scope.page*$scope.resultsPerPage,
        endindex:$scope.page*$scope.resultsPerPage+$scope.resultsPerPage,
        search:$scope.searchText,
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.results = data.result;
        $scope.resultsCount = data.count;
      });

      if (page == "intergroup") socket.emit('get-ranking', {
        rtype: 'general',
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.results = data.result;
        $scope.computeGroupRanking();
        $scope.resultsCount = data.count;
      });

      if (page == 'all-withprov') socket.emit('get-ranking', {
        rtype: 'general-wprov',
        startindex:$scope.page*$scope.resultsPerPage,
        endindex:$scope.page*$scope.resultsPerPage+$scope.resultsPerPage,
        search:$scope.searchText,
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.resultsWithProvision = data.result;
        $scope.resultsWithProvisionCount = data.count;

      });

      if (page == 'follower') socket.emit('get-ranking', {
        rtype: 'following',
        startindex:$scope.page*$scope.resultsPerPage,
        endindex:$scope.page*$scope.resultsPerPage+$scope.resultsPerPage,
        search:$scope.searchText,
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.resultsFollower = data.result;
        $scope.resultsFollowerCount = data.count;
      });

      if (page == 'all-week')  socket.emit('get-ranking', {
        rtype: 'general-week',
        startindex:$scope.page*$scope.resultsPerPage,
        endindex:$scope.page*$scope.resultsPerPage+$scope.resultsPerPage,
        search:$scope.searchText,
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.resultsWeek = data.result;
        $scope.resultsWeekCount = data.count;
      });

      if (page == 'follower-week')  socket.emit('get-ranking', {
        rtype: 'following-week',
        startindex:$scope.page*$scope.resultsPerPage,
        endindex:$scope.page*$scope.resultsPerPage+$scope.resultsPerPage,
        search:$scope.searchText,
        _cache: 20
      },
      function(data) {
        if (data.code != 'get-ranking-success') 
          return false;
        $scope.resultsFollowerWeek = data.result;
        $scope.resultsFollowerWeekCount = data.count;
      });

    };
    $scope.getRanking();
  }).
  controller('TradeDetailsCtrl', function($scope, $routeParams, socket) {
    $scope.getTradeInfo = function() {
      socket.emit('get-trade-info', {
        tradeid: $routeParams.tradeId,
        _cache: 20
      },
      function(data) {
        if (data.code == 'get-trade-info-notfound') {
          alert('Trade existiert nicht');
        } else if (data.code == 'get-trade-info-succes') {
          $scope.trade = data.trade;
          $scope.trade.price = Math.abs($scope.trade.money / $scope.trade.amount);
          data.comments.sort(function(a,b) { return b.time - a.time; });
          $scope.comments = data.comments;
          $scope.getUserInfo();
        }
      });
    };
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $scope.trade.userid,
        nohistory: true,
        _cache: 20
      },
      function(data) {
        $scope.user = data.result;
        if (!$scope.user.profilepic)
            $scope.user.profilepic = $scope.serverConfig.defaultprofile;
      });
    };
    $scope.sendComment = function() {
      socket.emit('comment', {
        eventid: $scope.trade.eventid,
        comment: $scope.comment
      },
      function(data) {
        if (data.code == 'comment-notfound') {
          alert('Trade nicht gefunden. Hier läuft etwas falsch.');
        } else if (data.code == 'comment-success') {
          var time = new Date();
          $scope.comments.push({
            comment: $scope.comment,
            username: $scope.ownUser.name,
            time: time.getTime() / 1000 - 1
          });
          $scope.comment = '';
        }
      });
    };
    $scope.getTradeInfo();
  }).
  controller('TradeCtrl', function($scope, $routeParams, $location, socket) {
    $scope.amount = null;
    $scope.value = null;
    $scope.stockid = null;
    $scope.stockname = null;
    $scope.leader = null;
    $scope.cur = null;
    $scope.xtype = 'market';
    $scope.xvalue = '';
    $scope.comment = '';
    $scope.sellbuy = 1;
    $scope.fee = 0;
    $scope.isMarketOrder = true;

    $scope.buy = function() {
      if (!$scope.amount && !$scope.value)
        return;
      if (!$scope.leader && !$scope.stockid)
        return alert('Du musst ein Wertpapier auswählen!');
	    var query = {
        amount: $scope.amount * $scope.sellbuy,
        stockid: $scope.stockid,
        leader: $scope.leader,
        comment: $scope.comment,
        retainUntilCode: 'stock-buy-success',
        dquerydata: { /* will be returned in the dquery-exec event */
          xtype: $scope.xtype,
          xvalue: parseFloat($scope.xvalue.replace(',', '.')),
          name: $scope.stockname,
          amount: $scope.amount * $scope.sellbuy,
          delayedquery: true,
          ordertime: new Date().getTime()
        }
      };
      var qtype = 'stock-buy';
      if ($scope.xtype != 'market') {
        if ($scope.xvalue == null)
          return alert('Bitte geben Sie den Stop-/Limitwert als Zahl an');
        var fieldname = ($scope.amount >= 0) ^ ($scope.sellbuy < 0) ? 'ask' : 'bid';
        var compar =  !(($scope.xtype == 'limit') ^ ($scope.amount >= 0) ^ ($scope.sellbuy < 0)) ? '<' : '>';
        
        var condition = '';
        var stockid = $scope.stockid;
        if (!$scope.leader)
          condition = 'stock::' + $scope.stockid + '::exchange-open > 0 ∧ ';
        else
          stockid = '__LEADER_' + $scope.leader + '__';
        condition += 'stock::' + stockid + '::' + fieldname + ' ' + compar + ' ' + (parseFloat($scope.xvalue.replace(',', '.')) * 10000);
        query.type = qtype;
        query = {
          condition: condition,
          query: query
        };
        qtype = 'dquery';
      }
      socket.emit(qtype, query,
      function(data) {
        switch (data.code) {
          case 'dquery-success':
            alert('Der Trade wird ausgeführt, sobald die angegebenen Bedingungen erfüllt sind.');
            $location.path('/depot/opentransactions');
            break;
          case 'stock-buy-success':
            alert('Trade erfolgreich');
            $location.path('/depot');
            break;
          case 'stock-buy-out-of-money':
            alert('Nicht genügend Geld zum Trade');
            break;
          case 'stock-buy-single-paper-share-exceed':
            alert('Dein Vermögen darf höchstens zu 50 % in ein einzelnes Wertpapier investiert sein!');
            break;
          case 'stock-buy-not-enough-stocks':
            alert('Nicht genug Wertpapiere');
            break;
          case 'stock-buy-autodelay-sxnotopen':
            alert('Der Trade wird ausgeführt, sobald der Handelsplatz öffnet');
            $location.path('/depot/opentransactions');
            break;
          case 'stock-buy-over-pieces-limit':
            alert('Leider übersteigt dein Trade die handelbare Menge für dieses Wertpapier!');
            break;
          case 'stock-buy-stock-not-found':
            alert('Wertpapier existiert nicht');
            break;
        }
      });
    };
    var gotData;
    $scope.acFetcher = {
      fetchAutoComplete: function(ac, s) {
        socket.emit('stock-search', {
          name: s
        }, function(data) {
          if (data.code == 'stock-search-success') {
            var suggestions = [];
            for (var i in data.results) {
              if (data.results[i].leader == $scope.ownUser.uid)
                continue;
              data.results[i].getEntryName = 
              data.results[i].getInputTextValue = function() { return this.leader ? 'Leader: ' + this.leadername : this.name; };
              data.results[i].getExtra = function() { return (parseInt(this.lastvalue / 100) / 100) + (this.exchange ? ' ' + this.exchange : ''); };
              suggestions.push(data.results[i]);
            }
            ac.putData(suggestions, s);
          }
        });
      },
      submit: gotData = function(ac, data) {
        document.getElementById('paper').value =
        $scope.stockname = data.leader ? 'Leader: ' + data.leadername : data.name;
        $scope.stockid = data.leader ? null : data.stockid;
        $scope.leader = data.leader ? data.leader : null;
        $scope.cur = data;
        $scope.value = $scope.amount = null;
      }, valuecreate: function(ac, data, element, focusHandlers) {
        focusHandlers.push(function(ac, data, type) { if (type == 'focus') $scope.$apply(function(){gotData(ac, data);}); });
      }
    };
    $scope.ac = new AC('paper', $scope.acFetcher, false, 3, null, 'img/throbber.gif');
    $scope.calcValue = function() {
      if (!$scope.cur) return;
      if ($scope.sellbuy == 1) {
        $scope.value = String($scope.amount * ($scope.cur.ask / 10000)).replace('.', ',');
      } else if ($scope.sellbuy == -1) {
        $scope.value = String($scope.amount * ($scope.cur.bid / 10000)).replace('.', ',');
      }
      $scope.calcFee();
    };
    $scope.calcAmount = function() {
      if (!$scope.cur) return;
      if ($scope.sellbuy == 1) {
        $scope.amount = Math.floor(parseFloat($scope.value.replace(',', '.')) / ($scope.cur.ask / 10000));
      } else if ($scope.sellbuy == -1) {
        $scope.amount = Math.floor(parseFloat($scope.value.replace(',', '.')) / ($scope.cur.bid / 10000));
      }
      $scope.calcFee();
    };
    $scope.calcFee = function() {
      $scope.fee = Math.max(Math.abs($scope.serverConfig['transaction-fee-perc'] * parseFloat($scope.value.replace(',', '.'))), $scope.serverConfig['transaction-fee-min'] / 10000);
    };

    if ($routeParams.sellbuy) {
      if ($routeParams.sellbuy == 'sell') {
        $scope.sellbuy = -1;
      } else if ($routeParams.sellbuy == 'buy') {
        $scope.sellbuy = 1;
      }
      $scope.stockid = $routeParams.stockId;
      socket.emit('stock-search', {
        name: $scope.stockid
      }, function(data) {
        if (data.code == 'stock-search-success') {
          for (var i = 0; i < data.results.length; ++i) {
            if (data.results[i].stockid == $scope.stockid) {
	          gotData($scope.ac, data.results[i]);
	          break;
            }
          }
          $scope.amount = parseInt($routeParams.amount);
          $scope.calcValue();
        }
      });
    }
  }).
  controller('FeedCtrl', function($scope, socket) {
    $scope.displaymessages = [];
    $scope.messageCount = 20;
    
    $scope.displayFeed = function() {
      $scope.displaymessages = $scope.messages.slice(0, parseInt($scope.messageCount));
    };

    $scope.lastScrollCheck = 0;
    $(window).scroll(function(e) {
      var now = new Date().getTime();
      if (now - $scope.lastScrollCheck < 250)
        return;
      $scope.lastScrollCheck = now;
      
      var d = document.documentElement;
      if ((d.scrollTop + d.clientHeight)/(d.scrollHeight) > 0.7 && $scope.messageCount < $scope.messages.length) {
        $scope.messageCount /= 0.8;
        $scope.$apply($scope.displayFeed);
      }
    });
    
    $scope.$on('messages-changed', function() {
      $scope.displayFeed();
    });
    $scope.displayFeed();
  });
  
