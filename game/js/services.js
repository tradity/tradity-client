'use strict';

// socket.io wrapper object
function SoTradeConnection(socket) {
	this.socket = socket;
	this.listeners = {}; // listener name -> array of callbacks
	this.ids = []; // numeric id -> callback for that id
	this.id = 0;
	
	this.qCache = {};
	this.responseHandler = (function(data) {
				console.log('<', data); // remove for production
		var rid = data['is-reply-to'].split('--');
		var type = rid[0];
		if (type == 'login')
			this.setKey(data.key);
		
		// general listeners
		var listeners = this.listeners[type] || [];
		for (var i = 0; i < listeners.length; ++i) {
			if (listeners[i])
				listeners[i](data);
		}
		
		// specific listeners
		var numericID = parseInt(rid[1]);
		var idcb = this.ids[numericID] || function() {};
		idcb(data);
		delete this.ids[numericID];
	}).bind(this);
	
	this.socket.on('response', this.responseHandler);
	
	this.socket.on('push', (function(data) {
				console.log('!', data); // remove for production
		var type = data.type;
		var listeners = this.listeners[type] || [];
		for (var i = 0; i < listeners.length; ++i) 
			listeners[i](data);
	}).bind(this));
}

SoTradeConnection.prototype.emit = function(evname, data, cb) {
	if (typeof data == 'function') {
		cb = data;
		data = null;
	}
	
	data = data || {};
	if (!evname)
		return console.warn('event name missing');
	data.type = evname;
	var id = ++this.id;
	data.id = evname + '--' + id;
	
	if (this.getKey() && !data.key)
		data.key = this.getKey();
	
	var now = (new Date()).getTime();
	var cacheTime = data._cache * 1000;
	if (cacheTime) {
		var qcid_obj = $.extend(true, {}, data);
		delete qcid_obj._cache;
		delete qcid_obj.id;
		var qcid = JSON.stringify(qcid_obj);
		var entry = this.qCache[qcid];
		if (entry && (now - entry._cache_rtime) < cacheTime) {
			setTimeout((function() {
				//console.log('hit', data, qcid);
				this.responseHandler(entry);
				if (cb)
					cb(entry);
			}).bind(this), 0);
			return;
		} 
		
		$.each(Object.keys(this.qCache), (function(i, k) { if (now > this.qCache[k]._cache_ptime) delete this.qCache[k]; }).bind(this));
		
		//console.log('miss', data, qcid, Object.keys(this.qCache).length);
		delete this.qCache[qcid];
		var oldCB = cb;
		cb = (function(entry) {
			//console.log('insert', entry, qcid);
			
			var now = new Date().getTime();
			entry._cache_rtime = now;
			entry._cache_ptime = now + cacheTime;
			this.qCache[qcid] = entry;
			oldCB(entry);
		}).bind(this);
	}
	
	if (cb)
		this.ids[id] = cb;
	this.socket.emit('query', data);
				// only for debugging, remove for production
				console.log('>', data);
}

SoTradeConnection.prototype.getKey = function() {
	var cookie = document.cookie.split(';');
	for (var i = 0; i < cookie.length; ++i) {
		var c = cookie[i].trim().split('=');
		if (c[0].toLowerCase() == 'key')
			return c[1];
	}
	return null;
}

SoTradeConnection.prototype.setKey = function(k) {
	document.cookie = 'key=' + k + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

SoTradeConnection.prototype.on = function(evname, cb, angularScope) {
	var index = (this.listeners[evname] = (this.listeners[evname] || [])).push(cb) - 1;
	this.socket.on(evname, cb);
	if (angularScope) {
		var this_ = this;
		angularScope.$on('$destroy', function() { delete this_.listeners[evname][index]; });
	}
}

angular.module('tradity.services', []).
	factory('socket', function ($rootScope) {
		var socket = new SoTradeConnection(io.connect('https://dev.tradity.de:443'));
		return {
			on: function (eventName, callback, angularScope) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				}, angularScope);
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
