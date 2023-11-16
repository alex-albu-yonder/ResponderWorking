angular.module('verklizan.umox.mobile.common').controller('defineUrlController',
    function defineUrlController($scope, navigationService, settingsService, urlSettingsService, pomasUrlSettingsService) {
        'use strict';

        $scope.baseUrl = urlSettingsService.getBaseUrlObject();
        $scope.pomasBaseUrl = pomasUrlSettingsService.getBaseUrlObject();
        $scope.isSubmitted = false;

        $scope.next = function () {
            if ($scope.urlForm.$valid) {
                urlSettingsService.setBaseUrlObject($scope.baseUrl.host, $scope.baseUrl.port, $scope.baseUrl.path);
                pomasUrlSettingsService.setBaseUrlObject($scope.baseUrl.host, $scope.pomasBaseUrl.port);

                if ($scope.pomasBaseUrl.port) {
                    settingsService.setPomasServiceExists(true);
                } else {
                    settingsService.setPomasServiceExists(false);
                }

                navigationService.navigateAndReplace("/login");
            } else {
                $scope.isSubmitted = true;
            }
        }

    }
);