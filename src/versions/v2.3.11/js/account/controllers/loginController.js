angular.module('verklizan.umox.mobile.account').controller('loginController',
    function ($scope, $routeParams, pushNotificationSettingsService, 
        loginServiceWrapper, navigationService, userDataManager, settingsService, config, organizationSettingsService,
        RejectedResult, USER_ROLES) {
        'use strict';

        // ============================
        // Fields
        // ============================
        $scope.username = null;
        $scope.password = null;

        $scope.invalid = false;
        $scope.localizedErrorMessage = "";
        $scope.loading = false;
        $scope.appearanceSettings = settingsService.getAppearanceSettings();

        // ============================
        // Events
        // ============================
        // Event fires when view  is loaded. Every redirect to the login page fires this event.
        (function () {
            setDefaultCredentials();
            setDefaultAppearanceSettings();

            if ($routeParams.action === "careRequestReceived") {
                $scope.localizedErrorMessage = "_Alerts_PushNavigateLoggedOut_";
            }
            else if ($routeParams.action === "authError") {
                $scope.localizedErrorMessage = "_Alerts_NotAuthorized_";
            }
            else if ($routeParams.action === "tokenExpired") {
                $scope.localizedErrorMessage = "_Alerts_TokenExpired_";
            }
        })();

        $scope.$on('login', function () {
            $scope.loading = false;

            if (userDataManager.sessionIsFreshStart() || pushNotificationSettingsService.getCareRequestReceived()) {
                navigateToFirstPage();
            } else {
                navigationService.goBack();
            }
        });

        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.originalPath !== "/loading/:loadingMessage") {
                userDataManager.setBackStackOfSessionAvailable(false);
            }
        });

        // ============================
        // Public Methods
        // ============================
        $scope.login = function () {
            resetErrors();

            if ($scope.username && $scope.password) {
                $scope.loading = true;

                loginServiceWrapper.login($scope.username, $scope.password)
                    .then(loginCallback)
                    .catch(loginCallbackError);
            }
        };

        $scope.navigate = function (location) {
            navigationService.navigate(location);
        };

        $scope.createBase64String = function () {
            return "data:" + $scope.appearanceSettings.LogoMimeType + ";base64," + $scope.appearanceSettings.LogoBase64;
        }

        // ============================  
        // Private methods  
        // ============================
        function setDefaultCredentials() {
            var standardCredentials = config.security.standardCredentials;

            if (angular.isDefined(standardCredentials)) {
                $scope.username = standardCredentials.username;
                $scope.password = standardCredentials.password; 
            } else {
                $scope.username = settingsService.getLastUsedUsername();
            }
        }

        function setDefaultAppearanceSettings() {
            if (window.isNullOrUndefined($scope.appearanceSettings)) {
                $scope.appearanceSettings = {
                    BannerVisible: true
                }
            }
        }

        var loginCallback = function () {
            resetErrors();
            if (organizationSettingsService.getSaveUsernameAfterLoginInResponder()) {
                settingsService.setLastUsedUsername($scope.username);
            } else {
                settingsService.clearLastUsedUsername();
            }
        }

        var resetErrors = function () {
            $scope.invalid = false;
            $scope.localizedErrorMessage = "";
        }

        var navigateToFirstPage = function () {
            var currentUserRole = userDataManager.getCurrentUserRole();

            switch (currentUserRole) {
                case USER_ROLES.caregiver:
                    navigationService.navigate("/home");
                    break;
                case USER_ROLES.operator:
                    navigationService.navigate("/settings");
                    break;
                default:
                    break;
            }
        }

        var loginCallbackError = function (error) {
            $scope.loading = false;

            console.error(JSON.stringify(error));
            if (angular.isUndefined(error.errorIsHandled)) {
                $scope.invalid = true;
            }
            if (error instanceof RejectedResult && error.hasLocalizedMessage()) {
                $scope.localizedErrorMessage = error.message;
            }
        }
    }
);
