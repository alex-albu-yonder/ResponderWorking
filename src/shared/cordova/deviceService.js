(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('deviceService',
    [
        'cordovaReady', function (cordovaReady) {

            var deviceFactory = {};

            cordovaReady.then(function () {
                deviceFactory.platform = device.platform;
                deviceFactory.model = device.model;
                deviceFactory.version = device.version;
            });

            return deviceFactory;
        }
    ]);

})();