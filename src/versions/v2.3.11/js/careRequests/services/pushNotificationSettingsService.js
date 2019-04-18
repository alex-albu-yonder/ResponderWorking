angular.module('verklizan.umox.mobile.common').service('pushNotificationSettingsService',
    function ($rootScope, $q, $routeParams, $window, $timeout, userSettingsService, config, cordovaDeviceToPushDeviceFilter, pushNotificationService, webRequestService,
        pushNotificationServiceRequestModel, deviceService, securityTokenService, navigationService, localizedNotificationService, GenericHttpErrorHandler,
        pushNotificationServiceProxy, httpErrorCode, domainModel, nativeNotificationService) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var that = this;
        var httpErrorHandler = GenericHttpErrorHandler.createWithAllErrorCodesEnabledExcept(httpErrorCode.NoConnection);
        var canReceivePushEventIsInitialized = false;
        var careRequestPopupAwaitingUserFeedback = false;
        var careRequestReceived = false;
        var debounceTimeInMilliSeconds = 1000 * 8;
        var timeWeAcceptNewPings = new Date();

        //#endregion

        //#region Events
        // ============================
        // Events
        // ============================
        $rootScope.$on('login', function () {
            console.log("push settings reacts to login");

            if (that.getIsPushEnabled()) {
                that.setIsPushEnabled(true);
            }
            if (that.getIsFaceTimeEnabled()) {
                that.setIsFaceTimeEnabled(true);
            }
        });

        //#endregion

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        //sends a request to the server to register the user
        this.initializePush = function () {
            console.log("initializes push");
            setCallbackMethod();
            pushNotificationService.registerPushEvents();
            canReceivePushEventIsInitialized = true;
        }

        this.getPushTelNumber = function () {
            return userSettingsService.getPushTelNumber();
        };

        this.setPushTelNumber = function (pushTelNumber) {
            userSettingsService.setPushTelNumber(pushTelNumber);
        };

        this.getIsPushEnabled = function () {
            var pushIsEnabled = userSettingsService.getPushIsEnabled();

            if (typeof pushIsEnabled === "undefined" || pushIsEnabled === null) {
                return false;
            } else {
                return pushIsEnabled;
            }
        };

        this.setIsPushEnabled = function (isPushEnabled) {
            userSettingsService.setPushIsEnabled(isPushEnabled);
            var phoneNumber = that.getPushTelNumber();

            if (isPushEnabled === true) {
                return registerDevice(phoneNumber, domainModel.pushSubscriptionType.CareRequests)
                    .catch(registerDeviceError);
            } else if (isPushEnabled === false) {
                return unregisterDevice(phoneNumber, domainModel.pushSubscriptionType.CareRequests);
            }
        };

        this.getFaceTimeId = function () {
            return userSettingsService.getFaceTimeId();
        };

        this.setFaceTimeId = function (faceTimeId) {
            userSettingsService.setFaceTimeId(faceTimeId);
        };

        this.getIsFaceTimeEnabled = function () {
            var faceTimeIsEnabled = userSettingsService.getIsFaceTimeEnabled();

            if (typeof faceTimeIsEnabled === "undefined" || faceTimeIsEnabled === null) {
                return false;
            } else {
                return faceTimeIsEnabled;
            }
        }

        this.setIsFaceTimeEnabled = function (isFaceTimeEnabled) {
            userSettingsService.setIsFaceTimeEnabled(isFaceTimeEnabled);
            var faceTimeId = that.getFaceTimeId();

            if (isFaceTimeEnabled === true) {
                return registerDevice(faceTimeId, domainModel.pushSubscriptionType.FaceTime).catch(registerForFaceTimeError);
            } else if (isFaceTimeEnabled === false) {
                return unregisterDevice(faceTimeId, domainModel.pushSubscriptionType.FaceTime);
            }
        }

        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var initializePushIfNecessary = function () {
            console.log("initialize push if necessary: " + canReceivePushEventIsInitialized);
            if (canReceivePushEventIsInitialized === false) {
                that.initializePush();
            }
        }

        var registerDevice = function (phoneNumber, subscriptionType) {
            console.log("about to register device");
            return tryRegisterPushEventAndReturnToken()
                .then(function (token) {
                    console.log("Token received is " + token);
                    return sendTokenToService(phoneNumber, token, subscriptionType)
                })
                .then(initializePushIfNecessary);
        }

        var tryRegisterPushEventAndReturnToken = function () {
            return pushNotificationService.registerPushEventAndReturnToken()
                .catch(function (error) {
                    if (config.testData.pushToken) {
                        return config.testData.pushToken
                    }
                    else {
                        return $q.reject(error)
                    }
                })
        }

        var unregisterDevice = function (phoneNumber, subscriptionType) {
            return pushNotificationServiceProxy.unregisterDevice(phoneNumber, subscriptionType);
        }

        var sendTokenToService = function (phoneNumber, token, subscriptionType) {
            var operatingSystemType = getOperatingSystemType();

            var device = {
                PhoneNumber: phoneNumber,
                Token: token,
                Type: operatingSystemType
            };

            return pushNotificationServiceProxy.registerDevice(device, subscriptionType);
        };

        var setCallbackMethod = function () {
            console.log("adds event listener for push");
            pushNotificationService.addEventListenerForPush(pushNotificationCallback);
        };

        var pushNotificationCallback = function (isCalledFromForeground, customContent) {
            console.log("custom content to callback " + customContent);

            switch (customContent.pushNotificationType) {
                case "CareRequest":
                    handleCareRequest(customContent, isCalledFromForeground);
                    break;
                case "FaceTime":
                    handleFaceTimeRequest(customContent, isCalledFromForeground);
                    break;
            }
        };

        var careRequestUpdateConfirmCallback = function () {
            navigationService.goHome();
        };

        var getOperatingSystemType = function () {
            var platform = deviceService.platform;

            return cordovaDeviceToPushDeviceFilter(platform);
        };

        var registerDeviceError = function (error) {
            userSettingsService.setPushIsEnabled(false);

            return $q.reject(error);
        }

        var registerForFaceTimeError = function (error) {
            userSettingsService.setIsFaceTimeEnabled(false);

            return $q.reject(error);
        }

        var handleFaceTimeRequest = function (customContent, isCalledFromForeground) {
            console.log("handling facetime: " + customContent + " " + customContent.faceTimeId);

            $window.open("facetime://" + customContent.faceTimeId, "_system");
        }

        var handleCareRequest = function (customContent, isCalledFromForeground) {
            careRequestReceived = true;            
            var isPing = customContent.isPing === "True" || false;

            if (isCalledFromForeground === true && isPing === true && timeWeAcceptNewPings < new Date()) {
                nativeNotificationService.beep(2);
                timeWeAcceptNewPings = new Date(new Date().getTime() + debounceTimeInMilliSeconds);
            }
            else if (isCalledFromForeground === true && alreadyViewingCareRequest() && isPing === false) {
                nativeNotificationService.beep(2);
                navigationService.reloadCurrentPage();
            } else if (securityTokenService.isTokenExpired()) {
                navigationService.navigateAndReplace("/login/careRequestReceived");
            }
        }

        var alreadyViewingCareRequest = function () {
            return ((navigationService.getCurrentPage() === "/home" && $routeParams.state !== "careHistory") || navigationService.getCurrentPage().includes("/careRequest/"));
        }


        this.getCareRequestReceived = function () {
            return careRequestReceived;
        }


        //#endregion

    }
);
