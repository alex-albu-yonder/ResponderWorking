angular.module('verklizan.umox.mobile.common').factory('appVersionLoader',
    function ($window, $q, cachedLocalStorageService, localStorageKeys, supportingDataManagementServiceProxy, config, verklizanConfig, httpErrorCode, splashScreenService) {
        'use strict';

        function Version(versionString) {
            var arrayOfVersionNumberStrings = getArrayOfStringVersionNumbers(versionString);

            this.versionArray = [];

            this.compareTo = function (otherVersion) {
                var otherVersionArray = otherVersion.versionArray;

                for (var versionNumberIndex = 0; versionNumberIndex < this.versionArray.length; versionNumberIndex++) {
                    var thisVersionNumber = this.versionArray[versionNumberIndex];
                    var otherVersionNumber = otherVersionArray[versionNumberIndex];

                    if (thisVersionNumber < otherVersionNumber) {
                        return -1;
                    }

                    if (thisVersionNumber > otherVersionNumber) {
                        return 1;
                    }
                }
                return 0;
            }

            this.toString = function () {
                var stringedVersion = "v";
                stringedVersion += this.versionArray.join(".");
                return stringedVersion;
            }

            for (var i = 0; i < arrayOfVersionNumberStrings.length; i++) {
                var versionStringPart = arrayOfVersionNumberStrings[i];

                if (isNumeric(versionStringPart)) {
                    var versionNumber = parseInt(versionStringPart);

                    this.versionArray.push(versionNumber);
                }
            }

            function getArrayOfStringVersionNumbers(versionStringToConvert) {
                if (versionStringToConvert[0] === "v") {
                    versionStringToConvert = versionStringToConvert.substr(1);
                }
                return versionStringToConvert.split('.');
            }
        }

        var appVersionLoader = {};

        appVersionLoader.tryLoadingCorrectAppVersion = function () {
            return getWebServiceVersion().then(function (version) {
                var serviceContractVersion = new Version(version.ServiceContractVersion);

                var localDesiredVersion = getSuitedLocalVersion(serviceContractVersion);

                console.log(JSON.stringify(localDesiredVersion));

                return loadVersion(localDesiredVersion);
            });
        }

        var getWebServiceVersion = function () {
            return supportingDataManagementServiceProxy.readContractVersion("umo app");
        }

        // Rules for the suited version:
        // - Every local version must be below or equal the web service version
        // - If none if found, use the earliest
        var getSuitedLocalVersion = function (webServiceVersion) {
            var supportedServices = getSupportedServices();

            var bestOptionSoFar;

            for (var i = 0; i < supportedServices.length; i++) {
                var supportedVersion = supportedServices[i];

                if (supportedVersionIsUsableForWebService(supportedVersion, webServiceVersion)) {
                    if (typeof bestOptionSoFar === "undefined") {
                        bestOptionSoFar = supportedVersion;
                    }
                    else if (suppportedVersionIsBetterOption(supportedVersion, bestOptionSoFar)) {
                        bestOptionSoFar = supportedVersion;
                    }
                }
            }

            if (typeof bestOptionSoFar === "undefined") {
                bestOptionSoFar = supportedServices[0];
            }

            return bestOptionSoFar;
        }

        var supportedVersionIsUsableForWebService = function (supportedVersion, webServiceVersion) {
            var versionComparison = supportedVersion.compareTo(webServiceVersion);

            return versionComparison <= 0;
        }

        var suppportedVersionIsBetterOption = function (supportedVersion, bestOptionSoFar) {
            return bestOptionSoFar.compareTo(supportedVersion) < 0;
        }

        var getSupportedServices = function () {
            var supportedVersions = [];

            for (var i = 0; i < config.supportedServices.length; i++) {
                var versionSupported = new Version(config.supportedServices[i]);
                supportedVersions.push(versionSupported);
            }

            return supportedVersions;
        }

        var loadVersion = function (version) {
            saveLastUsedServiceVersion(version);

            if (newVersionIsDifferentFromCurrentVersion(version)) {
                console.log("already on the correct version");
                return $q.reject();
            } else {
                splashScreenService.turnOnSplashScreen();
                $window.location.replace("../../versions/" + version + "/index.html");
                return $q.when();
            }
        }

        var newVersionIsDifferentFromCurrentVersion = function (version) {
            return typeof verklizanConfig.serviceVersionSupported !== "undefined" &&
                verklizanConfig.serviceVersionSupported === version.toString();
        }

        var saveLastUsedServiceVersion = function (localVersion) {
            cachedLocalStorageService.setLocalStorageItem(localStorageKeys.lastUsedAppVersion, localVersion);
        }

        var isNumeric = function (string) {
            return !isNaN(string);
        }

        return appVersionLoader;
    }
);