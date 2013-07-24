'use strict';

// socket.io wrapper object
function SoTrade(socket) {
	this.socket = socket;
	this.listeners = {}; // listener name -> array of callbacks
	this.ids = []; // numeric id -> callback for that id
	this.id = 0;
	this.key = null;
	
	this.socket.on('response', (function(data) {
		var rid = data['is-reply-to'].split('--');
		var type = rid[0];
		if (type == 'login')
			this.key = data.key;
		
		var listeners = this.listeners[type] || [];
		for (var i = 0; i < listeners.length; ++i) 
			listeners[i](data);
		
		var idcb = this.ids[parseInt(rid[1])] || function() {};
		idcb(data);
	}).bind(this));
}

SoTrade.prototype.emit = function(evname, data, cb) {
	data = data || {};
	if (!evname)
		return console.warn('event name missing');
	data.type = evname;
	var id = ++this.id;
	data.id = evname + '--' + id;
	if (this.key && !data.key)
		data.key = this.key;
	if (cb)
		this.ids[id] = cb;
	this.socket.emit('query', data);
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
