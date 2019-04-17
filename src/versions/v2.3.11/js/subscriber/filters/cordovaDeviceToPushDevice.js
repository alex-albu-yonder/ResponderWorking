angular.module('verklizan.umox.mobile.subscriber').filter('cordovaDeviceToPushDevice',
    function (domainEnums, deviceService, devicePlatformConstants) {
        'use strict';
        return function (cordovaDevice) {
            switch (cordovaDevice) {
                case devicePlatformConstants.iOS:
                    return domainEnums.operatingSystemType.iOSFcm;
                case devicePlatformConstants.Android:
                    return domainEnums.operatingSystemType.AndroidFcm;
                case devicePlatformConstants.WP7:
                case devicePlatformConstants.WP8:
                    return domainEnums.operatingSystemType.WindowsPhone;
                default:
                    return domainEnums.operatingSystemType.Unknown;
            }
        }

    }
);
