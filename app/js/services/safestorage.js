(function() { 'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
  .factory('safestorage', function (socket, $rootScope) {
    var localStorage_ = typeof localStorage != 'undefined' ? localStorage : {};
    
    var SafeStorage = function() {
      var self = this;
      
      localStorage_.clientStorage = localStorage_.clientStorage || '{}';
      localStorage_.ssKey = localStorage_.ssKey || '';
      self.encryptedStorage = null;
      self.hasLoadedRemoteData = false;
      
      $rootScope.$on('/options', function(ev, result) {
        if (result.data && result.data.clientstorage &&
            result.data.clientstorage.data) {
          self.encryptedStorage = new Uint8Array(result.data.clientstorage.data);
          
          if (localStorage_.ssKey)
            self.decrypt();
        }
      });
    };
    
    SafeStorage.prototype.check = function() {
      return socket.get('/options');
    };
    
    SafeStorage.prototype.decrypt = function() {
      if (!localStorage_.ssKey || !this.encryptedStorage)
        return;
      
      var decrypted = '';
      
      try {
        if (this.encryptedStorage.length > 0) {
          var iv = this.encryptedStorage.subarray(0, 16);
          var key = new Uint8Array(localStorage_.ssKey.split(','));
          decrypted = asmCrypto.AES_GCM.decrypt(this.encryptedStorage.subarray(16), key, iv);
        }
        
        localStorage_.clientStorage = bytesToString(decrypted);
      } catch (e) {
        console.warn('Could not decrypt clientStorage: ', e);
      }
      
      try {
        JSON.parse(localStorage_.clientStorage);
      } catch (e) {
        console.warn('Could not parse clientStorage: ', e);
        localStorage_.clientStorage = '{}';
      }
      
      this.hasLoadedRemoteData = true;
    };
    
    SafeStorage.prototype.clear = function() {
      localStorage_.clientStorage = '{}';
      localStorage_.ssKey = '';
      this.encryptedStorage = null;
      this.hasLoadedRemoteData = false;
    };
    
    SafeStorage.prototype.setPassword = function(pw) {
      localStorage_.ssKey = Array.prototype.slice.call(this.generateKeyFromPassword(pw)).join(',');
      
      this.decrypt();
      
      if (JSON.parse(localStorage_.clientStorage)._is_set)
        this.updateRemote();
    };
    
    SafeStorage.prototype.getEntry = function(name) {
      return JSON.parse(localStorage_.clientStorage)[name];
    };
    
    SafeStorage.prototype.setEntry = function(name, value) {
      var s = JSON.parse(localStorage_.clientStorage);
      s[name] = value;
      s._is_set = true;
      localStorage_.clientStorage = JSON.stringify(s);
      
      this.updateRemote();
    };
    
    SafeStorage.prototype.updateRemote = function() {
      if (!localStorage_.ssKey)
        return;
      
      var ivBase = '';
      for (var i = 0; i < 100; ++i)
        ivBase += String(Math.random());
      var iv = asmCrypto.SHA256.bytes(ivBase).subarray(0, 16);
      var key = new Uint8Array(localStorage_.ssKey.split(','));
      
      var plaintext = localStorage_.clientStorage;
      while (plaintext.length % 16)
        plaintext += ' '; // pad with spaces
      var encrypted = asmCrypto.AES_GCM.encrypt(stringToBytes(plaintext), key, iv);
      
      return socket.put('/options/clientstorage', {
        data: uint8concat(iv, encrypted),
        transformRequest: [],
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        json: false
      });
    };
    
    SafeStorage.prototype.generateKeyFromPassword = function(pw) {
      // Yes, this is a fixed salt in production code. Yes, this is a (mildly) bad idea.
      return asmCrypto.PBKDF2_HMAC_SHA256.bytes(pw, '7b020da8f05fcdad7cb15d7457483a77').subarray(0, 16);
    };
    
    return new SafeStorage();
  });

})();
