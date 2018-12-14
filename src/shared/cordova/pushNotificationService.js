(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').service('pushNotificationService',
    [
        '$rootScope', '$q', 'cordovaReady', 'deviceService', 'devicePlatformConstants',
        function ($rootScope, $q, cordovaReady, deviceService, devicePlatformConstants) {

            // ============================
            // Private Fields
            // ============================
            var tokenRetrieveIsCalled = false;
            var tokenDeferred = $q.defer();
            var pushCallbackMethod;

            // ============================
            // Public Methods
            // ============================
            this.registerPushEventAndReturnToken = function () {
                this.registerPushEvents();

                return tokenDeferred.promise;
            };

            this.registerPushEvents = function () {
                if (tokenRetrieveIsCalled === false) {
                    tokenRetrieveIsCalled = true;

                    cordovaReady.then(function () {
                        getPushNotificationToken();
                    }).catch(function () {
                        console.log("Only possible to use push notifications on mobile device");
                        tokenDeferred.reject();
                    });
                }
            };

            this.setPushNotificationCallback = function (callbackMethod) {
                pushCallbackMethod = callbackMethod;
            };

            // ============================
            // Private Methods
            // ============================
            var getPushNotificationToken = function () {
                var pushNotification = window.plugins.pushNotification;

                if (deviceService.platform === devicePlatformConstants.Android) {
                    pushNotification.register(successHandler, errorHandler, { "senderID": "411960825850", "ecb": "onNotificationGCM" }); // required!
                } else if (deviceService.platform === devicePlatformConstants.iOS) {
                    pushNotification.register(iOSTokenHandler, errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN" }); // required!
                }
            };

            var pushNotificationTokenReceived = function (token) {
                console.log("token received: " + token);

                tokenDeferred.resolve(token);
            }

            var pushNotificationReceived = function (sessionId, isCalledFromForeground) {
                console.log("notification received with session id: " + sessionId);

                $rootScope.$apply(function () {
                    pushCallbackMethod(sessionId, isCalledFromForeground);
                });
            };

            // ============================
            // Global Methods
            // ============================
            //Handles the Android notification when you receive it
            window.onNotificationGCM = function (e) {
                console.log('EVENT -> RECEIVED:' + e.event);

                switch (e.event) {
                    case 'registered': //not a received pushnotification, but the token to send one
                        if (e.regid.length > 0) {
                            pushNotificationTokenReceived(e.regid);
                        }
                        break;

                    case 'message': //receiving a push notification
                        // if this flag is set, this notification happened while we were in the foreground.
                        if (e.foreground) {
                            console.log('--INLINE NOTIFICATION--');
                        } else { // otherwise we were launched because the user touched a notification in the notification tray.
                            if (e.coldstart) {
                                console.log('--COLDSTART NOTIFICATION--');
                            } else {
                                console.log('--BACKGROUND NOTIFICATION--');
                            }
                        }

                        pushNotificationReceived(e.payload.sessionId, e.foreground);
                        break;

                    case 'error':
                        console.log('ERROR -> MSG:' + e.msg);
                        break;

                    default:
                        console.log('EVENT -> Unknown, an event was received and we do not know what it is');
                        break;
                }
            }

            //handles the iOS notification when you receive it
            window.onNotificationAPN = function (e) {
                if (e.sessionId) {
                    var foreground = (e.foreground === "1" ? true : false);
                    pushNotificationReceived(e.sessionId, foreground);
                }
            }

            //iOS handler for receiving the token
            var iOSTokenHandler = function (result) {
                console.log('token: ' + result);
                pushNotificationTokenReceived(result);
            };

            var successHandler = function (result) {
                console.log('success:' + result);
            };

            var errorHandler = function (error) {
                console.log('error:' + error);
                tokenDeferred.reject(error);
            };
        }
    ]);

})();