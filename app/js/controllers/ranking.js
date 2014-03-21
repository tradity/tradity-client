angular.module('tradity').
  controller('RankingCtrl', function($scope, $stateParams, $location, socket) { 
    $scope.school = {};
    $scope.selfIsSchoolAdmin = false;
    $scope.selfIsSchoolMember = false;
    $scope.pendingMembers = [];
    $scope.comments = [];
    $scope.schoolid = null;
    $scope.descpage = '';
    $scope.editingDescpage = false;
    $scope.uploadField = false;
    
    if ($stateParams.schoolid) {
      if (parseInt($stateParams.schoolid) == $stateParams.schoolid)
        $scope.schoolid = $stateParams.schoolid;
      else
        $scope.schoolid = '/' + $stateParams.schoolid;
      
      socket.emit('get-school-info', {
        lookfor: $scope.schoolid
      }, function(data) {
        if (data.code == 'get-school-info-success') {
          $scope.school = data.result;
          $scope.comments = $scope.school.comments;
          $scope.descpage = $scope.school.descpage;
          $scope.schoolid = $scope.school.id;
          if (!$scope.school.banner)
            $scope.school.banner = $scope.serverConfig.defaultschoolbanner;
          $scope.computeGroupRanking();
          
          $.each($scope.comments, function(i, e) {
            if (e.trustedhtml)
              e.comment = $sce.trustAsHtml(e.comment);
          });
        }
      });
      
      tabbing($('#tabs'), '/s/p|?/' + ($stateParams.schoolid || ''), $stateParams.pageid || 'general', $location, $scope);
      

      $scope.enterTeam = function () {
        socket.emit('get-own-options', function(data) {
          data.result.school = $scope.schoolid;
          socket.emit('change-options',data.result);
        });
      };

      $scope.leaveTeam = function () {
        if (confirm("Willst du wirklich die Gruppe verlassen ?")) {
          socket.emit('get-own-options', function(data) {
            data.result.school = null;
            socket.emit('change-options',data.result);
            notification("Gruppe verlassen");
          });          
        }
      };

      $scope.sendComment = $scope.createSendCommentFn($scope, function() { return $scope.school.eventid; }, 'Gruppe nicht gefunden.');
    
      $scope.deleteCommentSA = function(comment) {
        socket.emit('school-delete-comment', {
          schoolid: $scope.schoolid,
          commentid: comment.commentid
        }, function() { alert('Ok!'); });
      };
      
      $scope.kickUser = function(user) {
        if (!confirm('Wirklich User „' + user.name + '“ aus der Gruppe „' + user.schoolname + '“ löschen?'))
          return;
        
        socket.emit('school-kick-user', {
          schoolid: user.school,
          uid: user.uid
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.promoteUserToAdmin = function(user) {
        if (!confirm('Wirklich User „' + user.name + '“ zum Admin der Gruppe „' + $scope.school.name + '“ machen?'))
          return;
        
        socket.emit('school-change-member-status', {
          schoolid: $scope.schoolid,
          uid: user.uid,
          status: 'admin'
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.enterDescpageEdit = function() {
        $scope.editingDescpage = true;
      };

      $scope.enterPictureUpload = function() {
        $scope.uploadField = true;
      };
      
      $scope.changeDescription = function() {
        var bannerFile = document.getElementById('bannerupload').files[0];
        if (bannerFile) {
          fileemit(socket, bannerFile, 'school-publish-banner', {
            base64: true,
            schoolid: $scope.schoolid
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
        
        socket.emit('school-change-description', {
          schoolid: $scope.schoolid,
          descpage: $scope.descpage
        }, function() {
          alert('Ok!');
        });
      };
      
      $scope.verifyMember = function(user) {
        socket.emit('school-change-member-status', {
          schoolid: $scope.schoolid,
          uid: user.uid,
          status: 'member'
        }, function() {
          $scope.getRanking();
          alert('Ok!');
        });
      };
      
      $scope.createSchool = function() {
        var n = prompt('Gruppenname:');
        if (!n)
          return;
        n = n.trim();
        if (!n.length)
          return;
        
        socket.emit('create-school', {
          schoolname: n,
          schoolpath: $scope.school.path + '/' + n.replace(/[^\w_-]/g, '-').replace(/-+/g, '-'),
        }, function(data) {
          if (data.code == 'create-school-success')
            alert('Ok!');
          else
            alert('Fehler: ' + data.code);
        });
      };
    } else {
      tabbing($('#tabs'), '/ranking/?', $stateParams.pageid, $location, $scope);
      
      $scope.sendComment = function() {};
    }

    $scope.results = [];
    $scope.resultsWeek = [];
    $scope.resultsFollower = [];
    $scope.resultsFollowerWeek = [];
    $scope.intraGroupResults = [];
    $scope.interGroupResults = [];

    $scope.searchText = '';
    $scope.totalDisplayed = 20;

    $scope.loadMore = function() {
      $scope.totalDisplayed += 10;
    };

    $scope.$on('user-update', function() {
      $scope.computeGroupRanking();
      
      $scope.selfIsSchoolMember = false;
      for (var i = 0; i < $scope.ownUser.schools.length; ++i) {
        if ($scope.ownUser.schools[i].id == $scope.schoolid) {
          $scope.selfIsSchoolMember = true;
          break;
        }
      }
    }); 
    
    $scope.computeGroupRanking = function() {
      socket.emit('list-schools', { 
        _cache: 60,
        parentPath: $scope.school ? $scope.school.path : null
      }, function(schoollist) {
        var schools = schoollist.result || [];
        
        $scope.intraGroupResults = [];
        $scope.interGroupResults = [];
        
        $.each($scope.results, function(i, e) {
          if (e.school == null)
            return;
          
          if ((($scope.ownUser && e.school == $scope.ownUser.schoolid) || $scope.school) && !e.pending)
            $scope.intraGroupResults.push(e);
        });
        
        // linearize intergroup results
        $.each(schools, function(i, s) {
          var students = [];
          $scope.pendingMembers = [];
          
          $.each($scope.results, function(i, e) {
            if (e.schoolpath && (e.schoolpath == s.path || e.schoolpath.substr(0, s.path.length + 1) == s.path + '/') && e.hastraded && !e.pending)
              students.push(e);
              
            if ($scope.school && e.schoolpath == $scope.school.path && e.pending)
              $scope.pendingMembers.push(e);
          });
      
          students.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
          
          if (students.length == 0)
            return;
            
          var avg = {prov_sum: 0, totalvalue: 0, school: s.id, schoolname: s.name, schoolpath: s.path};
          var n = 0;
          for (var i = 0; i < students.length && i < 5; ++i) {
            ++n;
            avg.prov_sum += students[i].prov_sum;
            avg.totalvalue += students[i].totalvalue;
          }
          
          if (n > 0) {
            avg.count = students.length;
            avg.prov_sum /= n;
            avg.totalvalue /= n;
            
            $scope.interGroupResults.push(avg);
          }
        });
        
        $scope.interGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
        for (var i = 0; i < $scope.interGroupResults.length; ++i)
          $scope.interGroupResults[i].rank = i+1;
        
        /* linearize intragroup results */
        $scope.intraGroupResults.sort(function(a, b) { return b.totalvalue - a.totalvalue; });
        for (var i = 0; i < $scope.intraGroupResults.length; ++i)
          $scope.intraGroupResults[i].igrank = i+1;
          
        $scope.school.usercount = $scope.results.length - $scope.pendingMembers.length;
        
        $.each($scope.results, function(i, e) {
          if (e.uid == $scope.ownUser.uid)
            $scope.selfIsSchoolMember = true;
        });
        
        if ($scope.school.admins) {
          $.each($scope.school.admins, function(i, e) {
            if (e.adminid == $scope.ownUser.uid)
              $scope.selfIsSchoolAdmin = true;
          });
        }
      });
    };
    
    $scope.getRanking = function() {
      var page = $stateParams.pageid;

      switch (page) {
        case 'all':
        default:
          socket.emit('get-ranking', {
            rtype: 'general',
            search:$scope.searchText,
            schoolid:$scope.schoolid,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.results = data.result;
            $scope.resultsCount = data.count;
            $scope.computeGroupRanking();
          });
          break;
        case 'general':
        case 'intragroup':
        case 'intergroup':
          socket.emit('get-ranking', {
            rtype: 'general',
            schoolid: $scope.schoolid,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.results = data.result;
            $scope.resultsCount = data.count;
            $scope.computeGroupRanking();
          });
          break;
        case 'all-withprov':
          socket.emit('get-ranking', {
            rtype: 'general-wprov',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsWithProvision = data.result;
            $scope.resultsWithProvisionCount = data.count;
          });
          break;
        case 'follower':
          socket.emit('get-ranking', {
            rtype: 'following',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsFollower = data.result;
            $scope.resultsFollowerCount = data.count;
          });
          break;
        case 'all-week':
          socket.emit('get-ranking', {
            rtype: 'general-week',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsWeek = data.result;
            $scope.resultsWeekCount = data.count;
          });
          break;
        case 'follower-week':
          socket.emit('get-ranking', {
            rtype: 'following-week',
            search:$scope.searchText,
            _cache: 20
          },
          function(data) {
            if (data.code != 'get-ranking-success') 
              return false;
            $scope.resultsFollowerWeek = data.result;
            $scope.resultsFollowerWeekCount = data.count;
          });
          break;
      }
    };
    $scope.getRanking();
  });
