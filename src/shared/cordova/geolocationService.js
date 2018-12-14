(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('geolocationService',
    [
        '$rootScope', '$q',
        function ($rootScope, $q) {

            // this service does not need a cordovaReady event listener.
            // navigator.geolocation.getCurrentPosition can be used in almost any browser.
            return {
                getCurrentPosition: function (options) {
                    console.log("getCurrentPosition called");
                    var defferedGeolocation = $q.defer();

                    navigator.geolocation.getCurrentPosition(function (position) {
                        defferedGeolocation.resolve(position);
                    }, function (error) {
                        defferedGeolocation.reject(error);
                    },
                        options);

                    return defferedGeolocation.promise;
                }
            };
        }
    ]);

})();