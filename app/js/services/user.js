'use strict';

/**
 * @ngdoc service
 * @name tradity.user
 * @description
 * # handels login auth and gets user info
 * Factory
 */
angular.module('tradity')
	.factory('user', function ($q,socket,$state,ranking,$rootScope,config,$timeout,safestorage,dailyLoginAchievements) {

		var $user = $rootScope.$new(true);
		var ownUserRanking;
		var parse = function(res) {
			if (res.code == 'get-user-info-success')
				var user = res.result;
			else
				return false;
			if (user.parsed)
				return user;
			user.orders 		= res.orders 		|| [];
			user.pinboard 		= res.pinboard 		|| [];
			user.achievements 	= res.achievements 	|| [];
			user.profilepic = config.HOST + user.profilepic;
			user.parsed = true;
			return user;
		}

		var updateUser = function(res) {
			safestorage.check().then(function() {
				dailyLoginAchievements.check();
			});
			var user = parse(res);
			if (!user) 
				return;
			if (!user.isSelf) 
				return;
			ownUserRanking.fetch();
			angular.extend($user,user);
			console.log($user.schools)
		}
		
		socket.on('self-info',updateUser)
		socket.on('get-user-info',updateUser)

		socket.on('*', function(data) {
			if (data.code == 'not-logged-in' && !/^fetch-events/.test(data['is-reply-to'])) {
				$user = $rootScope.$new(true);
				if ($state.includes('game'))
					$state.go('index.login');
			}
		});

		socket.on('server-config', function(data) {
			var serverConfig = {};
			var cfg = data.config;
			for (var k in cfg)
				serverConfig[k] = cfg[k];

			ownUserRanking = ranking.getRanking(null, serverConfig.ranking || {}, null, null, true);
			ownUserRanking.onRankingUpdated(function() {
				$user.rank = ownUserRanking.get('all').rankForUser($user.uid);
			});
		})

		return {
			/**
			 * @ngdoc property
			 * @name tradity.user#scope
			 * @propertyOf tradity.user
			 * @return {scope} {@link tradity.$user $user}
			 * @description
			 * get the current user if loggedin
			 */
			scope:$user,
			/**
			 * @ngdoc method
			 * @name tradity.user#login
			 * @methodOf tradity.user
			 * @param  {string} username username
			 * @param  {string} password password
			 * @param  {boolean} stayloggedin stayloggedin
			 * @return {Promise} promise
			 * @description
			 * try to login the user
			 */
			login:function(username,password,stayloggedin) {
				return socket.emit('login', {
					name: username,
					pw: password,
					stayloggedin: stayloggedin
				}).then(function(data) {
					console.log(data)
					switch (data.code) {
						case 'login-success':
							$state.go('game.ranking.all');
							break;
						case 'login-badname':
							return $q.reject('Benutzer „' + username + '“ existiert nicht');
						case 'login-wrongpw':
							return $q.reject('Falsches Passwort');
						case 'login-email-not-verified':
							return $q.reject('Emailadresse noch nicht bestätigt');
					}
				})
			},
			/**
			 * @ngdoc method
			 * @name tradity.user#logout
			 * @methodOf tradity.user
			 */
			logout:function() {
				socket.emit('logout', function(data) {
					safestorage.clear();
					
					var $user = $rootScope.$new(true);
					$rootScope.$broadcast('user-update', null);
					$state.go('index.login');
				});
			},
			/**
			 * @ngdoc method
			 * @name tradity.user#me
			 * @methodOf tradity.user
			 * @return {Promise} false or user object
			 * @description
			 * get the current user if loggedin
			 */
			me:function(){
				return socket.emit('get-user-info', {
					lookfor: '$self',
					nohistory: true,
					_cache: 20
				}).then(function(data){
					if (data.code == 'get-user-info-success')
						return $user;
					else
						return $q.reject(data.code);
				});
			},
			/**
			 * @ngdoc method
			 * @name tradity.user#get
			 * @methodOf tradity.user
			 * @param  {string} username username
			 * @return {Promise} {@link tradity.$user $user}
			 * @description
			 */
			 get: function(username) {
			 	return socket.emit('get-user-info', {
					lookfor: username,
					_cache: 20
				}).then(function(res) {
					console.log(res)
					return parse(res);
				})
			 }
		};
	})
	/**
	 * @ngdoc service
	 * @name tradity.$user
	 * @description
	 * # passes the user.scope to alias
	 * ``` json
	 * {
	 * access: Array,
	 * achievements: Array,
	 * birthday: ,
	 * dayfperf: Int,
	 * dayoperf: Int,
	 * daystarttotalvalue: Int,
	 * daystartvalue: Int,
	 * delayorderhist: Int,
	 * deletiontime: Int,
	 * desc: String,
	 * dschoolid: Int,
	 * email: String,
	 * email_verif: Int,
	 * f_amount: Int,
	 * f_count: Int,
	 * fam_name: String,
	 * fperf_bought: Int,
	 * fperf_cur: Int,
	 * fperf_sold: Int,
	 * freemoney: Int,
	 * giv_name: String,
	 * hiddenuser: Int,
	 * id: Int,
	 * isSelf: Boolean,
	 * lastvalue: 9416711,
	 * lprov_sum: Int,
	 * lprovision: Int,
	 * lstockid: Int,
	 * name: String,
	 * operf_bought: Int,
	 * operf_cur: Int,
	 * operf_sold: Int,
	 * orders: Array,
	 * pinboard: Array,
	 * profilepic: String,
	 * prov_sum: Int,
	 * realnamepublish: Int,
	 * registerevent: Int,
	 * registertime: Int,
	 * schooljointime: Int,
	 * schoolpending: Int,
	 * schools: Array,
	 * skipwalkthrough: Int,
	 * street: String,
	 * ticks: Int,
	 * fperf: Int,
	 * totaloperf: Int,
	 * totalvalue: Int,
	 * town: String,
	 * tradecount: Int,
	 * traditye: Int,
	 * uid: Int,
	 * weekfperf: Int,
	 * weekoperf: Int,
	 * weekstarttotalvalue: Int,
	 * weekstartvalue: Int,
	 * wprov_sum: Int,
	 * wprovision: Int,
	 * zipcode: String
	 * }
	 * ```
	 */
	.factory('$user', function (user) {
		return user.scope;
	})