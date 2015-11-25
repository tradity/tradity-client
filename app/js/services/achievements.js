'use strict';

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
	.factory('achievements', function ($q, gettext, socket) {
		var achievements = {
			_list: null,
			_texts: [
				{ pattern: /TRADE_COUNT_(\d+)/, text: gettext('Perform %1\u00a0trades') },
				{ pattern: 'TRADE_VOLUME_25K', text: gettext('Execute a trade with a volume of more than 25,000\u00a0€.') }, 
				{ pattern: 'TRADE_STOCKNAME_AZ', text: gettext('Trade a stock whose name begine with “A” and another one whose begins with “Z”') },
				{ pattern: 'TRADE_RESELL_1H', text: gettext('Buy and sell shares of a stock within 1\u00a0hour') },
				{ pattern: 'TRADE_RESELL_10D', text: gettext('Buy and sell shares 10\u00a0days apart.') },
				{ pattern: 'TRADE_SPLIT_BUY', text: gettext('Buy shares of a stock which already is in your depot.') },
				{ pattern: 'TRADE_SPLIT_SELL', text: gettext('Sell only a part of the shares of a stock in your depot.') },
				{ pattern: 'TRADE_FOLLOWER_COUNT_1', text: gettext('Perform 1\u00a0follower trade (invest into another user).') },
				{ pattern: /TRADE_FOLLOWER_COUNT_(\d+)/, text: gettext('Perform %1\u00a0follower trades.') },
				{ pattern: 'COMMENT_COUNT_1_1', text: gettext('Write 1\u00a0comments.') },
				{ pattern: 'COMMENT_COUNT_3_1', text: gettext('Write 3\u00a0comments in a single feed.') },
				{ pattern: /COMMENT_COUNT_(\d+)_(?!1$)(\d+)/, text: gettext('Write %1\u00a0comments in %2\u00a0different feeds.') },
				{ pattern: /CHAT_PARTICIPANTS_(\d+)/, text: gettext('Chat with %1\u00a0persons.') },
				{ pattern: 'REFERRAL_COUNT_1', text: gettext('Invite 1\u00a0person using your referral link. They have to register and perform at least one trade.') },
				{ pattern: /REFERRAL_COUNT_(?!1$)(\d+)/, text: gettext('Invite %1\u00a0persons using your referral link. They have to register and perform at least one trade.') },
				{ pattern: 'LEADER_PROFILE_IMAGE', text: gettext('Upload a profile picture.') },
				{ pattern: 'LEADER_WPROV_CHANGE', text: gettext('Change your commission on profits.') },
				{ pattern: 'LEADER_LPROV_CHANGE', text: gettext('Change your commission on losses.') },
				{ pattern: 'LEADER_DESC_CHANGE', text: gettext('Write a short description of yourself.') },
				{ pattern: /DAILY_LOGIN_DAYS_(\d+)/, text: gettext('Be active for %1\u00a0days in a row.') },
				{ pattern: 'LEARNING_GREEN_INVESTMENTS', text: gettext('Green investments') },
				{ pattern: 'LEARNING_LOW_INTEREST_RATES', text: gettext('Low interest rates') },
				{ pattern: 'LEARNING_WHAT_ARE_SHARES', text: gettext('What are shares?') },
				{ pattern: 'LEARNING_TERMINOLOGY', text: gettext('Terminology in trading') },
				{ pattern: 'LEARNING_OPPORTUNITIES_AND_RISKS', text: gettext('Opportunities and risks in trading') },
				{ pattern: 'LEARNING_FUNDAMENTAL_ANALYSIS', text: gettext('Fundamental analysis') },
				{ pattern: 'LEARNING_TECHNICAL_ANALYSIS', text: gettext('Technical analysis') }
			],
			_textsCached: {}
		};
		
		var handleAchievementList = function(data) {
			if (data.code != 'list-all-achievements-success') {
				achievements._list = null;
				
				return socket.once('self-info').then(function() {
					return achievements.list();
				});
			}
			
			return achievements._list = data.result;
		};
		
		socket.on('list-all-achievements', handleAchievementList);
		achievements._list = null;
		
		achievements.list = function() {
			if (achievements._list)
				return $q.when(achievements._list);
			
			return achievements._list = socket.emit('list-all-achievements').then(handleAchievementList);
		};
		
		achievements.listClientAchievements = function() {
			return achievements.list().then(function(achievements) {
				return achievements.filter(function(ach) {
					return ach.isClientAchievement;
				});
			});
		};
		
		achievements.markAsDone = function(name) {
			return socket.emit('achievement', { name: name }).then(function(data) {
				return data.code == 'achievement-success';
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
					.replace(/%(\d+)/g, function(localMatch, index) {
						return match[parseInt(index)];
					});
			}
		};
		
		return achievements;
	});
