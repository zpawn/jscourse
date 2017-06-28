$(function () {
	'use strict';


	$(document.documentElement).addClass('js')











	$('.example-1').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.slideDown(10000);
	});














	$('.example-2').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.slideToggle();
	});
















	$('.example-3').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.fadeToggle();
	});















	$('.example-4').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.fadeToggle(1400);
	});















	$('.example-5').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.stop().fadeToggle(1400);
	});















	$('.example-6').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content.stop().animate({
			height: 'toggle',
			width: 'toggle',
			opacity: 'toggle'
		}, 2000);
	});
















	// http://easings.net
	(function () {
		var speed;
		var FAST = 300;
		var SLOW = 2000;

		speed = SLOW;

		// $('.example-7').on('click', '.speed', function () {
		// 	speed = $(this).hasClass('slow') ? SLOW : FAST;
		// });

		$('.example-7').on('click', '.header', function () {
			var self = $(this);
			var content;

			content = self.closest('.toggle-block').find('.content');

			content.eq(0).stop().animate({
				height: ['toggle', 'easeInExpo'],
				opacity: ['toggle', 'easeOutExpo']
			}, speed);

			content.eq(1).stop().animate({
				height: ['toggle', 'easeOutCirc'],
				opacity: ['toggle', 'easeInCirc']
			}, speed);
		});
	}());


















	$('.example-8').on('click', '.header', function () {
		var self = $(this);
		var content;

		content = self.closest('.toggle-block').find('.content');
		content
			.stop()
			.removeClass('animation-complete')
			.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, Math.random() * 5000, function () {
				$(this).addClass('animation-complete');
			});
	});


/////////// 0


///////////
///////////
///////////


///////////



///////////



///////////



///////////



///////////

/////////// -1









	(function () {
		$('.example-9').find('img').eq(1).hide();

		$('.example-9').on('click', '.header', function () {
			var self = $(this);
			var content;

			content = self.closest('.toggle-block').find('.content');

			// If animation is running - do nothing
			if (content.find('img').is(':animated')) {
				return;
			}

			content.find('img').fadeToggle(10000);
		});
	}());
















	(function () {
		function getViewPortCenter () {
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			var viewPortWidth = $(window).width();
			var viewPortHeight = $(window).height();

			return {
				top: scrollTop + viewPortHeight / 2,
				left: scrollLeft + viewPortWidth / 2
			};
		}


		function getInitialPosition(node) {
			node = $(node);
			var styles = node.attr('style');
			var position;

			node.attr('style', 'display:block');
			position = {
				top: node.offset().top,
				left: node.offset().left
			};
			node.attr('style', styles);
			return position;
		}

		$('.example-10').on('click', '.header', function () {
			var self = $(this);
			var content;
			var viewportCenter = getViewPortCenter();
			var width;
			var height;
			var position;

			content = self.closest('.toggle-block').find('.content');

			// Do nothing during animation
			if (content.hasClass('animating')) {
				return;
			}

			content.addClass('animating');
			if ( !content.hasClass('zoomed') ) {

				// Zoom-in
				width = content.width();
				height = content.height();
				content.css({
					'display' : 'block',
					'opacity' : 0,
					'position' : 'absolute',
					'width' : 0,
					'height' : 0
				}).animate({
					'top' : viewportCenter.top - height / 2,
					'left' : viewportCenter.left - width / 2,
					'width' : width,
					'height' : height,
					'opacity': [1, 'easeInCirc']
				}, 600, function () {
					content
						.addClass('zoomed')
						.removeClass('animating');
				});
			} else {
				// Zoom out
				position = getInitialPosition(content);
				content.animate({
					top : position.top,
					left: position.left,
					width: 'toggle',
					height: 'toggle',
					// http://api.jquery.com/animate/#per-property-easing
					opacity: [0, 'easeOutQuint']
				}, 600, function () {
					content
						.removeClass('zoomed')
						.removeClass('animating')
						// .attr('style', '');
				});
			}
		});
	}());
});
