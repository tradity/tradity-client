'use strict';

var useSchoolAC = function($scope, socket) {
  $scope.onLSResult = [];
  $scope.schoolList = [];
  socket.emit('list-schools', null, function(result) {
    $scope.schoolList = result.result;
    for (var i = 0; i < $scope.schoolList.length; ++i) {
      $scope.schoolList[i].getInputTextValue = 
      $scope.schoolList[i].getEntryName = function() { return this.name; };
      $scope.schoolList[i].getExtra = function() { return this.usercount + ' Personen'; };
    }
    for (var i = 0; i < $scope.onLSResult.length; ++i)
      $scope.onLSResult[i]();
  });
  
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
            $scope.pokeEvents();
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
    $scope.ownUser = null;
    $scope.serverConfig = {};
    
    $scope.logout = function() {
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
      if (data.code == 'not-logged-in') {
        $scope.ownUser = null;
        $location.path('/login');
      }
    }, $scope);
    socket.on('self-info', function(data) {
      $scope.ownUser = data;
      $scope.$broadcast('user-update');
    }, $scope);
    socket.on('get-user-info', function(data) {
      if (data.isSelf) {
        $scope.ownUser = data;
        $scope.$broadcast('user-update');
      }
    }, $scope);
    socket.on('get-config', function(data) {
      var cfg = data.config;
      for (var k in cfg)
        $scope.serverConfig[k] = cfg[k];
    });
    
    var feedEvents = ['trade', 'watch-add', 'comment'];
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
    
    $scope.pokeEvents = function() {
      socket.emit('fetch-events', {
        since: 0,
        all: false,
        count: null
      });
    }
    
    $scope.fetchSelf = function() {
      socket.emit('get-user-info', {
        lookfor: '$self',
        nohistory: true
      });
    }
    
    $scope.pokeEvents();
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
        amount: Math.abs(data.amount)
      });
    });

    $scope.$on('comment', function(angEv, data) {
      var typePerson = 'somebody';
      var type = 'comment';
      if (data.srcuser == $scope.ownUser.uid) {
        typePerson = 'yourself';
        type += '-self';
      }
      if (data.userid == $scope.ownUser.uid) {
        type += '-me';
      }
      $scope.messages.push({
        type: type,
        typePerson: typePerson,
        srcusername: data.srcusername,
        orderid: data.orderid,
        targetname: data.targetname,
        time: data.eventtime
      });
    });
  }).
  controller('RegistrationCtrl', function($scope, $location, socket) {
    $scope.school = null;
    $scope.schoolname = document.getElementById('schoolname').value = '';
    socket.on('register', function(data) {
      switch (data.code) {
        case 'reg-success':
          alert('Registrierung erfolgreich');
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
      socket.emit('register', {
        name: $scope.name,
        giv_name: $scope.giv_name,
        fam_name: $scope.fam_name,
        realnamepublish: $scope.realnamepublish,
        password: $scope.password,
        email: $scope.email,
        gender: $scope.gender,
        school: $scope.schoolname ? ($scope.school ? $scope.school : $scope.schoolname) : null,
        betakey: $scope.betakey
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
      $scope.address = data.result.address;
      
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
        alert('Optionen erfolgreich gespeichert');
      } else if (data.code == 'reg-email-failed') {
        alert('Aktivierungsmail konnte nicht versandt werden. Bitte an tech@tradity.de wenden');
      }
    });
    useSchoolAC($scope, socket);
  }).
  controller('DepotCtrl', function($scope, socket) {
    var ownDepotOrUser = function() {
      $scope.ownUser.depotvalue = 0;
      for (var i in $scope.results) {
        $scope.ownUser.depotvalue += parseInt($scope.results[i].total);
      }
      $scope.ownUser.balance = $scope.ownUser.totalvalue - $scope.ownUser.depotvalue;
    }
    
    socket.on('list-own-depot', function(data) {
      if (data.code == 'list-own-depot-success') {
        $scope.results = data.results;
        ownDepotOrUser();
      }
      socket.emit('get-user-info', {
        lookfor: $scope.ownUser.uid
      },
      function(data) {
          $scope.orders = data.orders;
      });
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
    
    $scope.fetchSelf();
    
    socket.emit('list-own-depot');
    socket.emit('dquery-list');
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
          $scope.values = data.values;
          var orders = data.orders;
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
        }
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
        if (data.code == 'get-ranking-success') {
          $scope.results = data.result;
        }
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
        } else if (data.code == 'get-trade-info-succes') {
          $scope.trade = data.trade;
          $scope.comments = data.comments;
          for (var i = 0; i < $scope.comments.length; ++i)
            $scope.comments[i].vtime = vagueTime.get({to: $scope.comments[i].time, units: 's', lang: 'de'});
          $scope.getUserInfo();
        }
      });
    };
    $scope.getUserInfo = function() {
      socket.emit('get-user-info', {
        lookfor: $scope.trade.userid
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
            time: time.getTime() / 1000 - 1,
            vtime: vagueTime.get({to: time.getTime() / 1000 - 1, units: 's', lang: 'de'})
          });
        }
      })
    }
    $scope.getTradeInfo();
  }).
  controller('TradeCtrl', function($scope, $routeParams, socket) {
    $scope.amount = null;
    $scope.value = null;
    $scope.stockid = null;
    $scope.stockname = null;
    $scope.leader = null;
    $scope.cur = null;
    $scope.xtype = 'market';
    $scope.xvalue = null;
    $scope.comment = '';
    $scope.sellbuy = 1;
    $scope.fee = 0;
    $scope.isMarketOrder = true;

    $scope.buy = function() {
      if (!$scope.amount && !$scope.value)
        return;
	    var query = {
        amount: $scope.amount ? $scope.amount * $scope.sellbuy : null,
        stockid: $scope.stockid,
        leader: $scope.leader,
        comment: $scope.comment,
        dquerydata: { /* will be returned in the dquery-exec event */
          xtype: $scope.xtype,
          xvalue: $scope.xvalue,
          name: $scope.stockname,
          ordertime: new Date().getTime()
        }
      };
      var qtype = 'stock-buy';
      if ($scope.xtype != 'market') {
        if ($scope.xvalue == null)
          return alert('Bitte geben Sie den Stop-/Limitwert als Zahl an\n(Nachkommastellen mit . getrennt, z. B. 4213.37 für 4213,37 €)');
        var fieldname = ($scope.amount >= 0) ^ ($scope.sellbuy < 0) ? 'ask' : 'bid';
        var compar =  !(($scope.xtype == 'limit') ^ ($scope.amount >= 0) ^ ($scope.sellbuy < 0)) ? '<' : '>';
        
        var condition = '';
        var stockid = $scope.stockid;
        if (!$scope.leader)
          condition = 'stock::' + $scope.stockid + '::exchange-open > 0 ∧ ';
        else
          stockid = '__LEADER_' + $scope.leader + '__';
        condition += 'stock::' + stockid + '::' + fieldname + ' ' + compar + ' ' + ($scope.xvalue * 10000);
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
            break;
          case 'stock-buy-success':
            alert('Trade erfolgreich');
            break;
          case 'stock-buy-out-of-money':
            alert('Nicht genügend Geld zum Trade');
            break;
          case 'stock-buy-single-paper-share-exceed':
            alert('Dein Vermögen darf höchstens zu 50% in ein einzelnes Wertpapier investiert sein!');
            break;
          case 'stock-buy-not-enough-stocks':
            alert('Nicht genug Wertpapiere');
            break;
          case 'stock-buy-autodelay-sxnotopen':
            alert('Der Trade wird ausgeführt, sobald der Handelsplatz öffnet');
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
      }, valuecreate: function(ac, data, element, focusHandlers) {
        focusHandlers.push(function(ac, data, type) { if (type == 'focus') $scope.$apply(function(){gotData(ac, data);}); });
      }
    };
    $scope.ac = new AC('paper', $scope.acFetcher, false, 3, null, 'img/throbber.gif');
    $scope.calcValue = function() {
      if (!$scope.cur) return;
      if ($scope.sellbuy == 1) {
        $scope.value = $scope.amount * ($scope.cur.ask / 10000);
      } else if ($scope.sellbuy == -1) {
        $scope.value = $scope.amount * ($scope.cur.bid / 10000);
      }
      $scope.calcFee();
    };
    $scope.calcAmount = function() {
      if (!$scope.cur) return;
      if ($scope.sellbuy == 1) {
        $scope.amount = Math.floor($scope.value / ($scope.cur.ask / 10000));
      } else if ($scope.sellbuy == -1) {
        $scope.amount = Math.floor($scope.value / ($scope.cur.bid / 10000));
      }
      $scope.calcFee();
    };
    $scope.calcFee = function() {
      console.log($scope.serverConfig);
      $scope.fee = Math.max(Math.abs($scope.serverConfig['transaction-fee-perc'] * $scope.value), $scope.serverConfig['transaction-fee-min'] / 10000);
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
  controller('WatchlistCtrl', function($scope, socket) {
    $scope.showWatchlist = function() {
      socket.emit('watchlist-show', function(data) {
        if (data.code == 'watchlist-show-success') {
          $scope.watchlist = data.results;
        }
      });
    };
    $scope.removeFromWatchlist = function(userId) {
      socket.emit('watchlist-remove', {
        userid: userId
      },
      function(data) {
        if (data.code == 'watchlist-remove-success') {
          alert(userId + 'von der Watchlist entfernt');
        }
      });
    };
    $scope.showWatchlist();
  }).
  controller('FeedCtrl', function($scope, socket) {
    $scope.displaymessages = [];
    $scope.messageCount = 20;
    
    $scope.displayFeed = function() {
      for (var i = 0; i < $scope.messages.length; ++i) 
        $scope.messages[i].vtime = vagueTime.get({to: $scope.messages[i].time, units: 's', lang: 'de'});
      
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
  
