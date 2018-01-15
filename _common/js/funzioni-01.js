
var galleryAnimated = false;

// Plugin @RokoCB :: Return the visible amount of px of any element currently in viewport.
// stackoverflow.com/questions/24768795/
// jsfiddle.net/RokoCB/tw6g2oeu/7/
;(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el){
       function visPx(){
         var H = $(this).height() / 1.3, // <-- Modifica Fabri
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));
       } visPx();
       $(win).on("resize scroll", visPx);
     });
  };
}(jQuery, window));


// Scroll to element
function scrolla(id, vel) {
    animazione = true;
    if (vel == null)
        vel = 1200;
    var puntoArrivo = $('div.anchor[data-anchor=' + id + ']').offset().top - altezzaHeader;
    if (vel == 0) {
        $('body, html').scrollTop(puntoArrivo);
    } else {
        $('body, html').animate({
            scrollTop: puntoArrivo
        }, vel, 'easeInOutQuart', function () {
            animazione = false;
        });
    }
}

function checkLandscape() {
	if (deviceWidth < 1024 && isMobile()) {
		if (deviceWidth > deviceHeight) {
			$(".rotate-screen-container").fadeIn(500);
			document.addEventListener("touchstart", dontScroll);
			document.addEventListener("touchmove", dontScroll);
		} else {
			$(".rotate-screen-container").fadeOut(500);
			document.removeEventListener("touchstart", dontScroll);
			document.removeEventListener("touchmove", dontScroll);
		}
	}
}

function dontScroll(e) {
	e.preventDefault();
}

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
	}
}

function fadeBlurHeader() {
    if($(window).scrollTop() > (deviceHeight/2)) {
        $('.header').addClass('blurred');
    } else {
        $('.header').removeClass('blurred');
    }
}

function resizeHeader() {
    if(deviceWidth < 768) {
        $('.header').height(deviceHeight);
    } else if(deviceWidth >= 768 && deviceWidth <= 1024) {
        $('.header').height(deviceHeight + (deviceHeight/10));
    } else if(deviceWidth > 1024 && deviceWidth <= 1600) {
        $('.header').height(deviceHeight + (deviceHeight/6));
    } else {
        $('.header').height(deviceHeight + (deviceHeight/4));
    }
}

function checkFixedNav() {
    if ($(window).scrollTop() >= 200) {
       $('.nav').addClass('fixed');
    } else {
       $('.nav').removeClass('fixed');
    }
}

var deviceWidth, deviceHeight;

(function ($) {

    $(window).resize(function () {
        deviceWidth = $(window).width();
        deviceHeight = $(window).height();

        checkLandscape();
        resizeHeader();
    });

    $(window).scroll(function () {
        fadeBlurHeader();
        checkFixedNav();
    });

})(jQuery);


$(document).ready(function () {

    deviceWidth = $(window).width();
    deviceHeight = $(window).height();

    checkLandscape();
    resizeHeader();
    checkFixedNav();

    // Include menù
    $('#menu').load('../menu-' + pageLang + '.html', function() {
        $('.col a').each(function(i, el){
            if($(el).hasClass('active') && deviceWidth > 1024){
                $(el).on('mouseover', function() {
                    $('.menu .letter').removeClass('hover');
                    $('.menu .letter.l_' + $(el).data('letter')).addClass('hover');
                }).on('mouseleave', function() {
                    $('.menu .letter').removeClass('hover');
                })
            }
        });
    });

    // Apertura e chiusura menù
    $('.menu-toggle').click(function () {
        if($('#menu').hasClass('open')) {
            menuAnimation('out');
        } else {
            menuAnimation('in');
        }
        if($('#share_layer').hasClass('open')) {
            shareAnimation('out');
        }
    });
    $('.share-toggle').click(function () {
        if($('#share_layer').hasClass('open')) {
            shareAnimation('out');
        } else {
            shareAnimation('in');
        }
        if($('#menu').hasClass('open')) {
            menuAnimation('out');
        }
    });

    // Plugin jQuery slider
    $(".products .prod .slider").slider({
        min: 1,
        max: 8,
        slide: function( event, ui ) {
            $(".products .prod .imgs img").hide();
            $(".products .prod .imgs img:nth-child(" + ui.value + ")").css('display','block');
        }
    });

    // Slick gallery
    $('.palmares .slider').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 641,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.gallery .slider').slick({
        infinite: false,
        lazyLoad: 'ondemand'
    });

    // Preload del sito
    var preload_i = 0;
    $('body').imagesLoaded()
        .always( function( instance ) {

            $('.loading_layer .logo img').delay(400).fadeOut();
            $('.loading_layer .w').delay(600).animate({
                width: '0px',
                marginLeft: '0px'
            }, 500, 'easeInOutQuart');

            $('.loading_layer').delay(1400).fadeOut(function() {

                fadeBlurHeader();
                setTimeout(function() {
                    $('.article_title .linea').css('opacity','1');
                },500);
            });
            setTimeout(function() {

                // Wow.js init
                var wow = new WOW({
                    offset: deviceHeight / 4
                });
                wow.init();

                // Ingresso titoli
                $(".titleAnimation").inViewport(function(px){
                    if(px && !$(this).attr('animated')) {
                        $(this).attr('animated','true');
                        titleAnimation($(this));
                    }
                });

                // Ingresso gallery
                $(".galleryAnimation").inViewport(function(px){
                    if(px && !galleryAnimated) {
                        galleryAnimated = true;
                        galleryAnimation();
                    }
                });

            }, 1000);
        })
        .progress( function( instance, image ) {
            preload_i++;
            perc = Math.round((preload_i*100) / instance.images.length);
            $('.loading_layer .w .ww').css('width', perc + '%' );
        });


    // Mosaico foto draggabili (solo mobile)
    $cards = $('.mosaico_foto.mobile img');
    $cards.swipe( {
		swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {

			// Here we can check the:
			// phase : 'start', 'move', 'end', 'cancel'
			// direction : 'left', 'right', 'up', 'down'
			// distance : Distance finger is from initial touch point in px
			// duration : Length of swipe in MS
			// fingerCount : the number of fingers used

            dir_x = 0;

            if(direction == "left") {
                if(phase == "move") {
                    if(direction == "left") {
                        dir_x = "-=" + (distance / 25);
                        dir_rot = "-=" + (distance / 130) + "deg";
                    } else {
                        dir_x = "+=" + (distance / 25);
                        dir_rot = "+=" + (distance / 130) + "deg";
                    }
                    TweenMax.set(this, {
                        x: dir_x + "px",
                        rotation: dir_rot,
                        opacity: 1 - Math.min(1, Math.abs(.002 * distance))
                    });
                }

                if(phase == "end") {
                    num_foto_hidden++;
                    if(direction == "left") {
                        dir_x = "-=" + deviceWidth + "px";
                        dir_rot = "-=90deg";
                    } else {
                        dir_x = "+="+ deviceWidth +"px";
                        dir_rot = "+=90deg";
                    }
                    TweenMax.to(this, 1, {
                        x: dir_x,
                        rotation: dir_rot,
                        opacity: 0
                    }, checkHiddenFoto());
    			}

    			if(phase == "cancel") {
                    TweenMax.to(this, 0.5, {
                        x: "0px",
                        rotation: "0deg",
                        opacity: 1
                    });
    			}
            }
		},
		threshold:100,
		maxTimeThreshold:2500,
		allowPageScroll:"vertical",
		fingers:'all'
	});

});


