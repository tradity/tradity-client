(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity')
  /**
   * @ngdoc service
   * @name tradity.feed
   * @description
   * # feed
   * Factory in the tradityApp.
   */
  .factory('feed', function ($rootScope, socket, event, debounce, maybeCompress) {
    // wraps a function into one that outputs warnings rather than throws
    var warnOnFail = function(f) {
      return function() {
        try {
          return f.apply(this, arguments);
        } catch(e) {
          console.warn(e);
        }
      };
    };
    
    var localStorage_ = typeof localStorage != 'undefined' ? localStorage : {};
    var feedCacheVersion = 4;

    var $feed = $rootScope.$new(true);
    
    $feed.fetch = function() {
      maybeCompress.decompress(localStorage_.feed).then(warnOnFail(function(lsFeedData_) {
        // load events from localStorage cache and calculate latest known event time
        
        var lsFeedData = null;
        try {
          lsFeedData = JSON.parse(lsFeedData_);
        } catch (e) { console.warn(e); }
        
        var latestKnownEventTime = 0;
        
        if (!lsFeedData || lsFeedData.forUserId != $feed.forUserId ||
          !lsFeedData.feedCacheVersion || lsFeedData.feedCacheVersion < feedCacheVersion)
        {
          localStorage_.feed = 'null';
        } else {
          /* wrapped in try so that corrupt localStorage_ entries won’t break anything */
          try {
            // filter out event times, sort, and take last element
            latestKnownEventTime = lsFeedData.rawItems.map(function(event) {
              return event.eventtime;
            }).sort().slice(-1)[0] || 0;
            
            for (var i = 0; lsFeedData.rawItems && i < lsFeedData.rawItems.length; ++i)
              $feed.receiveEvent(lsFeedData.rawItems[i]);
          } catch(e) { console.error(e); }
        }
        
        socket.get('/events', {
          params: {
            since: latestKnownEventTime,
            count: null,
          }
        }).then(function(result) {
          if (!result._success) {
            return;
          }
          
          for (var i = 0; i < result.data.length; ++i) {
            $feed.receiveEvent(result.data[i]);
          }
        });
      }));
    };
    
    // call at most each 2 seconds
    $feed.saveToLocalStorage = debounce(2000, warnOnFail(function() {
      var feedData = JSON.stringify({
        rawItems: $feed.rawItems,
        forUserId: $feed.forUserId,
        feedCacheVersion: feedCacheVersion
      });
      
      maybeCompress.compress(feedData, 256 * 1024).then(warnOnFail(function(possiblyCompressedData) {
        localStorage_.feed = possiblyCompressedData;
      }));
    }));
    
    $feed.clear = function() {
      $feed.items = [];
      $feed.rawItems = [];
      $feed.knownEventIDs = {};
      $feed.forUserId = null;
    };
    
    $feed.clearFull = function() {
      $feed.clear();
      $feed.saveToLocalStorage();
    };
    
    $feed.addEvent = function(ev) {
      $feed.items.push(ev);
      $feed.saveToLocalStorage();
      
      $feed.$emit('change');
    };
    
    $feed.clear();
    
    $feed.receiveEvent = function(res) {
      if ($feed.knownEventIDs[res.eventid])
        return;
      
      var saveToRawItems = [
        'trade', 'watch-add', 'comment', 'dquery-exec', 'user-provchange', 'user-namechange',
        'user-reset', 'mod-notification', 'blogpost', 'achievement', 'file-publish'
      ];
      
      if (saveToRawItems.indexOf(res.type) == '-1')
        return;
      
      var parsedEvent = null;
      var origEvent = $.extend(true, {}, res); // deep copy, so event.* can do anything with res
      
      $feed.rawItems.push(origEvent);
      $feed.knownEventIDs[res.eventid] = true;
      $feed.$emit(res.type, $.extend(true, {}, res));
      
      if (res.type == 'mod-notification') parsedEvent = event.modNotification(res);
      if (res.type == 'watch-add') parsedEvent = event.watchAdd(res);
      if (res.type == 'trade') parsedEvent = event.trade(res);
      if (res.type == 'comment') parsedEvent = event.comment(res);
      if (res.type == 'blogpost') parsedEvent = event.blogpost(res);
      if (res.type == 'user-provchange') parsedEvent = event.userProvchange(res);
      if (res.type == 'user-namechange') parsedEvent = event.userNamechange(res);
      if (res.type == 'user-reset') parsedEvent = event.userReset(res);
      
      if (parsedEvent) {
        parsedEvent._origEvent = origEvent;
        $feed.addEvent(parsedEvent);
      }
    };
    
    $rootScope.$on('user-update', function(ev, $user) {
      if (!$user)
        return $feed.clearFull();
      
      if ($user.id != null && $user.id != $feed.forUserId) {
        $feed.forUserId = $user.id;
        $feed.fetch();
      }
    });

    return {
      /**
       * @ngdoc property
       * @name tradity.feed#scope
       * @methodOf tradity.feed
       * @description
       * feed scope access
       */
      scope:$feed
    };
  })
  /**
   * @ngdoc service
   * @name tradity.$feed
   * @description
   * alias of tradity.feed.scope
   */
  .factory('$feed', function (feed) {
    return feed.scope;
  });

})();
