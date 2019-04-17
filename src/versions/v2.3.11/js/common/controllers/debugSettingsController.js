angular.module('verklizan.umox.mobile.common').controller('debugSettingsController',
    function ($scope, $timeout, config, userSettingsService) {
        'use strict';
        
        $scope.isInDebugMode = userSettingsService.getIsInDebugMode();
        $scope.autoCareRequestEnabled = userSettingsService.getAutoCareRequestEnabled();
        $scope.autoCareRequestInterval = userSettingsService.getAutoCareRequestInterval();

        $scope.processToggleDebugMode = function (newValue) {
            userSettingsService.setIsInDebugMode(newValue);
        }

        $scope.processToggleAutoCareRequest = function (newValue) {
            userSettingsService.setAutoCareRequestEnabled(newValue);
        }

        $scope.setAutoCareRequestInterval = function () {
            if ($scope.autoCareIntervalForm.$valid) {
                userSettingsService.setAutoCareRequestInterval($scope.autoCareRequestInterval);
            }
        }
    }
);
