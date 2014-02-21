$(document).ready(function() {
	logoTransition();
	initNotifications();
});

// Scrolling Header effects (logo + profile)
function logoTransition() {
	$(document).scroll(function() {
		var logoText = $("#tradity");
		var nameContainer = $(".name-container");

		if ($(window).scrollTop() > 130) {
			logoText.slideDown(300);
			nameContainer.addClass("fixed-name-container");
			nameContainer.slideDown(300);
		} else {
			logoText.slideUp(100);
			nameContainer.removeClass("fixed-name-container");	
		}
	});
}

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
