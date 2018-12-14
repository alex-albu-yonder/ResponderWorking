(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('splashScreenService',
    [
        'cordovaReady', function (cordovaReady) {

            var splashScreenService = {};

            splashScreenService.turnOfSplashScreen = function () {
                cordovaReady.then(function () {
                    navigator.splashscreen.hide();
                });
            };

            splashScreenService.turnOnSplashScreen = function () {
                cordovaReady.then(function () {
                    navigator.splashscreen.show();
                });
            }

            return splashScreenService;
        }
    ]);

})();