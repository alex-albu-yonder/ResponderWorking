angular.module('verklizan.umox.mobile.common').controller('defineUrlController',
    function defineUrlController($scope, navigationService, urlSettingsService) {
        'use strict';

        $scope.baseUrl = urlSettingsService.getBaseUrlObject();
        $scope.isSubmitted = false;

        $scope.next = function () {
            if ($scope.urlForm.$valid) {
                urlSettingsService.setBaseUrlObject($scope.baseUrl.host, $scope.baseUrl.port, $scope.baseUrl.path);
                navigationService.navigateAndReplace("/login");
            } else {
                $scope.isSubmitted = true;
            }
        }

    }
);