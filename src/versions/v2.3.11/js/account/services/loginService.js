angular.module('verklizan.umox.mobile.account').service('loginServiceWrapper',
    function ($rootScope, $q, securityTokenService, hashService, userDataManager, organizationSettingsService,
        supportingDataManager, appVersionLoader, loginServiceProxy, moduleAuthorizationService,
        authorizationModuleConstants, localizedNotificationService, RejectedResult) {
        'use strict';
        var that = this;

        //#region Public Methods
        // ============================
        // Public methods
        // ============================
        this.login = function (username, password) {
            var hashedPassword = hashService.CreatePasswordHash(username, password);

            userDataManager.resetCurrentOperator();
            return loginServiceProxy.login(username, hashedPassword).then(loginSuccesCallback);
        };

        this.logout = function () {
            return loginServiceProxy.logout()
                .catch(logoutErrorCallback)
                .finally(logoutFinallyCallback);
        };

        this.initializeLoginIfTokenIsPresent = function () {
            if (securityTokenService.tokenIsPresent()) {
                console.log("Token is present");
                return initializeAfterLogin();
            } else {
                return $q.reject('No token present');
            }
        }
        //#endregion

        //#region Public Methods
        // ============================
        // Public methods
        // ============================

        var loginSuccesCallback = function (response) {
            //get username/password confirmation
            var isValid = response.data.LoginResult;

            //get token
            if (isValid === true) {
                console.log("login succeeded: " + isValid);

                securityTokenService.setToken(response.headers("Identity"));

                return appVersionLoader.tryLoadingCorrectAppVersion().catch(function () {

                    var getOrganizationSettingsPromise = organizationSettingsService.loadOrganizationSettings();
                    var readCurrentOperatorPromise = userDataManager.readCurrentOperator();

                    return $q.all([getOrganizationSettingsPromise, readCurrentOperatorPromise])
                        .then(function () {
                            var modules = moduleAuthorizationService.getModules();
                            if (modules[authorizationModuleConstants.Responder].IsAuthorized === false) {
                                that.logout();
                                return $q.reject(new RejectedResult(true, null, '_Login_NoModuleAuthorization_', true));
                            }

                            sendLoginEvent();
                            supportingDataManager.init();
                        })
                        .catch(function (result) {
                            console.log(result);
                            return $q.reject(new RejectedResult(true, null, '_Login_NotACaregiver_', true));
                        });
                });
            } else {
                return $q.reject(new Error('Failed to login'));
            }

            //sends event that the user is logged in
        };

        var logoutFinallyCallback = function (response) {
            securityTokenService.removeToken();
            userDataManager.resetCurrentOperator();
        };

        var logoutErrorCallback = function (error) {
            console.log("logout error: " + JSON.stringify(error));
        }

        var initializeAfterLogin = function () {
            return userDataManager.readCurrentOperator().then(function () {
                sendLoginEvent();
                supportingDataManager.init();
            });
        }

        var sendLoginEvent = function () {
            $rootScope.$broadcast('login');
        }
        //#endregion

    }
);
