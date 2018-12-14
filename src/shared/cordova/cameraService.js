angular.module('verklizan.umox.mobile.shared.cordova').factory('cameraService',
[
    '$rootScope', '$q', 'cordovaReady',
    function ($rootScope, $q, cordovaReady) {
        'use strict';

        var defferedCameraImage;
        var cameraOptions;
        var cameraService = {};

        cameraService.getPicture = function (options) {
            defferedCameraImage = $q.defer();
            cameraOptions = options;

            cordovaReady.then(cameraSuccessCallback).catch(cameraErrorCallback);

            return defferedCameraImage.promise;
        };

        var cameraSuccessCallback = function () {
            var resolvedOptions = resolveOptions(cameraOptions);

            navigator.camera.getPicture(function (imageData) {
                $rootScope.$apply(function () { defferedCameraImage.resolve(imageData); });
            }, function (error) {
                $rootScope.$apply(function () { defferedCameraImage.reject(error); });
            }, resolvedOptions);

        }

        var cameraErrorCallback = function (message) {
            message = message || "camera is currently unavailable";
            return defferedCameraImage.reject(message);
        }

        var resolveOptions = function (options) {
            var resolvedOptions = options || {};
            resolvedOptions.quality = 49; //override for iOS to prevent memory problems
            resolvedOptions.destinationType = options.returnAsBytes === true ? Camera.DestinationType.DATA_URL : Camera.DestinationType.FILE_URI;

            return resolvedOptions;
        }

        return cameraService;
    }
]);
