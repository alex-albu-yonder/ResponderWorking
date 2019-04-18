angular.module('verklizan.umox.mobile').config(
    function ($routeProvider, $httpProvider, $compileProvider, USER_ROLES, settingsServiceProvider,
        localisationServiceProvider, moduleAuthorizationServiceProvider, authorizationModuleConstants,
        config, umoxServiceUrlsProvider) {
        'use strict';

        // ============================
        // Resolvers
        // ============================
        var authorizedResolver = {
            currentAccount: ['$q', 'userDataManager', 'organizationSettingsService', function ($q, userDataManager, organizationSettingsService) {
                var currentUser = userDataManager.readCurrentOperator().then(function () {
                    var isAuthorized = userDataManager.isAuthorizedForCurrentPage();
                    return isAuthorized === true ? $q.when() : $q.reject();
                });
                var currentOrgSettings = organizationSettingsService.getOrganizationSettings();

                return $q.all([currentUser, currentOrgSettings]);
            }]
        };

        // ============================
        // Main
        // ============================
        $routeProvider.when('/loading/:loadingMessage', {
            templateUrl: 'js/common/controllers/loadingScreen.html',
            controller: 'loadingScreenController',
            data: { authorizedRoles: [USER_ROLES.empty] },
        });
        $routeProvider.when('/home', {
            templateUrl: 'js/common/controllers/homePage.html',
            controller: 'homePageController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/login', {
            templateUrl: 'js/account/controllers/login.html', 
            controller: 'loginController',
            data: { authorizedRoles: [USER_ROLES.empty] }
        });
        $routeProvider.when('/login/:action', {
            templateUrl: 'js/account/controllers/login.html',
            controller: 'loginController',
            data: { authorizedRoles: [USER_ROLES.empty] }
        });
        $routeProvider.when('/searchSubscribers', {
            templateUrl: 'js/subscriber/controllers/searchSubscriberResults.html',
            controller: 'searchSubscriberResultsController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/searchSubscriberResults/:searchText', {
            templateUrl: 'js/subscriber/controllers/searchSubscriberResults.html',
            controller: 'searchSubscriberResultsController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/settings', {
            templateUrl: 'js/common/controllers/settings.html',
            controller: 'settingsController',
            data: { authorizedRoles: [USER_ROLES.all] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/messages', {
            templateUrl: 'js/messages/controllers/messages.html',
            controller: 'messagesController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/newMessage', {
            templateUrl: 'js/messages/controllers/newMessage.html',
            controller: 'newMessageController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/messages/:isToday/:index', {
            templateUrl: 'js/messages/controllers/messagesDetail.html',
            controller: 'messagesDetailController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/about', {
            templateUrl: 'js/common/controllers/about.html',
            controller: 'aboutController',
            data: { authorizedRoles: [USER_ROLES.all] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/debugSettings', {
            templateUrl: 'js/common/controllers/debugSettings.html',
            controller: 'debugSettingsController',
            data: { authorizedRoles: [USER_ROLES.all] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/listSelector/:title', {
            templateUrl: 'js/common/controllers/listSelector.html',
            controller: 'listSelectorController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/autoComplete/:index', {
            templateUrl: 'js/common/controllers/autoComplete.html',
            controller: 'autoCompleteController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        // ============================
        // Account pages
        // ============================
        $routeProvider.when('/accountPages/requestResetPassword', {
            templateUrl: 'js/account/controllers/requestResetPassword.html',
            controller: 'requestResetPasswordController',
            data: { authorizedRoles: [USER_ROLES.empty] },
        });
        $routeProvider.when('/accountPages/resetPassword/:activationCode?', {
            templateUrl: 'js/account/controllers/resetPassword.html',
            controller: 'resetPasswordController',
            data: { authorizedRoles: [USER_ROLES.empty] },
        });
        $routeProvider.when('/accountPages/changePassword', {
            templateUrl: 'js/account/controllers/changePassword.html',
            controller: 'changePasswordController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        // ============================
        // Care request pages
        // ============================
        $routeProvider.when('/careRequest/:id', {
            templateUrl: 'js/careRequests/controllers/careRequestDetail.html',
            controller: 'careRequestDetailController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        $routeProvider.when('/careRequest/:id/update/:status', {
            templateUrl: 'js/careRequests/controllers/careRequestUpdate.html',
            controller: 'careRequestUpdateController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        // ============================
        // Start pages
        // ============================
        $routeProvider.when('/firstStart/defineUrl', {
            templateUrl: 'js/common/controllers/defineUrl.html',
            controller: 'defineUrlController',
            data: { authorizedRoles: [USER_ROLES.empty] }
        });
        $routeProvider.when('/firstStart/defineLanguage', {
            templateUrl: 'js/common/controllers/defineLanguage.html',
            controller: 'defineLanguageController',
            data: { authorizedRoles: [USER_ROLES.empty] }
        });

        // ============================
        // New subscriber pages
        // ============================
        $routeProvider.when('/newSubscriber/profile', {
            templateUrl: 'js/subscriber/controllers/newSubscriberProfile.html',
            controller: 'newSubscriberProfileController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/newSubscriber/residence', {
            templateUrl: 'js/subscriber/controllers/newSubscriberResidence.html',
            controller: 'newSubscriberResidenceController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        // ============================
        // Subscriber pages
        // ============================
        $routeProvider.when('/subscriberPage/:id/profile', {
            templateUrl: 'js/subscriber/controllers/subscriberPageProfile.html',
            controller: 'subscriberPageProfileController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/care', {
            templateUrl: 'js/subscriber/controllers/subscriberPageCare.html',
            controller: 'subscriberPageCareController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/meds', {
            templateUrl: 'js/subscriber/controllers/subscriberPageMeds.html',
            controller: 'subscriberPageMedsController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/devices', {
            templateUrl: 'js/subscriber/controllers/subscriberPageDevices.html',
            controller: 'subscriberPageDevicesController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/alarms', {
            templateUrl: 'js/subscriber/controllers/subscriberPageAlarms.html',
            controller: 'subscriberPageAlarmsController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/map', {
            templateUrl: 'js/subscriber/controllers/subscriberPageMap.html',
            controller: 'subscriberPageMapController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/newNote', {
            templateUrl: 'js/subscriber/controllers/newNote.html',
            controller: 'newNoteController',
            data: { authorizedRoles: [USER_ROLES.empty] }
        });
        $routeProvider.when('/subscriberPage/:id/notes', {
            templateUrl: 'js/subscriber/controllers/subscriberPageNotes.html',
            controller: 'subscriberPageNotesController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/notes/:noteId', {
            templateUrl: 'js/subscriber/controllers/subscriberPageNoteDetail.html',
            controller: 'subscriberPageNoteDetailController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });
        $routeProvider.when('/subscriberPage/:id/frame/:index', {
            templateUrl: 'js/subscriber/controllers/subscriberPageFrame.html',
            controller: 'subscriberPageFrameController',
            data: { authorizedRoles: [USER_ROLES.caregiver] },
            resolve: authorizedResolver
        });

        // ============================
        // Other configuration
        // ============================
        $routeProvider.otherwise({ redirectTo: '/login' });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|file|ms-appx|x-wmapp0):/);

        settingsServiceProvider.addSetting({ name: "LastUsedUsername" });
        settingsServiceProvider.addSetting({ name: "UserSettings", options: { needsParsing: true } });
        settingsServiceProvider.addSetting({ name: "AppearanceSettings", options: { needsParsing: true } });

        localisationServiceProvider.setResourceFilesUrl("../../shared/localisation/");
        localisationServiceProvider.setResourceFileNamePrefix("resources-locale_");
        localisationServiceProvider.setDefaultLanguage("default");

        umoxServiceUrlsProvider.setAlternativeServiceUrls(config.settings.alternativeUrls);

        moduleAuthorizationServiceProvider.supportModuleBasedAuthorization(true);
        moduleAuthorizationServiceProvider.setApplicationSupportedModules([authorizationModuleConstants.Responder]);
    }
);
