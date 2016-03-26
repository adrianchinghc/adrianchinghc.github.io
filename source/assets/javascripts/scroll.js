$(document).ready(function(){
	$('a[href^="#top"], a[href^="#about"], a[href^="#blog"], a[href^="#contact"]').on('click',function (e) {
		e.preventDefault();

		var target = this.hash,
		$target = $(target);

		$('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 700, 'swing', function () {
			window.location.hash = target;
		});
	});
});
