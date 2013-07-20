
$(document).ready(function() {
	logoTransition();
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
		}
		else {
			logoText.slideUp(100);
			nameContainer.removeClass("fixed-name-container");	
		}
	});
}
