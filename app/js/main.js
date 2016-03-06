'use strict'; // jshint ignore:line

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(document).ready(function() {
  initNotifications();
});

var initNotifications = function() {
  var notificationContainer = $('<div id="notifications"></div>');
  $('body').append(notificationContainer);
};

var notification = function (text, icon) { // icon === true -> success
  var classes = '';
  
  if (!icon)
    icon = 'fa-exclamation-triangle';
  
  if (icon === true) {
    classes = 'success';
    icon = 'fa-check';
  }
  
  var notificationItem = $('<div class="notification-item ' + classes + '"><span class="fa ' + icon + '"></span> ' + text + '</div>');
  notificationItem.hide();
  $('#notifications').prepend(notificationItem);
  notificationItem.fadeIn(500);
  setTimeout(function() {
    notificationItem.hide();
  }, 3000);
};

var fileemit = function(socket, gettextCatalog, input, evtype, template, serverconfig, $q) {
  var filename = null; 
  var mime = null;
  
  var fail = function() { notification(gettextCatalog.getString('There was a technical problem uploading your profile picture.\nPlease turn to tech@tradity.de')); };
  
  try {
    var goPublish = function(data) {
      try {
        var encoded = data.buffer ? data.buffer : data;
        
        template.data = encoded;
        template.headers = template.headers || {};
        template.headers['Content-Type'] = template.mime || mime;
        template.params = template.params || {};
        template.params.name = template.name || filename;
        template.transformRequest = [];
        
        return socket(template);
      } catch (e) {
        fail();
        throw e;
      }
    };
    
    if (input.name) { // File
      filename = input.name;
      if (/\.jpe?g$/i.test(filename)) mime = 'image/jpeg';
      if (/\.png$/i.test(filename))   mime = 'image/png';
      if (/\.gif$/i.test(filename))   mime = 'image/gif';
      
      if (!mime) {
        return notification(gettextCatalog.getString('Your need to upload your profile picture as a JPEG/PNG/GIF file'));
      }
      
      var reader = new FileReader();
      
      return $q(function(resolve, reject) {
        reader.readAsArrayBuffer(input);
      
        reader.onload = function() { 
          var buf = reader.result;
          if (!buf)
            return notification(gettextCatalog.getString('Could not upload profile picture'));
            
          if (serverconfig && reader.result.byteLength > serverconfig.fsdb.userquota)
            return notification(gettextCatalog.getString('Your profile picture file is too large (maximum 3\u00a0MB)'));
          
          resolve(goPublish(new Uint8Array(buf)));
        };
      });
    } else {
      return goPublish(input);
    }
  } catch (e) {
    fail();
    throw e;
  }
};

var generateReplacer = function(replacements) {
  return function(s) {
    if (!s)
      return s;
    
    for (var i = 0; i < replacements.length; ++i)
      s = s.replace(replacements[i].orig, replacements[i].replace);
    return s;
  };
};

var escapeHTML = generateReplacer([
  { orig: /&/g, replace: '&amp;' },
  { orig: /</g, replace: '&lt;' },
  { orig: />/g, replace: '&gt;' },
  { orig: /'/g, replace: '&#039;' },
  { orig: /"/g, replace: '&quot;' }
]);
