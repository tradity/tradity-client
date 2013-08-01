'use strict';

// socket.io wrapper object
function SoTrade(socket) {
	this.socket = socket;
	this.listeners = {}; // listener name -> array of callbacks
	this.ids = []; // numeric id -> callback for that id
	this.id = 0;
	
	this.socket.on('response', (function(data) {
                console.log(data); // remove for production
		var rid = data['is-reply-to'].split('--');
		var type = rid[0];
		if (type == 'login')
			this.setKey(data.key);
		
		// general listeners
		var listeners = this.listeners[type] || [];
		for (var i = 0; i < listeners.length; ++i) 
			listeners[i](data);
		
		// specific listeners
		var numericID = parseInt(rid[1]);
		var idcb = this.ids[numericID] || function() {};
		idcb(data);
		delete this.ids[numericID];
	}).bind(this));
	
	this.socket.on('push', (function(data) {
                console.log(data); // remove for production
		var type = data.type;
		var listeners = this.listeners[type] || [];
		for (var i = 0; i < listeners.length; ++i) 
			listeners[i](data);
	}).bind(this));
}

SoTrade.prototype.emit = function(evname, data, cb) {
	data = data || {};
	if (!evname)
		return console.warn('event name missing');
	data.type = evname;
	var id = ++this.id;
	data.id = evname + '--' + id;
	if (this.getKey() && !data.key)
		data.key = this.getKey();
	if (cb)
		this.ids[id] = cb;
	this.socket.emit('query', data);
        // only for debugging, remove for production
        console.log(data);
}

SoTrade.prototype.getKey = function() {
	var cookie = document.cookie.split(';');
	for (var i = 0; i < cookie.length; ++i) {
		var c = cookie[i].trim().split('=');
		if (c[0].toLowerCase() == 'key')
			return c[1];
	}
	return null;
}

SoTrade.prototype.setKey = function(k) {
	document.cookie = 'key=' + k + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

SoTrade.prototype.on = function(evname, cb) {
	(this.listeners[evname] = (this.listeners[evname] || [])).push(cb);
	this.socket.on(evname, cb);
}

angular.module('tradity.services', []).
  factory('socket', function ($rootScope) {
    var socket = new SoTrade(io.connect('https://dev.tradity.de:443'));
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
