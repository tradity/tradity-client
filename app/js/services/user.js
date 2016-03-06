(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.user
 * @description
 * # handles login auth and fetches user info
 * Factory
 */
angular.module('tradity')
  .factory('user', function ($q, socket, $state, ranking, $rootScope, config, $timeout, safestorage, dailyLoginAchievements, gettextCatalog) {

    var $user = $rootScope.$new(true);
    
    var ownUserRanking;
    
    var parse = function(res) {
      var user;
      if (res._success)
        user = res.data;
      else
        return false;
      
      if (user.parsed)
        return user;
      user.orders     = res.orders     || [];
      user.pinboard     = res.pinboard     || [];
      user.values     = res.values     || [];
      user.achievements   = res.achievements   || [];
      user.profilepic = (config.server().protocol + '://' + config.server().hostname  +
         (user.profilepic || config.DEFAULT_PROFILE_IMG));
      user.parsed = true;
      return user;
    };

    var updateUser = function(res) {
      var user = parse(res);
      if (!user) 
        return;
      if (!user.isSelf) 
        return;
      
      safestorage.check().then(function() {
        dailyLoginAchievements.check();
      });
      
      if (!ownUserRanking) { // initialize ownUserRanking only once
        ownUserRanking = ranking.getRanking(null, config.server().ranking || {}, null, null, true);
        ownUserRanking.onRankingUpdated(function() {
          $user.rank = ownUserRanking.get('all').rankForUser($user.uid);
        });
      }
      
      ownUserRanking.fetch();
      
      angular.extend($user, user);
      $rootScope.$broadcast('user-update', $user);
    };
    
    $rootScope.$on('/user/$self', function(ev, result) {
      return updateUser(result);
    });

    $rootScope.$on('socket:answer', function(ev, answer) {
      if (answer.result.code === 'login-required' && !/\/events/.test(answer.request.url)) {
        $user.uid = null;
        
        $rootScope.$broadcast('user-update', null);
        if ($state.includes('game'))
          $state.go('index.login');
      }
    });

    var fetchSelf = function() {
      socket.get('/user/$self', {
        lookfor: '$self',
        params: { nohistory: true }
      });
    };
    fetchSelf();

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
        return socket.post('/login', {
          data: {
            name: username,
            pw: password,
            stayloggedin: stayloggedin
          }
        }).then(function(result) {
          if (result._success) {
            fetchSelf();
            $state.go('game.ranking.all');
            return;
          }
          
          return $q.reject(gettextCatalog.getString('Wrong username or password'));
        });
      },
      /**
       * @ngdoc method
       * @name tradity.user#logout
       * @methodOf tradity.user
       */
      logout:function() {
        return socket.post('/logout').then(function(result) {
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
        return socket.get('/user/$self', {
          params: { nohistory: true }
        }).then(function(result){
          if (result._success)
            return $user;
          else
            return $q.reject(result);
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
         return socket.get('/user/' + username).then(function(res) {
          return parse(res);
        });
       },
       /**
       * @ngdoc method
       * @name tradity.user#fetch
       * @methodOf tradity.user
       * @description pokes the server for the user
       */
       fetch:fetchSelf
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
  });

})();
