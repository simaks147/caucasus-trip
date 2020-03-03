$(function() {

	// scroll to ittenery_section after click on button
	$('.main-header_slogan button').on('click', function() {

		setIttinerySectionPos = $('.set-ittinery_summary').offset().top - 50;

		$('body, html').animate({scrollTop: setIttinerySectionPos}, 500);
	});

	// display or hide navigation after scroll
	$(window).on('scroll', function() {

	    if ( $(window).scrollTop() > $('.intro').offset().top - 100 ) {
	    	$('.main-header_nav').addClass('fix slideInDown');

	    } else {
	    	$('.main-header_nav').removeClass('fix slideInDown');
	    }
	});

	// change display of items after selection of destination
	$('.toggle-dest').change(function(e) {
		var
			$this = $(this),
			destination = $this.val(),
			container = $this.closest('.sort_destination'),
			destItems = container.find('.destination_item'),
			reqItems = destItems.filter('[id="' +  destination +'"]'),
			duration = 500;

		reqItems.siblings().css('opacity', '0').removeClass('active');

		reqItems.animate({opacity: 1}, duration).addClass('active');
	});

	// display or hide navigation of small screen
	$('.nav-for-small_button').on('click', function(e) {
		e.preventDefault();

		var body = $('body');

		if ( body.hasClass('nav-for-small-visible') ) {
			body.removeClass('nav-for-small-visible');
		}

		else {
			body.addClass('nav-for-small-visible');
		}
	});

	// remove class in body after change of window size for navigation hide
	$(window).on('resize', function() {
		var body = $('body');

		if ( Modernizr.mq('(min-width: 480px)') &&  body.hasClass('nav-for-small-visible') ) {
			body.removeClass('nav-for-small-visible');
		}
	});

	//scrolling of section
	scrollSection.init();

	//animation of section
	animateSection.init();

	// start slider
	slider.init();

	// start drag'n'drop
	dragNdrop.init();

	//load images from the server at the particular size of screen
	imagesAt1280px.init();
	imagesAt480px.init();
});

