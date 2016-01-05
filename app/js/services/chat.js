(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @ngdoc service
 * @name tradity.chat
 * @description
 * # handles chat data
 * Factory
 */
angular.module('tradity')
	.factory('chat', function (socket,$rootScope,DEFAULT_PROFILE_IMG) {
		var Chat = function(event, chatid, members) {
			if (!event || !chatid || !members)
				throw new Error("parameter error");

			this.members = members;
			this.chatid = chatid;
			this.event = event;
			this.messages = [];
		};

		Chat.prototype.add = function(content,profilepic,uid,time) {
			if (!time || !uid || !content)
				throw new Error("parameter error");
			this.messages.push({
				content: content,
				profilepic: profilepic || DEFAULT_PROFILE_IMG,
				uid: uid,
				time: time
			});
			$rootScope.$broadcast('getMessage');
		};

		/* chats Class */

		var Chats = function() {
			var self = this;
			this.chats = [];

			socket.on('comment', function (data) {
				self.onMessage(data);
			});
			socket.on('list-all-chats', function (data) {
				self.onChats(data);
			});
			
			// XXX
			// addaleax: It is a BAD idea to send this out if we don’t know
			// whether we’re logged in etc.
			// this breaks cool registration stuff like registration links
			// with pre-filled school data!
			//socket.emit('list-all-chats');
		};

		Chats.prototype.add = function(event, chatid, members) {
			this.chats.push(new Chat(event, chatid, members));
			$rootScope.$broadcast('getChat');
		};

		Chats.prototype.onMessage = function(event) {
			if (event.baseeventtype == 'chat-start') {
				var chat = this.getByEvent(event.baseeventid);
				if (chat) {
					chat.add(event.comment,event.profilepic,event.commenter,event.eventtime);
				} else {
					throw new Error("chat not found");
				}
			}
		};

		Chats.prototype.onChats = function(data) {
			for (var i in data.chats) {
				this.add( // exits ?
					data.chats[i].chatstartevent,
					data.chats[i].chatid,
					data.chats[i].members
				);
			}
		};

		Chats.prototype.getByEvent = function(event) {
			for (var i = 0; i < this.chats.length; i++) {
				if (this.chats[i].event == event)
					return this.chats[i];
			}
			
			return false;
		};

		Chats.prototype.getById = function(chatid) {
			for (var i = 0; i < this.chats.length; i++) {
				if (this.chats[i].chatid == chatid)
					return this.chats[i];
			}
			
			return false;
		};

		return new Chats();
	});

})();