// Check hidden foto mosaico (solo mobile) *************************************
var dir_x = 0;
var num_foto_hidden = 0;

function checkHiddenFoto() {
    if(num_foto_hidden == 3) {
        $('.mosaico_foto.mobile').fadeOut();
    }
}


// Animazioni ******************************************************************
var menuTimeline;
function menuAnimation(mode) {
    if(mode == 'in') {
        if(!menuTimeline) {
            menuTimeline = new TimelineMax({
                onReverseComplete:function() {
                    menuTimeline.kill();
                    $('#menu').toggleClass('open');
                    $('body').toggleClass('menuOn');
                }
            });
            menuTimeline.staggerFromTo($('#menu ul li'), 0.4,
                { alpha:0, y: "+=80px", ease:Quad.easeInOut },
                { alpha:1, y: "0", ease:Quad.easeInOut },
            0.1).delay(0.4);
        } else {
            setTimeout(function() {
                menuTimeline.play();
            }, 400);
        }
        TweenMax.to($('.lang_switch'), 0.5, { opacity:1 }).delay(1.5);
        $('#menu').toggleClass('open');
        $('body').toggleClass('menuOn');
    } else {
        menuTimeline.reverse();
        TweenMax.to($('.lang_switch'), 0.5, { opacity:0 });
    }
    $('.menu-toggle').toggleClass('open');
}

var shareTimeline;
function shareAnimation(mode) {
    if(mode == 'in') {
        if(!shareTimeline) {
            shareTimeline = new TimelineMax({
                onReverseComplete:function() {
                    shareTimeline.kill();
                    $('#share_layer').toggleClass('open');
                    $('body').toggleClass('menuOn');
                }
            });
            shareTimeline.staggerFromTo($('#share_layer ul li'), 0.4,
                { alpha:0, y: "+=80px", ease:Quad.easeInOut },
                { alpha:1, y: "0", ease:Quad.easeInOut },
            0.1).delay(0.4);
        } else {
            setTimeout(function() {
                shareTimeline.play();
            }, 400);
        }
        TweenMax.to($('#share_layer span'), 0.5, { opacity:1 });
        $('#share_layer').toggleClass('open');
        $('body').toggleClass('menuOn');
    } else {
        shareTimeline.reverse();
        TweenMax.to($('#share_layer span'), 0.5, { opacity:0 });
    }
}

function galleryAnimation() {
    TweenMax.staggerFromTo($('.galleryAnimation'), 1.4,
        { alpha:0, y: "+=100px", ease:Strong.easeInOut },
        { alpha:1, y: "0", ease:Strong.easeInOut },
    0.3);
}

function titleAnimation(item) {
	var $animText = item;
    $animText.find('span.line').each(function(i, el) {
        $(el).html($(el).html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
        TweenMax.staggerFromTo($(el).find("span"), 0,
            { css:{ className:"animated" } },
            { css:{ className:"animated" } },
        0.1);
    });
    $animText.css('opacity','1');
}
