(function () {
    'use strict';

    angular.module('verklizan.umox.mobile.shared.cordova').factory('nativeNotificationService',
    [
        '$rootScope', '$window', '$q', 'cordovaReady',
        function ($rootScope, $window, $q, cordovaReady) {

            // ============================
            // Public methods
            // ============================
            var nativeNotificationService = {
                alert: function (message, title, buttonName) {
                    var defferedAlert = $q.defer();

                    cordovaReady.then(function () {
                        mobileAlert(message, title, buttonName, defferedAlert);
                    }).catch(function () {
                        browserAlert(message, defferedAlert);
                    });

                    return defferedAlert.promise;
                },

                confirm: function (message, title, buttonLabels) {
                    var defer = $q.defer();

                    cordovaReady.then(function () {
                        mobileConfirm(message, title, buttonLabels, defer);
                    }).catch(function () {
                        browserConfirm(message, defer);
                    });

                    return alertPromise(defer.promise);
                }
            };

            // ============================
            // Private methods
            // ============================
            var browserAlert = function (message, defferedAlert) {
                alert(message);

                defferedAlert.resolve();
            }

            var mobileAlert = function (message, title, buttonName, defferedAlert) {
                var callBack = function () {
                    defferedAlert.resolve();
                }

                navigator.notification.alert(message, callBack, title, buttonName);
            }

            var browserConfirm = function (message, defferedConfirmation) {
                return $window.confirm(message) ? defferedConfirmation.resolve() : defferedConfirmation.reject();
            }

            var mobileConfirm = function (message, title, buttonLabels, defferedConfirmation) {
                var onConfirm = function (idx) {
                    if (idx === 1) {
                        defferedConfirmation.resolve();
                    } else {
                        defferedConfirmation.reject();
                    }
                }

                navigator.notification.confirm(message, onConfirm, title, buttonLabels);
            }

            //creates a promise that can be consumed with '.ok' and '.cancel' instead of '.then' and '.catch'.
            var alertPromise = function (promise) {
                promise.ok = function (fn) {
                    promise.then(function () {
                        fn.apply(this, arguments);
                    });
                    return promise;
                }

                promise.cancel = function (fn) {
                    promise.then(null, function () {
                        fn.apply(this, arguments);
                    });
                    return promise;
                }

                return promise;
            }

            return nativeNotificationService;
        }
    ]);

})();