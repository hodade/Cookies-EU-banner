/**
 * Cookies EU banner v1.2.10 - Manage display of banner to accept/reject cookies from tracking services like Google Analytics
 * ------------------------
 * @link http://alex-d.github.io/Cookies-EU-banner/
 * @license MIT
 * @author Alex-D
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

/**
 * Cookies EU banner v1.2.10 - Manage display of banner to accept/reject cookies from tracking services like Google Analytics
 * ------------------------
 * @link http://alex-d.github.io/Cookies-EU-banner/
 * @license MIT
 * @author Alex-D
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

/**
 * Cookies EU banner v1.2.10 - Manage display of banner to accept/reject cookies from tracking services like Google Analytics
 * ------------------------
 * @link http://alex-d.github.io/Cookies-EU-banner/
 * @license MIT
 * @author Alex-D
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

; // jshint ignore:line
(function (root, factory, undefined) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        // root is window
        root.CookiesEuBanner = factory();
    }
}(window, function () {
    'use strict';

    var CookiesEuBanner,
        document = window.document;

    CookiesEuBanner = function () {
        if (!(this instanceof CookiesEuBanner)) {
            console.log('instanceof');
            return new CookiesEuBanner();
        }

        this.cookieTimeout = 33696000000; // 13 months in milliseconds
        this.bots = /bot|googlebot|crawler|spider|robot|crawling/i;
        this.cookieName = 'hasConsent';
        this.trackingCookiesNames = [ '__utma', '__utmb', '__utmc', '__utmt', '__utmv', '__utmz', '_ga', '_gat', 'PHPSESSID' ];
        this.waitAccept = true;
        this.init();
    };

    CookiesEuBanner.prototype = {
        init: function () {
            // Do nothing if it is a bot
            // If DoNotTrack is activated, do nothing too
            if (this.isBot() || !this.isToTrack()) {
                return false;
            }

            // If it's not a bot, no DoNotTrack and not already accept : show banner
            // this.showBanner();
            this.showCover();
        },

        setLaunchFunction: function (f) {
            this.launchFunction = f;
        },

        setLaunchFunctionReject: function (f) {
            this.launchFunctionReject = f;
        },

        showCover: function () {
            var _this = this,
                cover = document.getElementById('cookies-eu-cover');
            if (cover) {
                cover.style.display = 'block';
                this.addEventListener(cover, 'click', function () {
                    _this.showBanner();
                });
            }
        },

        /*
         * Show banner at the top of the page
         */
        showBanner: function () {
            var _this = this,
                banner = document.getElementById('cookies-eu-banner'),
                cover = document.getElementById('cookies-eu-cover'),
                rejectButton = document.getElementById('cookies-eu-reject'),
                acceptButton = document.getElementById('cookies-eu-accept'),
                moreLink = document.getElementById('cookies-eu-more');

            banner.style.display = 'block';

            if (moreLink) {
                this.addEventListener(moreLink, 'click', function () {
                    _this.deleteCookie(_this.cookieName);
                });
            }

            if (acceptButton) {
                this.addEventListener(acceptButton, 'click', function () {
                    _this.hideBanner();
                    _this.hideCover();
                    _this.setCookie(_this.cookieName, true);
                    _this.launchFunction();
                });
            }

            if (rejectButton) {
                this.addEventListener(rejectButton, 'click', function () {
                    _this.hideBanner();
                    _this.showCover();
                    _this.setCookie(_this.cookieName, false);
                    _this.deleteTrackingCookies();
                    _this.launchFunctionReject();
                });
            }
        },

        hideBanner: function() {
            var banner = document.getElementById('cookies-eu-banner');
            banner.style.display = 'none';
        },

        hideCover: function() {
            var cover = document.getElementById('cookies-eu-cover');
            cover.style.display = 'none';
        },

        /*
         * Check if user already consent
         */
        hasConsent: function () {
            if (document.cookie.indexOf(this.cookieName + '=true') > -1) {
                return true;
            } else if (document.cookie.indexOf(this.cookieName + '=false') > -1) {
                return false;
            }

            return null;
        },

        /*
         * Detect if the visitor is a bot or not
         * Prevent for search engine take the cookie
         * alert message as main content of the page
         */
        isBot: function () {
            return this.bots.test(navigator.userAgent);
        },

        /*
         * Check if DoNotTrack is activated
         */
        isToTrack: function () {
            var dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
            return (dnt !== null && dnt !== undefined) ? (dnt && dnt !== 'yes' && dnt !== 1 && dnt !== '1') : true;
        },

        /*
         * Delete existent tracking cookies
         */
        deleteTrackingCookies: function () {
            var _this = this;
            this.trackingCookiesNames.map(function (cookieName) {
                _this.deleteCookie(cookieName);
            });
        },

        /*
         * Create/update cookie
         */
        setCookie: function (name, value) {
            var date = new Date();
            date.setTime(date.getTime() + this.cookieTimeout);

            document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
        },

        /*
         * Delete cookie by changing expire
         */
        deleteCookie: function (name) {
            var hostname = document.location.hostname;
            if (hostname.indexOf('www.') === 0) {
                hostname = hostname.substring(4);
            }
            document.cookie = name + '=; domain=.' + hostname + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        },

        addEventListener: function (DOMElement, evnt, callback) {
            if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
                DOMElement.addEventListener(evnt, callback);
            } else if (DOMElement.attachEvent) { // For IE 8 and earlier versions
                DOMElement.attachEvent('on' + evnt, callback);
            }
        }
    };

    return CookiesEuBanner;
}));
