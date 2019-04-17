angular.module('verklizan.umox.mobile.common').service('applicationLifeCycleService',
    function ($timeout, $window, $location, $rootScope, loadingScreenService, cordovaReady, navigationService, securityTokenService,
        localizedNotificationService, loginServiceWrapper, userDataManager) {

        // ============================
        // Private Properties
        // ============================
        var isInSuspendedState = false;
        var isGoingToExit = false;
        var pageBeforePause;
        var loginExpiredUrl = "/login/authError";

        // ============================
        // Public Methods
        // ============================
        this.registerEvents = function () {
            cordovaReady.then(function () {
                document.addEventListener('backbutton', handleBackButton, false);
                document.addEventListener('pause', handlePause, false);
            });

            securityTokenService.registerTokenExpirationCallback(tokenExpiredAndNeedsNavigation);

            if ($location.path() === "" || $location.path() === "/login") {
                checkIfUserIsAlreadyLoggedIn();
            }
        }

        $rootScope.$on('$locationChangeStart', function (event) {
            if (isGoingToExit) {
                event.preventDefault();
                loadingScreenService.startLoadingWithTimeout(500, navigator.app.exitApp, "_Loading_Exit_");
            }
        })

        // ============================
        // Private Methods
        // ============================
        var handleBackButton = function (e) {
            e.preventDefault();
            if (needsToExitApp()) {
                isGoingToExit = true;
                navigator.app.exitApp();
            }
        }

        var handlePause = function () {
            console.log("app is paused");
            pageBeforePause = $location.path();
            isInSuspendedState = true;
            loadingScreenService.startLoadingWithPromise(null, null, "_Loading_PleaseWait_");
            addResumeEventListener();
        }

        var needsToExitApp = function () {
            var exit = $window.history.length <= 1 || $location.path() === "/home" || $location.path() === "/login" || $location.path() === loginExpiredUrl;
            if (exit === false) {
                console.log("history: " + history.length);
            }
            return exit;
        }

        var addResumeEventListener = function () {
            document.addEventListener("resume", resumingAppHandler, false);
        }

        var resumingAppHandler = function () {
            console.log("app resuming");
            isInSuspendedState = false;

            var isTokenExpired = securityTokenService.isTokenExpired();
            if (isTokenExpired) {
                console.log("token is expired");
                loadingScreenService.startLoadingWithTimeout(1000, navigateAndReplaceToLoginTokenExpired, "_Loading_TokenExpired_");
                securityTokenService.removeToken();
                $rootScope.$apply();
            }
            else {
                console.log("token is not expired");
                navigationService.goBack();
            }

            document.removeEventListener("resume", resumingAppHandler, false);
        }

        var checkIfUserIsAlreadyLoggedIn = function () {
            if (securityTokenService.tokenIsPresent()) {
                console.log("token present");
                var initialisationPromise = loginServiceWrapper.initializeLoginIfTokenIsPresent();
                loadingScreenService.startLoadingWithPromise(initialisationPromise, navigateAndReplaceToHome, "_Loading_Updating_");
            }
        }

        var tokenExpiredAndNeedsNavigation = function () {
            console.log("Token is expired callback");
            if (isInSuspendedState === true) {
                return;
            }

            navigateToLogin(false);
        }

        var navigateAndReplaceToLoginTokenExpired = function () {
            if (pageBeforePause !== loginExpiredUrl) {
                navigationService.goBack();
            } else {
                navigateToLogin(true);
            }
        }

        var navigateToLogin = function (andReplace) {
            if (andReplace === true) {
                navigationService.navigateAndReplace(loginExpiredUrl);
            }
            else {
                navigationService.navigate(loginExpiredUrl);
            }

            userDataManager.setBackStackOfSessionAvailable(true);
        }

        var navigateAndReplaceToHome = function () {
            navigationService.navigateAndReplace("/home");
        }
    }
);