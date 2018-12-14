angular.module('verklizan.umox.mobile.shared.cordova').factory('cordovaIsPresent', [
    function () {
        'use strict';

        var hasCordovaVariable = (window.cordova || window.PhoneGap || window.phonegap);
        var usesCorrectProtocol = /^file:\/{3}[^\/]/i.test(window.location.href);
        var hasCorrectUserAgent = /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);

        var cordovaIsPresent = hasCordovaVariable && usesCorrectProtocol && hasCorrectUserAgent;

        return !!cordovaIsPresent;
    }
]);
