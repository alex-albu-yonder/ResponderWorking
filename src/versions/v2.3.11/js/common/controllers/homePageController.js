angular.module('verklizan.umox.mobile.common').controller('homePageController',
    function homePageController($scope, messageDataManager, navigationService,
        pushNotificationSettingsService, organizationSettingsService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.pushIsEnabled = pushNotificationSettingsService.getIsPushEnabled();
        $scope.newMessageCount = 0;

        $scope.settings = {
            allowAddSubscriberInResponder : organizationSettingsService.getAllowAddSubscriberInResponder(),
            allowSearchSubscriberInResponder: organizationSettingsService.getAllowSearchSubscriberInResponder(),
            saveUsernameAfterLoginInResponder: organizationSettingsService.getSaveUsernameAfterLoginInResponder()
        }

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            getNewMessageCount();
        });

        // ============================
        // Public methods
        // ============================
        $scope.navigate = function (location) {
            console.log("Navigate: " + location);
            navigationService.navigate(location);
        };

        // ============================
        // Private methods
        // ============================

        var getNewMessageCount = function () {
            messageDataManager.getNewMessageCount().then(function (messageCount) {
                $scope.newMessageCount = messageCount;
            });
        }
    }
);
