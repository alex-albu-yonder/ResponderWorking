angular.module('verklizan.umox.mobile.common').controller('settingsController',
    function settingsController($scope, $q, settingsService, pushNotificationSettingsService, USER_ROLES,
        supportingDataManager, userDataManager, localizedNotificationService, navigationService, loginServiceWrapper,
        organizationSettingsService, devicePlatformConstants, deviceService, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Fields
        // ============================
        $scope.currentUserRole = userDataManager.getCurrentUserRole();
        $scope.roles = USER_ROLES;
        $scope.isLoading = promiseLoadingSpinnerService.getIsLoading;

        $scope.subscriberStatussesPromise = null;
        $scope.deviceStatussesPromise = null;
        $scope.statusses = null;
        $scope.newDeviceStatusses = null;
        $scope.userOrganizationId = userDataManager.getUserOrganizationId();

        $scope.settings = {
            status : organizationSettingsService.getSubscriberStatus(),
            newDeviceStatus : organizationSettingsService.getNewDeviceStatus(),
            deviceUnlinkStatus : organizationSettingsService.getUnlinkDeviceStatus()
        }

        $scope.newSubscriberStatusIsEditable = !organizationSettingsService.isSubscriberStatusOrganizationSetting();
        $scope.newDeviceStatusIsEditable = !organizationSettingsService.isNewDeviceStatusOrganizationSetting();
        $scope.deviceUnlinkStatusIsEditable = !organizationSettingsService.isUnlinkDeviceStatusOrganizationSetting(); 

        $scope.pushEnableError = false;
        $scope.caregiverPhoneNumbers = [];  
        $scope.pushSettings = {
            pushEnabled: pushNotificationSettingsService.getIsPushEnabled(),
            pushTelNumber: pushNotificationSettingsService.getPushTelNumber()
        };

        $scope.faceTimeError = false;
        $scope.faceTimeSettings = {
            faceTimeEnabled: pushNotificationSettingsService.getIsFaceTimeEnabled(),
            faceTimeId: pushNotificationSettingsService.getFaceTimeId()
        }

        $scope.caregiverNumbersPromise = null;

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            if ($scope.currentUserRole === $scope.roles.caregiver) {
                $scope.caregiverNumbersPromise = userDataManager.getCurrentCaregiverPhoneNumbers();
                $scope.caregiverNumbersPromise.then(setPhoneNumbers);
            }

            $scope.subscriberStatussesPromise = supportingDataManager.getSubscriberStates().then(setSubscriberStatusses);
            $scope.deviceStatussesPromise = supportingDataManager.getNewDeviceStatusses().then(setDeviceStatusses);
        });

        // ============================
        // Public Methods
        // ============================
        $scope.setStatus = function () {
            organizationSettingsService.setSubscriberStatus($scope.settings.status);
        };

        $scope.setDeviceStatus = function () {
            organizationSettingsService.setNewDeviceStatus($scope.settings.newDeviceStatus);
        };

        $scope.setDeviceUnlinkStatus = function () {
            organizationSettingsService.setUnlinkDeviceStatus($scope.settings.deviceUnlinkStatus);
        };

        $scope.setPushTelNumber = function (telNumber) {
            pushNotificationSettingsService.setPushTelNumber(telNumber);
            $scope.pushEnableError = false;
        }

        $scope.processPushEnabled = function (pushEnabled) {
            if (pushEnabled === true) {
                tryToEnablePush(pushEnabled);
            }
            else if (pushEnabled === false) {
                tryToDisablePush(pushEnabled);
            }
        }

        $scope.setFaceTimeId = function (faceTimeId) {
            pushNotificationSettingsService.setFaceTimeId(faceTimeId);
        }

        $scope.processFaceTimeEnabled = function (faceTimeEnabled) {
            if (faceTimeEnabled === true) {
                tryEnableFaceTime(faceTimeEnabled);
            }
            else if (faceTimeEnabled === false) {
                tryEnableFaceTime(faceTimeEnabled);
            }
        }

        $scope.navigateToChangePassword = function () {
            navigationService.navigate('/accountPages/changePassword');
        }

        $scope.logout = function () {
            loginServiceWrapper.logout().then(function () {
                navigationService.navigate('/login');
            });
        };

        $scope.platformIsValidForFacetime = function() {
            if (deviceService.platform === devicePlatformConstants.iOS) {
                var version = deviceService.version;
                var versionNumbers = version.split(".");
                
               
                var majorVersionNumber = parseInt(versionNumbers[0]);
                var minorVersionNumber = parseInt(versionNumbers[1]);

                if (majorVersionNumber > 8 || majorVersionNumber === 8 && minorVersionNumber >= 3) {
                    return true;
                }
            }

            return false;
        }

        // ============================
        // Private Methods
        // ============================
        var setPhoneNumbers = function (phoneNumbers) {
            $scope.caregiverPhoneNumbers = phoneNumbers.Rows;
        }

        var tryToEnablePush = function (pushEnabled) {
            if (pushCanBeEnabled()) {
                setIsPushEnabled(pushEnabled);
                $scope.pushEnableError = false;
            } else {
                $scope.pushEnableError = true;
                $scope.pushSettings.pushEnabled = false;
            }
        }

        var tryEnableFaceTime = function (faceTimeEnabled) {
            if (faceTimeCanBeEnabled()) {
                setIsFaceTimeEnabled(faceTimeEnabled);
                $scope.faceTimeError = false;
            } else {
                $scope.faceTimeError = true;
                $scope.faceTimeSettings.faceTimeEnabled = false;
            }
        }

        var tryToDisablePush = function () {
            var oldNumber = pushNotificationSettingsService.getPushTelNumber();

            if (oldNumber) {
                localizedNotificationService.confirm(
                    '_Settings_DisablePushConfirmation_Message_',
                    '_Settings_DisablePushConfirmation_Title_',
                    ["_Ok_", "_Cancel_"])
                    .ok(disablePushConfirmation)
                    .finally(setIsPushEnabledFromSettings);
            }
        }

        var disablePushConfirmation = function () {
            setIsPushEnabled($scope.pushSettings.pushEnabled);
        }

        var setIsPushEnabled = function (isPushEnabled) {
            var setEnabledPromise = pushNotificationSettingsService.setIsPushEnabled(isPushEnabled)
                .then(registerDeviceSucces)
                .catch(registerDeviceError)
                .finally(function () {
                    setIsPushEnabledFromSettings();
                });

            promiseLoadingSpinnerService.addLoadingPromise(setEnabledPromise);
        }

        var setIsFaceTimeEnabled = function (isFaceTimeEnabled) {
            var setEnabledPromise = pushNotificationSettingsService.setIsFaceTimeEnabled(isFaceTimeEnabled)
                .catch(registerDeviceError)
                .finally(function () {
                    setIsFaceTimeEnabledFromSettings();
                });

            promiseLoadingSpinnerService.addLoadingPromise(setEnabledPromise);
        }

        var pushCanBeEnabled = function () {
            return !!$scope.pushSettings.pushTelNumber;
        }

        var faceTimeCanBeEnabled = function () {
            return !!$scope.faceTimeSettings.faceTimeId;
        }

        var setIsPushEnabledFromSettings = function () {
            $scope.pushSettings.pushEnabled = pushNotificationSettingsService.getIsPushEnabled();
        }

        var setIsFaceTimeEnabledFromSettings = function () {
            $scope.faceTimeSettings.faceTimeEnabled = pushNotificationSettingsService.getIsFaceTimeEnabled();
        }

        var registerDeviceSucces = function () {
            if ($scope.pushSettings.pushEnabled === true) {
                localizedNotificationService.alert("_Alerts_DeviceRegistered_", "_Alerts_DeviceRegistered_Title_", "_Ok_");
            } else {
                localizedNotificationService.alert("_Alerts_DeviceUnregistered_", "_Alerts_DeviceUnregistered_Title_", "_Ok_");
            }
        }

        var registerDeviceError = function (error) {
            console.log("Register for push failed: " + error);
            localizedNotificationService.alert("_Alerts_DeviceCannotBeRegistered_", "_Alerts_DeviceCannotBeRegistered_Title_", "_Ok_");
        }

        var setSubscriberStatusses = function (data) {
            $scope.statusses = data;
        }

        var setDeviceStatusses = function (data) {
            $scope.newDeviceStatusses = data;
        }
    }
);
