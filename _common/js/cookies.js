
$(document).ready(function () {
    if (window.addEventListener) {
        window.addEventListener("load", checkCookie, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", checkCookie);
    } else if (window.onLoad) {
        window.onload = checkCookie;
    }

    $('#infoCookie .layer_click').click(cookie_accepted);
    $('#infoCookie a.close').click(cookie_accepted);

    checkCookie();
});

function openCookiePolicy() {
    $.fancybox({
        'type': 'iframe',
        'href': '/cookie-policy.html',
        'iframe': {
            scrolling: 'auto',
            preload: true
        }
    });
}

//$(window).scroll(cookie_accepted);

function checkCookie() {
    var valore = getCookie("colmar_incasodi_mag_cookie");
    if (valore == "" || valore == undefined) {
        //$('#infoCookie').show();
    } else {
        $('#infoCookie').hide();
    }
}

function setCookie(cname,cvalue,exdays) {
	var expires = exdays * 1000 * 60 * 60 * 24;
	var today= new Date();
	var expires_date = new Date( today.getTime() + (expires) );
	var expiresDate = expires_date.toGMTString();
	document.cookie = cname + "=" + cvalue + "; expires= " + expiresDate + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function cookie_accepted() {
    if (getCookie("colmar_incasodi_mag_cookie") == "" || getCookie("colmar_incasodi_mag_cookie") == undefined) {
        setCookie("colmar_incasodi_mag_cookie", "2", 20 * 365);
        $('#infoCookie').hide();
    }
}
