angular.module('verklizan.umox.mobile.common').factory('localizedNotificationService',
    function ($q, nativeNotificationService, localisationService) {
        'use strict';

        // ============================
        // Public methods
        // ============================
        var localizedNotificationService = {};

        localizedNotificationService.alert = function (message, title, buttonName) {
            var promiseCollection = [];
            var messageLocalized;
            var titleLocalized; 
            var buttonNameLocalized;

            promiseCollection.push(localisationService.getLocalizedStringAsync(message).then(function (localizedValue) {
                messageLocalized = localizedValue;
            }));
            promiseCollection.push(localisationService.getLocalizedStringAsync(title).then(function (localizedValue) {
                titleLocalized = localizedValue;
            }));
            promiseCollection.push(localisationService.getLocalizedStringAsync(buttonName).then(function (localizedValue) {
                buttonNameLocalized = localizedValue;
            }));

            return $q.all(promiseCollection).then(function () {
                return nativeNotificationService.alert(messageLocalized, titleLocalized, buttonNameLocalized);
            });
        };

        localizedNotificationService.confirm = function (message, title, buttonLabels) {
            var promiseCollection = [];
            var messageLocalized;
            var titleLocalized;
            var buttonLabelsLocalized;

            promiseCollection.push(localisationService.getLocalizedStringAsync(message).then(function (localizedValue) {
                messageLocalized = localizedValue;
            }));
            promiseCollection.push(localisationService.getLocalizedStringAsync(title).then(function (localizedValue) {
                titleLocalized = localizedValue;
            }));
            promiseCollection.push(localisationService.getLocalizedStringAsync(buttonLabels).then(function (localizedValue) {
                buttonLabelsLocalized = localizedValue;
            }));

            var alertPromise = $q.all(promiseCollection).then(function () {
                return nativeNotificationService.confirm(messageLocalized, titleLocalized, buttonLabelsLocalized);
            });
            return addPromiseAlertMethods(alertPromise);
        }

        // ============================
        // Private methods
        // ============================
        var addPromiseAlertMethods = function (promise) {

            if (window.isNullOrUndefined(promise.ok)) {
                promise.ok = promise.then;
            }

            if (window.isNullOrUndefined(promise.cancel)) {
                promise.cancel = promise.catch;
            }

            return promise;
        }

        return localizedNotificationService;
    }
);
