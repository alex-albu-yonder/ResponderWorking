(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('versionService',
    [
        '$q', 'cordovaReady',
        function ($q, cordovaReady) {

            var versionService = {
                getVersionInfo: function () {
                    var defferedVersion = $q.defer();

                    cordovaReady.then(function () {
                        getVersionFromCordova(defferedVersion);
                    }).catch(function () {
                        defferedVersion.reject("No app version in web browser");
                    });

                    return defferedVersion.promise;
                }
            };

            var getVersionFromCordova = function (defferedVersion) {
                cordova.getAppVersion(function (version) {
                    defferedVersion.resolve(version);
                }, function (error) {
                    defferedVersion.reject(error);
                });
            }

            return versionService;
        }
    ]);

})();