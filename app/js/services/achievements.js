(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.achievements
 * @description
 * # achievements
 * Factory
 */
angular.module('tradity')
  .factory('achievements', function ($q, gettextCatalog, socket) {
    var achievements = {
      _list: null,
      _texts: [
        { pattern: /TRADE_COUNT_(\d+)/, text: gettextCatalog.getString('Perform %1\u00a0trades') },
        { pattern: 'TRADE_VOLUME_25K', text: gettextCatalog.getString('Execute a trade with a volume of more than 25,000\u00a0€.') }, 
        { pattern: 'TRADE_STOCKNAME_AZ', text: gettextCatalog.getString('Trade a stock whose name begine with “A” and another one whose begins with “Z”') },
        { pattern: 'TRADE_RESELL_1H', text: gettextCatalog.getString('Buy and sell shares of a stock within 1\u00a0hour') },
        { pattern: 'TRADE_RESELL_10D', text: gettextCatalog.getString('Buy and sell shares 10\u00a0days apart.') },
        { pattern: 'TRADE_SPLIT_BUY', text: gettextCatalog.getString('Buy shares of a stock which already is in your depot.') },
        { pattern: 'TRADE_SPLIT_SELL', text: gettextCatalog.getString('Sell only a part of the shares of a stock in your depot.') },
        { pattern: 'TRADE_FOLLOWER_COUNT_1', text: gettextCatalog.getString('Perform 1\u00a0follower trade (invest into another user).') },
        { pattern: /TRADE_FOLLOWER_COUNT_(\d+)/, text: gettextCatalog.getString('Perform %1\u00a0follower trades.') },
        { pattern: 'COMMENT_COUNT_1_1', text: gettextCatalog.getString('Write 1\u00a0comments.') },
        { pattern: 'COMMENT_COUNT_3_1', text: gettextCatalog.getString('Write 3\u00a0comments in a single feed.') },
        { pattern: /COMMENT_COUNT_(\d+)_(?!1$)(\d+)/, text: gettextCatalog.getString('Write %1\u00a0comments in %2\u00a0different feeds.') },
        { pattern: /CHAT_PARTICIPANTS_(\d+)/, text: gettextCatalog.getString('Chat with %1\u00a0persons.') },
        { pattern: 'REFERRAL_COUNT_1', text: gettextCatalog.getString('Invite 1\u00a0person using your referral link. They have to register and perform at least one trade.') },
        { pattern: /REFERRAL_COUNT_(?!1$)(\d+)/, text: gettextCatalog.getString('Invite %1\u00a0persons using your referral link. They have to register and perform at least one trade.') },
        { pattern: 'LEADER_PROFILE_IMAGE', text: gettextCatalog.getString('Upload a profile picture.') },
        { pattern: 'LEADER_WPROV_CHANGE', text: gettextCatalog.getString('Change your commission on profits.') },
        { pattern: 'LEADER_LPROV_CHANGE', text: gettextCatalog.getString('Change your commission on losses.') },
        { pattern: 'LEADER_DESC_CHANGE', text: gettextCatalog.getString('Write a short description of yourself.') },
        { pattern: /DAILY_LOGIN_DAYS_(\d+)/, text: gettextCatalog.getString('Be active for %1\u00a0days in a row.') },
        { pattern: 'LEARNING_GREEN_INVESTMENTS', text: gettextCatalog.getString('Green investments') },
        { pattern: 'LEARNING_LOW_INTEREST_RATES', text: gettextCatalog.getString('Low interest rates') },
        { pattern: 'LEARNING_WHAT_ARE_SHARES', text: gettextCatalog.getString('What are shares?') },
        { pattern: 'LEARNING_TERMINOLOGY', text: gettextCatalog.getString('Terminology in trading') },
        { pattern: 'LEARNING_OPPORTUNITIES_AND_RISKS', text: gettextCatalog.getString('Opportunities and risks in trading') },
        { pattern: 'LEARNING_FUNDAMENTAL_ANALYSIS', text: gettextCatalog.getString('Fundamental analysis') },
        { pattern: 'LEARNING_TECHNICAL_ANALYSIS', text: gettextCatalog.getString('Technical analysis') }
      ],
      _textsCached: {}
    };
    
    achievements._list = null;
    
    achievements.list = function() {
      if (achievements._list)
        return $q.when(achievements._list);
      
      return achievements._list = socket.get('/achievements/list', { cache: true })
        .then(function(result) {
          return achievements._list = data.result;
        });
    };
    
    achievements.listClientAchievements = function() {
      return achievements.list().then(function(achievements) {
        return achievements.filter(function(ach) {
          return ach.isClientAchievement;
        });
      });
    };
    
    achievements.markAsDone = function(name) {
      return socket.post('/achievements/client', { data: { name: name } }).then(function(result) {
        return result._success;
      });
    };
    
    achievements.lookupText = function(name) {
      if (achievements._textsCached[name])
        return achievements._textsCached[name];
      
      for (var i = 0; i < achievements._texts.length; ++i) {
        if (achievements._texts[i].pattern == name)
          return achievements._textsCached[name] = achievements._texts[i].text;
        
        var match = name.match(achievements._texts[i].pattern);
        if (!match)
          continue;
        
        return achievements._textsCached[name] = achievements._texts[i].text
          .replace(/%(\d+)/g, function(localMatch, index) { // jshint ignore:line
            return match[parseInt(index)];
          }); // jshint ignore:line
      }
    };
    
    return achievements;
  });

})();
