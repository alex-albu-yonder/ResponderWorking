angular.module('enovation.umox.mobile').run(
    function ($q, $rootScope, $timeout, splashScreenService, nativeNotificationService, localizedNotificationService, organizationSettingsService, settingsService,
        navigationService, pushNotificationSettingsService, GenericHttpErrorHandler, httpErrorCode, securityTokenService, localisationService, applicationLifeCycleService,
        userDataManager, urlSettingsService, languageSettingsService) {
        'use strict';
        applicationLifeCycleService.registerEvents();

        //initialize push
        if (pushNotificationSettingsService.getIsPushEnabled() || pushNotificationSettingsService.getIsFaceTimeEnabled()) {
            pushNotificationSettingsService.initializePush();
        }

        var deregistration = $rootScope.$on('$viewContentLoaded', function () {
            $timeout(splashScreenService.turnOffSplashScreen, 1000);
            deregistration();
        });

        // route change event listener
        $rootScope.$on('$locationChangeStart', function (event, next) {
            // Checks several values if a redirect is necessary
            // Service url is present, or the user is redirected to the page
            if (!urlSettingsService.hasValidBaseUrl()) {
                $rootScope.$evalAsync(function () {
                    event.preventDefault();
                    navigationService.navigateAndReplace("/firstStart/defineUrl");
                });
            }
                // Language is present
            else if (!languageSettingsService.getLanguage()) {
                $rootScope.$evalAsync(function () {
                    event.preventDefault();
                    navigationService.navigateAndReplace("/firstStart/defineLanguage");
                });
            }
            else if (next.endsWith("/newSubscriber/profile")) {
                if (!organizationSettingsService.getSubscriberStatus()) {
                    $rootScope.$evalAsync(function () {
                        event.preventDefault();
                        localizedNotificationService.alert("_NewSubscriberProfile_NoStatus_", "_NewSubscriberProfile_NoStatusTitle_", "_Ok_");
                        navigationService.navigateAndReplace("/settings");
                    });
                }
            }
        });

        $rootScope.$on('$routeChangeError', handleSecurityError);

        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.Unknown, handleConnectionError);
        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.NoConnection, handleConnectionError);

        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.BadRequest, function (response) {
            var errorMessage = createMessageWithRef(response.data);
            createAlertWithLocalizedTitleAndButton(errorMessage, "_Alerts_BadRequestTitle_", "_Ok_")
        });

        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.InternalServerError, function (response) {
            var contentType = response.headers["content-type"];

            if (!contentType || contentType.contains("application/xml")) {
                localizedNotificationService.alert("_Alerts_ServerError_", "_Alerts_ServerError_Title_", "_Ok_");
            } else if (contentType.contains("application/json")) {
                var errorMessage = createMessageWithRef(response.data);
                createAlertWithLocalizedTitleAndButton(errorMessage, "_Alerts_BusinessException_", "_Ok_");
            }
        });

        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.NotFound, handleProbablyWrongUrlError);
        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.ServiceUnavailable, handleProbablyWrongUrlError);

        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.NotAuthorized, handleSecurityError);
        GenericHttpErrorHandler.addErrorHandler(httpErrorCode.Forbidden, handleSecurityError);

        function createAlertWithLocalizedTitleAndButton(message, titleLocalisationKey, buttonLocalisationKey) {
            var localizedTitle;
            var localizedButton;

            var titleLoadingPromise = localisationService.getLocalizedStringAsync(titleLocalisationKey).then(function (localizedValue) {
                localizedTitle = localizedValue;
            });
            var buttonLoadingPromise = localisationService.getLocalizedStringAsync(buttonLocalisationKey).then(function (localizedValue) {
                localizedButton = localizedValue;
            });

            $q.all([titleLoadingPromise, buttonLoadingPromise]).then(function () {
                nativeNotificationService.alert(message, localizedTitle, localizedButton);
            })
        }

        function handleProbablyWrongUrlError() {
            localizedNotificationService.confirm("_Alerts_ServiceUnavailable_", "_Alerts_ServiceUnavailableTitle_", ["_Ok_", "_Cancel_"])
                .ok(navigateToSettingsConfirmation);

            function navigateToSettingsConfirmation() {
                console.log("button is ok");
                navigationService.navigateAndReplace("/firstStart/defineUrl");
            }
        }

        function handleConnectionError() {
            localizedNotificationService.alert("_Alerts_NoConnection_", "_Alerts_NoConnectionTitle_", "_Ok_");
        }

        function handleSecurityError() {
            securityTokenService.removeToken();
            userDataManager.setBackStackOfSessionAvailable(true);
            navigationService.navigate("/login/authError");
        }

        function createMessageWithRef(response) {
            return response.Message + " " + response.detail.ServerExceptionReferenceNumber;
        }
    }
);
