(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('cordovaReady',
    [
        '$q', 'cordovaIsPresent', function ($q, cordovaIsPresent) {
            var defferedCordovaLoaded = $q.defer();

            if (cordovaIsPresent) {
                console.log("running on mobile device");

                document.addEventListener('deviceready', onDeviceReady, false);
            } else {
                console.log("running in browser");
                defferedCordovaLoaded.reject();
            }

            function onDeviceReady() {
                defferedCordovaLoaded.resolve();
            }

            return defferedCordovaLoaded.promise;
        }
    ]);

})();