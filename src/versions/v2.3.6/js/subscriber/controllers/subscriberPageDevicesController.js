angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageDevicesController',
    function ($scope, $routeParams, organizationSettingsService, navigationService, subscriberDataManager, deviceDataManager, supportingDataManager,
        localizedNotificationService, EndlessScrollPagingComponent, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Fields
        // ============================
        $scope.subscriberId = $routeParams.id;
        $scope.isLoading = promiseLoadingSpinnerService.getIsLoading;
        $scope.allowChangeDeviceLinkInResponder = organizationSettingsService.getAllowChangeDeviceLinkInResponder();
        $scope.profileInfo = null;
        $scope.linkedDevicesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Small);
        $scope.searchedDevicesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Small);

        $scope.searchText = "";

        $scope.submitted = false;

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            var getSubscriberInfoPromise = subscriberDataManager.getSubscriberInfo($scope.subscriberId)
                .then(function (profileInfo) {
                    $scope.profileInfo = profileInfo;
                });

            promiseLoadingSpinnerService.addLoadingPromise(getSubscriberInfoPromise);

            //this is loaded because the device statusses are used when linking and unlinking a device
            supportingDataManager.getNewDeviceStatusses();

            loadLinkedDevices($scope.subscriberId);
        });

        // ============================
        // Public methods
        // ============================
        $scope.linkDevice = function (deviceId) {
            var linkDevicePromise = deviceDataManager.linkDevice($scope.subscriberId, $scope.profileInfo.ResidenceId, deviceId)
                .finally(linkDeviceCallback);

            promiseLoadingSpinnerService.addLoadingPromise(linkDevicePromise);
        }

        $scope.searchDevices = function () {
            if (!deviceStatusIsSet()) {
                return;
            }

            $scope.submitted = true;
            $scope.searchedDevicesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Small);

            loadSearchedDevices();
        };

        $scope.searchMoreDevices = function () {
            loadSearchedDevices();
        }

        // ============================
        // Private methods
        // ============================
        var linkDeviceCallback = function () {
            $scope.linkedDevicesViewModel.clear();
            $scope.submitted = false;
            loadLinkedDevices($scope.subscriberId);
        }

        var loadLinkedDevices = function (subscriberId) {
            $scope.searchedDevicesViewModel.clear();
            $scope.searchText = "";

            var loadDevicePromise = deviceDataManager.loadDeviceInformationPage(subscriberId, $scope.linkedDevicesViewModel.nextPageNumber, $scope.linkedDevicesViewModel.pageSize)
                .then(function (devicesInfo) {
                    $scope.linkedDevicesViewModel.addData(devicesInfo);
                });

            promiseLoadingSpinnerService.addLoadingPromise(loadDevicePromise);
        }

        var loadSearchedDevices = function () {
            if ($scope.searchDevicesForm.$valid) {
                
                var searchDevicePromise = deviceDataManager.searchDevice($scope.searchText,
                    $scope.searchedDevicesViewModel.nextPageNumber,
                    $scope.searchedDevicesViewModel.pageSize)
                       .then(function (searchedDevices) {
                           $scope.searchedDevicesViewModel.addData(searchedDevices);
                       });

                promiseLoadingSpinnerService.addLoadingPromise(searchDevicePromise);
            }
        }

        var deviceStatusIsSet = function () {
            if (!organizationSettingsService.getNewDeviceStatus() || !organizationSettingsService.getUnlinkDeviceStatus()) {

                sendNavigateToSettingsConfirmation();

                return false;
            } else {
                return true;
            }
        }

        var sendNavigateToSettingsConfirmation = function () {
            localizedNotificationService.confirm("_Alerts_NoDeviceStatusSet_", "_Alerts_NoDeviceStatusSet_Title_", ["_Ok_", "_Cancel_"])
                .ok(noDeviceStatusSetCallback);
        }

        var noDeviceStatusSetCallback = function () {
            navigationService.navigate("/settings");
        };
    }
);