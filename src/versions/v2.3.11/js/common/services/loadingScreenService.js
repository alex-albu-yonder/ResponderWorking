angular.module('verklizan.umox.mobile.common').service('loadingScreenService',
    function ($q, $rootScope, $location, $timeout, navigationService) {
        "use strict";

        // ============================
        // Properties
        // ============================
        var loadingScreenUrl = '/loading/';

        // ============================
        // Public Methods
        // ============================
        this.startLoadingWithTimeout = function (timeoutInSeconds, loadingCallback, localizedLoadingMessage) {
            var promise = $timeout(function () { }, timeoutInSeconds);

            startLoading(promise, loadingCallback, localizedLoadingMessage, false);
        }

        this.startAndReplaceLoadingWithTimeout = function (timeoutInSeconds, loadingCallback, localizedLoadingMessage) {
            var promise = $timeout(function () { }, timeoutInSeconds);

            startLoading(promise, loadingCallback, localizedLoadingMessage, true);
        }

        this.startLoadingWithPromise = function (loadingPromise, loadingCallback, localizedLoadingMessage) {
            startLoading(loadingPromise, loadingCallback, localizedLoadingMessage, false);
        }

        // ============================
        // Private Methods
        // ============================
        function startLoading(loadingPromise, loadingCallback, localizedLoadingMessage, replaceWhenNavigating) {
            navigateToLoadingScreen(localizedLoadingMessage, replaceWhenNavigating);

            loadingPromise = $q.when(loadingPromise);

            loadingPromise
                .then(function (input) {
                    if (!angular.isFunction(loadingCallback)) {
                        return;
                    }

                    loadingCallback(input);
                })
                .catch(function () {
                    navigationService.goBack();
                });
        }

        function navigateToLoadingScreen(message, replaceWhenNavigating) {
            var currentPath = $location.path();

            if (currentPath.indexOf(loadingScreenUrl) !== -1 || replaceWhenNavigating === true) {
                navigationService.navigateAndReplace(loadingScreenUrl + message);
            } else {
                navigationService.navigate(loadingScreenUrl + message);
            }
        }
    }
);