
$(document).ready(function() {
	logoTransition();
});

// Scrolling Header effects (logo + profile)
function logoTransition() {
	$(document).scroll(function() {
		var nav = $("#nav");
		var logoText = $("#tradity");
		var nameContainer = $(".name-container");

		if ($(window).scrollTop() > 130) {
			logoText.slideDown(300);
			nav.css({"position" : "fixed"});
			nav.animate({"top" : "50px"}, 550);
			nameContainer.addClass("fixed-name-container");
			nameContainer.slideDown(300);
		}
		else {
			logoText.slideUp(100);
			nav.css({
					"position" : "static",
					"top" : "auto" //warum dusselt er damit noch rum, nachdem man hochscrollt?
					});
			nameContainer.removeClass("fixed-name-container");	
		}
	});
}