// define scroll of section
var scrollSection = (function() {

	return {

		init: function() {
			var _this = this;

			if (!window.location.hash) {
				_this.showSec('#main', false );

			} else {
				_this.showSec(window.location.hash, false);
			}

			$('.main-header_nav_link, .nav-for-small_panel_link').on('click', function(e) {
				e.preventDefault();

				if ($(this).closest('nav').hasClass('nav-for-small_panel')) {
					_this.showSec($(this).attr('href'), false);

				} else {
					_this.showSec($(this).attr('href'), true);
				}
			});

			$(window).on('scroll', function() {
				_this.checkSec();
			});
		},

		showSec: function(section, isAnimate) {
			var
				direction = section.replace(/#/, ''),
				reqSection = $('.scroll-section').filter('[data-section="' + direction + '"]'),
				reqSectionPos,
				mainHeaderNav = $('.main-header_nav'),
				mainHeaderNavHeight = mainHeaderNav.outerHeight(),
				navForSmallPanel = $('.nav-for-small_panel'),
				navForSmallPanelHeight = navForSmallPanel.outerHeight();

			if (Modernizr.mq('(min-width: 480px)')) {

				// if (mainHeaderNav.hasClass('fix')) {
					reqSectionPos = reqSection.offset().top - mainHeaderNavHeight;
				// }

				// else {
				// 	reqSectionPos = reqSection.offset().top - mainHeaderNavHeight;
				// }
			}

			else {
				reqSectionPos = reqSection.offset().top - navForSmallPanelHeight;
			}


			if (isAnimate) {
				$('body, html').animate({scrollTop: reqSectionPos}, 500);

			} else {
				$('body, html').scrollTop(reqSectionPos);
			}
		},

		checkSec: function() {
			$('.scroll-section').each(function() {
				var
					$this = $(this),
					topEdge = $this.offset().top,
					bottomEdge = topEdge + $this.outerHeight(),
					wScroll = $(window).scrollTop(),
					currentId,
					reqLink;

				if (topEdge < wScroll && bottomEdge > wScroll) {
					currentId = $this.data('section'),
					reqLink = $('.main-header_nav_link').filter('[href="#' + currentId + '"]');

					window.location.hash = currentId;
				}
			});
		}
	}
})();

// define animation of section
var animateSection = (function() {

	return {

		init: function() {
			var
				_this = this,
				classes = 	['.intro',
							'.destination_summary',
							'.set-ittinery_summary',
							'.contact h2',
							'.contact_form',
							'.contact_find',
							'.or',
							'.keep-in-touch'],
				animationType = ['bounceInLeft',
						    	'bounceInRight',
						    	'bounceInUp',
						    	'zoomIn',
						    	'fadeInLeft',
						    	'fadeInRight',
						    	'fadeIn',
						    	'flipInX'],
				classesJoinStr = classes.join(','),
				objForAnimate = {};

			for (var i = 0; i < classes.length; i++) {
				objForAnimate[classes[i]] = animationType[i];
			}

			if ( Modernizr.cssanimations && Modernizr.mq('(min-width: 768px)') ) {

			    $(classesJoinStr).css('opacity', '0');

			    _this.animateElements(objForAnimate);

			    $(window).on('scroll', function() {
				    _this.animateElements(objForAnimate);
				});
			}

			$(window).on('resize', function() {
				if ( Modernizr.mq('(max-width: 479px)') ) {
					$(classesJoinStr).css('opacity', '1');
				}
			});
		},

		animateElements: function(obj) {
			var
				elem,
				imagePos,
				topOfWindow;

			for (elem in obj) {
		     		imagePos = $(elem).offset().top,
					topOfWindow = $(window).scrollTop();

		      	if (imagePos < topOfWindow + 600) {
		        	$(elem).addClass(obj[elem]);
		      	}
			}
		}
	}
})();

// define loading images from the server at screen size more than 1280px
var imagesAt1280px = (function() {

	return {

		init: function() {
			var
				_this = this,
				alreadyWasSmall;

			if ( Modernizr.mq('(min-width: 1280px)') ) {
				_this.loadImages();

			} else {
				var alreadyWasSmall = true;
			}

			$(window).on('resize', function() {
				if (Modernizr.mq('(min-width: 1280px)') && alreadyWasSmall)  {
					_this.loadImages();

					alreadyWasSmall = false;
				}
			});
		},

		loadImages: function() {
			$.get('html_inc/destination-select.html', function(data) {
				$('.destination_summary').after(data);

				$('.destination_select figure').on('click', function() {
					var
						$this = $(this),
						container = $('.info_brief'),
						containerPos,
						slides = container.find('.slider_item'),
						picData = $this.data('pic'),
						reqSlide = slides.filter('[data-slide="' + picData + '"]');

					reqSlide.addClass('active').siblings().removeClass('active');

					window.slider.changeArticles(picData);

					containerPos = container.offset().top;

					$('body, html').animate({scrollTop: containerPos}, 500);
				});
			});
		}
	}
})();

// define loading images from the server at screen size more than 480px
var imagesAt480px = (function() {

	return {

		init: function() {
			var
				_this = this,
				alreadyWasSmall;

			if ( Modernizr.mq('(min-width: 480px)') ) {
				_this.loadImages();

			} else {
				alreadyWasSmall = true;
			}

			$(window).on('resize', function() {

				if ( Modernizr.mq('(min-width: 480px)') && alreadyWasSmall) {
					_this.loadImages();

					alreadyWasSmall = false;
				}
			});
		},

		loadImages: function() {
			var
				articlesList = $('.articles_list'),
				articles = 	articlesList.find('article'),
				reqArticle,
				reqImage,
				articlesClassName = ['elbrus',
									'blue-lakes',
									'nalchik',
									'dombay-ulgen',
									'alibeksky-waterfall',
									'teberda',
									'roses-valley',
									'pyatigorsk',
									'essentuki',
									'krasnaya-polyana',
									'psakho',
									'navalishinsky-canyon'];

			for ( var i = 0; i < articlesClassName.length; i++) {
				reqArticle = articles.filter('.article-' + articlesClassName[i]);

				$('<img src="img/info-' + articlesClassName[i] +'.jpg" alt="">')
					.insertAfter(reqArticle)
					.wrap('<figure></figure>');
			}
		}
	}
})();

// define drag'n'drop
var dragNdrop = (function() {

	return {
		init: function() {
			var
				_this = this,
				itemsDay = document.getElementsByClassName('item_day'),
				destList = document.getElementsByClassName('destination_list')[0],
				dragDests = destList.getElementsByClassName('drag-dest'),
				removeDest = document.getElementsByClassName('remove-dest');

			for (var i = 0; i < dragDests.length; i++) {
				dragDests[i].addEventListener('dragstart', _this.start);
				dragDests[i].addEventListener('dragend', _this.end);
			}

			for (var i = 0; i < itemsDay.length; i++) {
				itemsDay[i].addEventListener('dragover', _this.over);
				itemsDay[i].addEventListener('dragleave', _this.leave);
				itemsDay[i].addEventListener('drop', _this.drop);
			}

			for (var i = 0; i < removeDest.length; i++) {
				removeDest[i].addEventListener('click', _this.remove);
			}
		},

		// remove destination from selected list
		remove: function() {
			var
				$this = this,
				dragDest = $this.parentNode,
				itemDay = dragDest.parentNode,
				dragDests,
				dropDest = itemDay.getElementsByClassName('drop-dest')[0],
				listItem = itemDay.parentNode,
				listItems = document.getElementsByClassName('list_item'),
				listItemsHeader,
				selectedList = listItem.parentNode,
				dragDestData = dragDest.getAttribute('data-destination'),
				destItem = document.getElementById(dragDestData),
				listInner = destItem.getElementsByTagName('ul')[0],
				noDest;

			listInner.appendChild(dragDest);

			dragDests = itemDay.getElementsByClassName('drag-dest');

			if (dragDests.length === 1) {
				dropDest.style.display = 'block';
			}

			listItemsHeader = selectedList.getElementsByTagName('h4');

			for (var i = 0; i < selectedList.children.length; i++) {
				listItemsHeader[i].textContent = 'Day ' + (selectedList.children.length - i);
			}

			if (itemDay.children.length < 3) {

				itemDay.addEventListener('dragleave', dragNdrop.leave);
				itemDay.addEventListener('dragover', dragNdrop.over);
				itemDay.addEventListener('drop', dragNdrop.drop);
			}


			if ( (noDest = destItem.getElementsByClassName('no_dest')[0] ) && listInner.children.length > 0 ) {

				destItem.removeChild(noDest);
			}

		},

		start: function(e) {
			e.dataTransfer.setData('Text', e.target.id);
		},

		over: function(e) {
			var
				$this = this,
				dropDest = $this.getElementsByClassName('drop-dest')[0];
				yellowBright = '#fff772';

			e.preventDefault();

			dropDest.style.backgroundColor = yellowBright;
		},

		leave: function(e) {
			var
				$this = this,
				dropDest = $this.getElementsByClassName('drop-dest')[0];
				brownVeryLight = '#fbf6a3';

			e.preventDefault();

			dropDest.style.backgroundColor = brownVeryLight;
		},

		drop: function(e) {
			var
				$this = this,
				reqData = e.dataTransfer.getData('Text'),
				dragDest = document.getElementById(reqData),

				itemDay,
				dragDests,
				dropDestFrom,

				dropDest = $this.getElementsByClassName('drop-dest')[0],
				listItem = $this.parentNode,
				selectedList = listItem.parentNode,
				brownVeryLight = '#fbf6a3',
				dropDestCopy,
				dragDestRemove,
				listItemCopy,
				listItemsHeader,
				itemDayCopy;

			// for correct work in Firefox
			e.preventDefault();

			if (dragDest.parentNode.className === 'item_day') {
				itemDay = dragDest.parentNode;
				dragDests = itemDay.getElementsByClassName('drag-dest');
				dropDestFrom = itemDay.getElementsByClassName('drop-dest')[0];

				if (dragDests.length === 2) {
					dropDestFrom.style.display = 'block';
				}
			}



			$this.insertBefore(dragDest, dropDest);

			dropDest.style.backgroundColor = brownVeryLight;

			if ($this.children.length > 2) {

				dropDestCopy = dropDest.cloneNode(true);

				dropDest.style.display = 'none';

				if (selectedList.children.length < 3) {

					listItemCopy = listItem.cloneNode(true);

					itemDayCopy = listItemCopy.getElementsByClassName('item_day')[0];

					itemDayCopy.innerHTML = '';

					itemDayCopy.appendChild(dropDestCopy);

					selectedList.insertBefore(listItemCopy, listItem);

					listItemsHeader = selectedList.getElementsByTagName('h4');

					for (var i = 0; i < selectedList.children.length; i++) {
						listItemsHeader[i].textContent = 'Day ' + (selectedList.children.length - i);
					}
				}
			}
		},

		end: function(e) {
			var
				$this = this,
				itemsDay = document.getElementsByClassName('item_day'),
				destinationList = document.getElementsByClassName('destination_list')[0],
				listInner = destinationList.getElementsByTagName('ul'),
				noDest;

			e.preventDefault();

			for (var i = 0; i < itemsDay.length; i++) {

				if (itemsDay[i].children.length > 2) {

					itemsDay[i].removeEventListener('dragleave', dragNdrop.leave);
					itemsDay[i].removeEventListener('dragover', dragNdrop.over);
					itemsDay[i].removeEventListener('drop', dragNdrop.drop);
				}

				else {
					itemsDay[i].addEventListener('dragleave', dragNdrop.leave);
					itemsDay[i].addEventListener('dragover', dragNdrop.over);
					itemsDay[i].addEventListener('drop', dragNdrop.drop);
				}
			}

			for (var i = 0; i < listInner.length; i++) {

				if ( listInner[i].children.length === 0 && !(listInner[i].parentNode.lastElementChild.classList.contains('no_dest')) ) {

					noDest = document.createElement('p');

					noDest.classList.add('no_dest');

					listInner[i].parentNode.appendChild(noDest);

					noDest.innerHTML = 'Destinations no more. Choose another direction of the ittinery.';
				}
			}
		}
	}

})();

// define slider
var slider = (function() {

	// define flag for correct work of animation
	var flag = true;

	return {
		init: function() {
			var _this = this;

			_this.displayOrHideArticles();

			$('.conrol_button').on('click', function(e) {
				e.preventDefault();

				var
					$this = $(this),
					slides = $this.closest('.slider').find('.slider_item'),
					activeSlide = slides.filter('.active'),
					nextSlide = activeSlide.next(),
					prevSlide = activeSlide.prev(),
					firstSlide = slides.first(),
					lastSlide = slides.last(),
					movableSlideId;

				// determine what button is clicked
				if ($this.hasClass('conrol_button_next')) {

					if (nextSlide.length) {
						movableSlideId = _this.moveSlide(nextSlide, 'forward');

						_this.changeArticles(movableSlideId);

					} else {
						movableSlideId = _this.moveSlide(firstSlide, 'forward');

						_this.changeArticles(movableSlideId);
					}

				} else {

					if (prevSlide.length) {
						movableSlideId = _this.moveSlide(prevSlide, 'backward');

						_this.changeArticles(movableSlideId);

					} else {
						movableSlideId = _this.moveSlide(lastSlide, 'backward');

						_this.changeArticles(movableSlideId);
					}
				}
			});

			$('.switch_button').on('click', function(e) {
				e.preventDefault();

				var
					$this = $(this),
					duration = 300,
					articlesList = $('.articles_list'),
					articles = articlesList.find('.articles_item article'),
					container = $('.detail_articles'),
					containerPos = container.offset().top,
					switchButtonPic = $this.find('.fa'),
					infoBrief = $('.info_brief'),
					infoBriefPos = infoBrief.offset().top;

				articlesList.slideToggle(duration);

				if ( switchButtonPic.hasClass('fa-chevron-down') ) {
					$('body, html').animate({scrollTop: containerPos - 70}, 500);
					// articles.css('background-color', 'rgba(255, 255, 255, .9)');

				} else {
					$('body, html').animate({scrollTop: infoBriefPos - 70}, 500);
				}

				switchButtonPic.toggleClass('fa-chevron-down fa-chevron-up');
			});
		},

		moveSlide: function(slide, direction) {
			var
				slider = slide.closest('.slider'),
				slides = slider.find('.slider_item'),
				activeSlide = slides.filter('.active'),
				movableSlide,
				slideWidth = slides.width(),
				duration = 300,
				reqCssPosition = 0,
				reqSlideStrafe = 0;

			if (flag) {

				flag = false;

				// determine position of slides
				if (direction === 'forward') {
					reqCssPosition = slideWidth,
					reqSlideStrafe = -slideWidth;

				} else if (direction === 'backward') {
					reqCssPosition = -slideWidth,
					reqSlideStrafe = slideWidth;
				}

				// move slides
				slide.css('left', reqCssPosition).addClass('inslide');

				movableSlide = slides.filter('.inslide');

				activeSlide.animate({left: reqSlideStrafe}, duration);

				movableSlide.animate({left: 0}, duration, function() {

					$this = $(this);

					activeSlide.css('left', '0').removeClass('active');

					$this.toggleClass('inslide active');

					flag = true;
				});

				return movableSlide.data('slide');
			}
		},

		displayOrHideArticles: function() {
			var
				articlesList = $('.articles_list'),
				switchButton = $('.switch_button'),
				switchButtonPic = switchButton.find('.fa'),
				wasSmall,
				wasBig;

			if ( Modernizr.mq('(max-width: 479px)') ) {
				wasSmall = true;
				wasBig = false;

			} else {
				articlesList.hide();

				wasSmall = false;
				wasBig = true;
			}

			$(window).on('resize', function() {

				if ( Modernizr.mq('(min-width: 480px)') && wasSmall) {
					articlesList.hide();

					wasSmall = false;
					wasBig = true;

				} else if ( Modernizr.mq('(max-width: 479px)') && wasBig) {
					articlesList.show();

					wasBig = false;
					wasSmall = true;

					if ( switchButtonPic.hasClass('fa-chevron-up') ) {
						switchButtonPic.toggleClass('fa-chevron-up fa-chevron-down');
					}
				}
			});
		},

		// search and display require articles
		changeArticles: function(slideId) {
			var
				articles = $('.destination_info').find('.articles_item');
				reqArticles = articles.filter('[data-articles="' +  slideId +'"]');

			reqArticles.addClass('active')
					   .siblings()
					   .removeClass('active');
		}
	}

})();

