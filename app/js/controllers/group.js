angular.module('tradity').
	controller('GroupCtrl', function($scope, $sce, $state, $stateParams, DEFAULT_GROUP_BANNER, socket) {
		$scope.school = {};
		$scope.selfIsSchoolAdmin = false;
		$scope.selfIsSchoolMember = false;
		$scope.pendingMembers = [];
		$scope.comments = [];
		$scope.schoolid = null;
		$scope.descpage = '';
		$scope.editingDescpage = false;
		$scope.uploadField = false;

		// in case a group gets called without /pinboard
		if ($state.includes('*.group'))
			$state.go('.pinboard');

		$scope.schoolid = $stateParams.schoolid;

		socket.emit('get-school-info', {
			lookfor: $scope.schoolid,
			_cache: 30
		}, function(data) {
			if (data.code == 'not-logged-in') {
				socket.emit('school-exists', {
					lookfor: $scope.schoolid,
					_cache: 30
				}, function(data) {
					if (data.code == 'school-exists-success' && data.exists) {
						$state.go('index.schoolregister', {schoolid: data.path});
					}
				});
			} else if (data.code == 'get-school-info-success') {
				$scope.school = data.result;
				$scope.comments = $.extend(true, [], $scope.school.comments); // deep copy
				$scope.descpage = $scope.school.descpage;
				$scope.schoolid = $scope.school.id;
				if (!$scope.school.banner)
					$scope.school.banner = DEFAULT_GROUP_BANNER;
				
				if ($scope.ownUser) {
					$.each($scope.ownUser.schools, function(i, e) {
						if (e.path == $scope.school.path) 
							$scope.selfIsSchoolMember = true;
					});
				}

				var checkAdmin = function() {
					$.each($scope.school.admins, function(i, e) {
						if ($scope.ownUser && e.adminid == $scope.ownUser.uid && e.status == 'admin') 
							$scope.selfIsSchoolAdmin = true;
					});
				}
				
				checkAdmin();
				$scope.$on('user-update', checkAdmin);

				$.each($scope.comments, function(i, e) {
					e.comment = $sce.trustAsHtml(e.trustedhtml ? e.comment : escapeHTML(e.comment));
				});
				
				$scope.$broadcast('school-info-update', $scope.school);
			}
		});

		$scope.enterTeam = function () {
			socket.emit('get-own-options', function(data) {
				data.result.school = $scope.schoolid;
				socket.emit('change-options', data.result);
				$scope.selfIsSchoolMember = true;
			});
		};

		$scope.leaveTeam = function () {
			if (confirm("Willst du wirklich die Gruppe verlassen ?")) {
				socket.emit('get-own-options', function(data) {
					data.result.school = null;
					socket.emit('change-options', data.result, function(data) {
						if (/success$/.test(data.code)) 
							$state.go('game.groupOverview');
					});
					notification("Gruppe verlassen");
					$scope.selfIsSchoolMember = false;
					$scope.selfIsSchoolAdmin = false;
				});
			}
		};

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

		$scope.totalDisplayed = 20;

		$scope.loadMore = function() {
			$scope.totalDisplayed += 10;
		};
		
		socket.emit('get-ranking', {
			since: 0,
			schoolid: $scope.schoolid,
			_cache: 20,
		}, function(data) {
			$scope.pendingMembers = [];
			
			$.each(data.result, function(i, e) {
				if ($scope.school && e.schoolpath == $scope.school.path && e.pending)
					$scope.pendingMembers.push(e);
			});
		});
	});
