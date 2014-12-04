'use strict';

function uint8concat(buf1, buf2) {
	var tmp = new Uint8Array(buf1.byteLength + buf2.byteLength);
	tmp.set(new Uint8Array(buf1), 0);
	tmp.set(new Uint8Array(buf2), buf1.byteLength);
	return tmp; 
}

function bytesToString(arr) {
	var str = '';
	for (var i = 0; i < arr.length; ++i)
		str += String.fromCharCode(arr[i]);
	
	return str;
}

function stringToBytes(str) {
	var arr = new Uint8Array(str.length);
	for (var i = 0; i < str.length; ++i)
		arr[i] = str.charCodeAt(i);
	
	return arr;
}

/**
 * @ngdoc service
 * @name tradity.safestorage
 * @description
 * # safestorage
 * Factory
 */
angular.module('tradity')
	.factory('safestorage', function (socket) {
		var SafeStorage = function() {
			var self = this;
			
			localStorage.clientStorage = localStorage.clientStorage || '{}';
			localStorage.ssKey = localStorage.ssKey || '';
			self.encryptedStorage = null;
			self.hasLoadedRemoteData = false;
			
			socket.on('get-own-options', function(data) {
				if (data.result && data.result.clientstorage) {
					self.encryptedStorage = new Uint8Array(data.result.clientstorage);
					
					if (localStorage.ssKey)
						self.decrypt();
				}
			});
		};
		
		SafeStorage.prototype.check = function() {
			return socket.emit('get-own-options');
		};
		
		SafeStorage.prototype.decrypt = function() {
			if (!localStorage.ssKey || !this.encryptedStorage)
				return;
			
			var iv = this.encryptedStorage.subarray(0, 16);
			var key = new Uint8Array(localStorage.ssKey.split(','));
			var decrypted = asmCrypto.AES_GCM.decrypt(this.encryptedStorage.subarray(16), key, iv);
			
			localStorage.clientStorage = bytesToString(decrypted);
			this.hasLoadedRemoteData = true;
		};
		
		SafeStorage.prototype.clear = function() {
			localStorage.clientStorage = '{}';
			localStorage.ssKey = '';
			this.encryptedStorage = null;
			this.hasLoadedRemoteData = false;
		};
		
		SafeStorage.prototype.setPassword = function(pw) {
			localStorage.ssKey = Array.prototype.slice.call(this.generateKeyFromPassword(pw)).join(',');
			
			this.decrypt();
			
			if (JSON.parse(localStorage.clientStorage)._is_set)
				this.updateRemote();
		};
		
		SafeStorage.prototype.getEntry = function(name) {
			return JSON.parse(localStorage.clientStorage)[name];
		};
		
		SafeStorage.prototype.setEntry = function(name, value) {
			var s = JSON.parse(localStorage.clientStorage);
			s[name] = value;
			s._is_set = true;
			localStorage.clientStorage = JSON.stringify(s);
			
			this.updateRemote();
		};
		
		SafeStorage.prototype.updateRemote = function() {
			if (!localStorage.ssKey)
				return;
			
			var ivBase = '';
			for (var i = 0; i < 100; ++i)
				ivBase += String(Math.random());
			var iv = asmCrypto.SHA256.bytes(ivBase).subarray(0, 16);
			var key = new Uint8Array(localStorage.ssKey.split(','));
			
			var plaintext = localStorage.clientStorage;
			while (plaintext.length % 16)
				plaintext += ' '; // pad with spaces
			var encrypted = asmCrypto.AES_GCM.encrypt(stringToBytes(plaintext), key, iv);
			
			return socket.emit('set-clientstorage', {
				storage: uint8concat(iv, encrypted).buffer
			});
		};
		
		SafeStorage.prototype.generateKeyFromPassword = function(pw) {
			// Yes, this is a fixed salt in production code. Yes, this is a bad idea.
			return asmCrypto.PBKDF2_HMAC_SHA256.bytes(pw, '7b020da8f05fcdad7cb15d7457483a77').subarray(0, 16);
		};
		
		return new SafeStorage();
	});
