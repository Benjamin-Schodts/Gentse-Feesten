(function($) {
	$(document).ready(function() { 
		$('.scrollup').click(function(){
			console.log("in");
			$("html, body").animate({ scrollTop: 0 }, 500);
			return false;
		});

		$(window).scroll(function() {
			if ($(this).scrollTop() > 500) {
				$('.scrollup').fadeIn();
			} else {
				$('.scrollup').fadeOut();
			}
		});
	});
});