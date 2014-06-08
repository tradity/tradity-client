var enterDevMode = function(){};
var SoTradeConnection;
var SoTradeModel;

(function() {'use strict';

var logmsg = false;
var devmode = function() { return document.cookie.indexOf('devmode') != -1; };

function datalog() {
	if (!devmode()) {
		if (!logmsg) {
			/*console.log('For data debugging, please call enterDevMode() once.');*/
			logmsg = true;
		}
		
		return;
	}
	
	console.log.apply(console, arguments);
};

enterDevMode = function() {
	document.cookie = 'devmode=1;expires=Fri, 31 Dec 9999 23:59:59 GMT';
};

// socket.io wrapper object
SoTradeConnection = function(connect) {
	this.connect = connect;
	this.socket = null;
	this.listeners = {}; // listener name -> array of callbacks
	this.ids = {}; // numeric id -> {cb: callback for that id, prefill: object}
	this.id = 0;
	this.lzma = null;
	
	if (typeof LZMA != 'undefined' && typeof Blob != 'undefined' && typeof Uint8Array != 'undefined' && 
		window.URL && window.URL.createObjectURL && lzma_worker_js)
		this.lzma = new LZMA(URL.createObjectURL(new Blob([lzma_worker_js], {type: 'application/x-javascript'})));
	
	this.qCache = {};
	
	this._txPackets = 0;
	this._rxPackets = 0;
	
	this.init();
};

SoTradeConnection.prototype.init = function() {
	this.socket = this.connect();
	
	this.socket.on('response', (function(wdata) {
		this.unwrap(wdata, this.responseHandler.bind(this));
	}).bind(this));
	
	this.socket.on('push', (function(wdata) {
		this.unwrap(wdata, (function(data) {
			datalog('!', data);
			
			this._rxPackets++;
			this.invokeListeners(data);
		}).bind(this));
	}).bind(this));
	
	this.socket.on('push-container', (function(wdata) {
		this.unwrap(wdata, (function(data) {
			datalog('!', data);
			
			this._rxPackets++;
			
			for (var i = 0; i < data.pushes.length; ++i)
				this.invokeListeners(data.pushes[i]);
		}).bind(this));
	}).bind(this));
	
	this.socket.on('disconnect', (function(reason) {
		if (reason == 'booted') {
			setTimeout((function() {
				try {
					this.socket.socket.reconnect();
				} catch (e) {
					console.warn(
						'Tried socket.socket.reconnect, but it failed for some reason; ' +
						'It is from the socket.io private API, so it’s basically voodoo anyway ' +
						'(but nothing seems to be matching in the public API, so we’re using it)');
					throw e;
				}
			}).bind(this), 2000);
		}
	}).bind(this));
};

SoTradeConnection.prototype.hasOpenQueries = function() {
	for (var i in this.ids)
		if (this.ids[i] && !this.ids[i]._expect_no_response)
			return true;
	return false;
};

SoTradeConnection.prototype.invokeListeners = function(data, listener) {
	listener = listener || function() {};
	
	var type = data.type;
	
	// general listeners
	var listeners = this.listeners[type] || [];
	for (var i = 0; i < listeners.length; ++i) 
		if (listeners[i])
			listeners[i](data);
	
	// specific listener
	listener(data);
};

SoTradeConnection.prototype.responseHandler = function(data) {
	var rid = data['is-reply-to'].split('--');
	var type = rid[0];
	if ((type == 'login' || data.code == 'login-success' || type == 'register' || (data.code && data.code.match(/^reg-/))) && data.key)
		this.setKey(data.key);
	
	data.type = type;
		
	var numericID = parseInt(rid[1]);
	var waitentry = this.ids[numericID];
	
	if (waitentry) {
		for (var i in waitentry.prefill) 
			if (typeof data[i] == 'undefined')
				data[i] = waitentry.prefill[i];
	}
	
	if (devmode()) {
		data._dt_cdelta   = data._t_crecv - data._t_csend;
		data._dt_inqueue  = data._t_srecv - data._t_csend;
		data._dt_sdelta   = data._t_ssend - data._t_srecv;
		data._dt_outqueue = data._t_crecv - data._t_ssend;
		data._dt_scomp    = data._t_ssend - data._t_sdone;
		data._dt_ccomp    = data._t_cdeco - data._t_crecv;
	}
	
	this._rxPackets++;
	
	datalog('<', data);
	
	delete this.ids[numericID];
	
	this.invokeListeners(data, waitentry ? waitentry.cb : null);
};

SoTradeConnection.prototype.emit = function(evname, data, cb) {
	if (typeof data == 'function') {
		cb = data;
		data = null;
	}
	
	cb = cb || function() {};
	
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
	
	var prefill = data._prefill || {};
	prefill._t_csend = new Date().getTime();
	prefill._reqsize = JSON.stringify(data).length;
	
	this.ids[id] = {
		cb: cb,
		prefill: prefill,
		_expect_no_response: data._expect_no_response
	};
	
	this._txPackets++;
	
	if (this.lzma)
		data.lzma = 1;
	
	this.socket.emit('query', data);
	datalog('>', data);
	
	if (evname == 'logout') 
		this.setKey(null);
};

SoTradeConnection.prototype.getKey = function() {
	var s = localStorage || window.localStorage;
	if (s && s['sotradekey'])
		return s['sotradekey'];
	
	var cookie = document.cookie.split(';');
	for (var i = 0; i < cookie.length; ++i) {
		var c = cookie[i].trim().split('=');
		if (c[0].toLowerCase() == 'key')
			return c[1];
	}
	return null;
};

SoTradeConnection.prototype.setKey = function(k) {
	datalog('#', 'key = ' + k);
	
	if (k != this.getKey()) {
		this.qCache = {};
	}
	
	var s = localStorage || window.localStorage;
	if (s)
		s['sotradekey'] = k;
	
	if (this.getKey() != k)
		document.cookie = 'key=' + k + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	else
		document.cookie = 'key=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

SoTradeConnection.prototype.on = function(evname, cb, angularScope) {
	var index = (this.listeners[evname] = (this.listeners[evname] || [])).push(cb) - 1;
	this.socket.on(evname, cb);
	if (angularScope) {
		var this_ = this;
		angularScope.$on('$destroy', function() { delete this_.listeners[evname][index]; });
	}
};

SoTradeConnection.prototype.unwrap = function(data, cb) {
	var recvTime = new Date().getTime();
	(this.lzma && data.e == 'lzma' ? function(cont) {
		this.lzma.decompress(new Uint8Array(data.s), cont);
	} : function(cont) {
		if (data.e != 'raw') {
			console.warn(data);
			throw new Error('Unknown/unsupported encoding: ' + data.e);
		}
		
		cont(data.s);
	}).bind(this)(function(decoded) {
		var e = JSON.parse(decoded);
		e._t_crecv = recvTime;
		e._t_ssend = data.t;
		e._t_cdeco = new Date().getTime();
		e._resp_encsize = data.s.length;
		e._resp_decsize = decoded.length;
		cb(e);
	});
};

SoTradeConnection.prototype.txPackets = function() { return this._txPackets; };
SoTradeConnection.prototype.rxPackets = function() { return this._rxPackets; };

})();
