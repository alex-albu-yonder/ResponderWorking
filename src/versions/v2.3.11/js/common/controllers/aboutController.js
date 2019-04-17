angular.module('verklizan.umox.mobile.common').controller('aboutController',
    function ($scope, $timeout, config, userSettingsService, verklizanConfig, navigationService) {
        'use strict';
        var debugModeTimerResetInMs = 5000;

        $scope.appIsDebugBuild = config.debug === true;
        $scope.isInDebugMode = userSettingsService.getIsInDebugMode();
        $scope.appVersion = config.version;
        $scope.serviceVersion = verklizanConfig.serviceVersionSupported;
        $scope.appLogoClickedCount = 0;

        $scope.clickedAppLogo = function () {
            if ($scope.appLogoClickedCount === 0) {
                startCounterResetTimer();
            }

            $scope.appLogoClickedCount++;

            if ($scope.appLogoClickedCount >= 5) {
                userSettingsService.setIsInDebugMode(true);
                $scope.isInDebugMode = true;
            }
        }

        $scope.navigateToDebugPage = function () {
            navigationService.navigate("/debugSettings");
        }


        function startCounterResetTimer() {
            $timeout(function () {
                $scope.appLogoClickedCount = 0;
            }, debugModeTimerResetInMs);
        }
    }
);
