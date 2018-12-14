angular.module('verklizan.umox.mobile.common').service('webRequestService',
    function ($http, $q, securityTokenService, generalConstants) {
        'use strict';
        var defaultTimeoutInMs = generalConstants.defaultServiceRequestTimeoutInSeconds * 1000;

        // ============================
        // Public methods
        // ============================
        this.getWithCustomUrl = function (url, searchParameters, authenticationNeeded, errorHandler) {
            var loginHeader = securityTokenService.getHeader();

            if (cannotBeSendWithoutLoginHeader(authenticationNeeded, loginHeader)) {
                return $http.get(url, { params: searchParameters, timeout: defaultTimeoutInMs }, loginHeader).then(renewTokenExpiration).catch(handleError);
            } else if (!authenticationNeeded) {
                return $http.get(url, { params: searchParameters, timeout: defaultTimeoutInMs }).catch(handleError);
            } else {
                return getAuthorizationError(errorHandler, url);
            }

            function handleError(response) {
                return errorHandler.handleError(response);
            }
        }

        this.postWithCustomUrl = function (url, data, authenticationNeeded, errorHandler) {
            var loginHeader = securityTokenService.getHeader();
            var timeoutHeader = {
                timeout: defaultTimeoutInMs
            }

            if (cannotBeSendWithoutLoginHeader(authenticationNeeded, loginHeader)) {
                angular.merge(loginHeader, timeoutHeader);
                return $http.post(url, data, loginHeader).then(renewTokenExpiration).catch(handleError);
            } else if (!authenticationNeeded) {
                return $http.post(url, data, timeoutHeader).catch(handleError);
            } else {
                return getAuthorizationError(errorHandler, url);
            }

            function handleError(response) {
                return errorHandler.handleError(response, data);
            }
        }

        // ============================
        // Private methods
        // ============================
        var renewTokenExpiration = function (response) {
            securityTokenService.renewTokenExpiration();
            return response;
        }   

        var getRejectedPromise = function () {
            return $q.reject("The call needs authentication but there is no login header present");
        }

        var cannotBeSendWithoutLoginHeader = function (authenticationNeeded, loginHeader) {
            var isAuthenticationNeeded = authenticationNeeded === true;
            var loginHeaderIsPresent = !!loginHeader;

            return isAuthenticationNeeded && loginHeaderIsPresent;
        }

        function getAuthorizationError(errorHandler, serviceUrl) {
            return errorHandler.handleAuthorizationError(serviceUrl);
        }
    }
);
