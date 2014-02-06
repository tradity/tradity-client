(function () {

$('#options-sb').click(function () {
	$('body').addClass('hide-herounit');
});

var showRegisterForm = function() {
	$('.actions').hide();
	$('.login-form').hide();
	$('.register-form').show();
	$('.showcase').hide();
}

var showLoginForm = function () {
	$('.actions').hide();
	$('.login-form').show();
	$('.showcase').hide();
	$('.register-form').hide();
}

var fbregister = function () {console.log('error')};

$('#login-btn').click(showLoginForm);
$('#register-btn').click(showRegisterForm);
$('.registerq').click(showRegisterForm);
$('#gtlogin').click(showLoginForm);

/* Facebook stuff */


$.fn.flash = function (times, duration) {
  var T = this;
  times = times || 3;
  duration = duration || 200;
  for (var i = 0; i < times; i++) {
      (function () {
          setTimeout(function () {
              T.fadeOut(duration, function () {
                  T.fadeIn(duration);
              });
          }, i * duration * 2 + 50);
      })(i);
  }
};

window.fbAsyncInit = function () {
  FB.init({
      appId: '349073195234364',
      status: true,
      xfbml: true
  });

  fbregister = function () {
  	console.log('hi')
    FB.login(function (response) {
          if (response.authResponse) {
              console.log('Welcome!  Fetching your information.... ');
              FB.api('/me', function (response) {
                  $("[ng-model='name']").val(response.first_name);
                  $("[ng-model='giv_name']").val(response.first_name);
                  $("[ng-model='fam_name']").val(response.last_name);
                  $("[ng-model='schoolname']").val(response.education[0].school.name);
                  $("[ng-model='email']").val(response.email);
                  $("[ng-model='facebookid']").val(response.id);
                  $("[ng-model='password']").flash();
                  $("[ng-model='password_check']").flash();
                  console.log(response);
              });
          } else {
              console.log('User cancelled login or did not fully authorize.');
          }
      }, {
          scope: 'email'
      });
  }
  $('#fbregister').click(fbregister);
};


(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
      return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

})();