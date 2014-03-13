'use strict';

$(document).ready(function() {
	initNotifications();
  $('#togglemenu').click(togglemenu)
});

var initNotifications = function() {
	var notificationContainer = $('<div id="notifications"></div>');
	$('body').append(notificationContainer);
};

var notification = function (text,icon) { // icon == true -> success
	var classes;
	
	if (!icon)
		icon = 'fa-exclamation-triangle';
	
	if (icon == true) {
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
}

var togglemenu = function() {
  $('body').toggleClass('menuShow');
}


var tabbing = function(div, targeturl, def, $location, $scope) {
  div.tabs();
  $(div.children('ul').get(0)).find('a').each(function(i, e) {
    if ($(e).attr('href').split('/').pop().replace(/#/g, '') == def)
      div.tabs('option', {active: i});
  });
  div.tabs({activate: function(event, ui) {
    if (!ui.newTab)
      return;
    $scope.$apply(function() { $location.path(targeturl.replace(/\?/g, ui.newTab.children('a').attr('href').replace(/#/g, ''))); });
  }});
};

var useSchoolAC = function($scope, socket) {
  $scope.onLSResult = [];
  $scope.schoolList = [];
  socket.on('list-schools', function(result) {
    $scope.schoolList = result.result;
    for (var i = 0; i < $scope.schoolList.length; ++i) {
      $scope.schoolList[i].getInputTextValue = 
      $scope.schoolList[i].getEntryName = function() { return this.name; };
      $scope.schoolList[i].getExtra = function() { return this.usercount + ' Personen'; };
    }
    for (var i = 0; i < $scope.onLSResult.length; ++i)
      $scope.onLSResult[i]();
  }, $scope);
  
  socket.emit('list-schools', {_cache: 20});
  
  $scope.acFetcher = {
    fetchAutoComplete: function(ac, s) {
      var enter = function() { ac.putData($scope.schoolList, s); };
      if ($scope.schoolList.length)
        enter();
      else
        $scope.onLSResult.push(enter);
    },
    submit: function(ac, data) {
      $scope.schoolname = document.getElementById('schoolname').value = data.name;
      $scope.school = data.id;
    },
    valuecreate: function(ac, data, element) {
      if ($scope.prevschool && $scope.prevschool == data.id)
        element.className += ' ac-prevschool';
    }
  };
  $scope.ac = new AC('schoolname', $scope.acFetcher, false, 1, 1, null, true);
};