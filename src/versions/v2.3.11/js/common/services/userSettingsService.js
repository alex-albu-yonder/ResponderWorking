angular.module('verklizan.umox.mobile.common').service('userSettingsService',
    function (settingsService, userDataManager) {
        'use strict';

        var that = this;
        var userSettingIds = [
            "SubscriberStatus",
            "NewDeviceStatus",
            "UnlinkDeviceStatus",
            "LastSeenOrganizationNoteIndex",
            "RecentSubscriberViews",
            "PushTelNumber",
            "PushIsEnabled",
            "FaceTimeId",
            "IsFaceTimeEnabled",
            "LocationUnavailableMessageIsShown",
            "IsInDebugMode",
            "AutoCareRequestEnabled",
            "AutoCareRequestInterval"
        ];

        function ResponderUserSettings(userId) {
            this.userId = userId;
            this.settings = {};
        }

        // ============================
        // Public Methods
        // ============================
        for (var i = 0; i < userSettingIds.length; i++) {
            var userSettingName = userSettingIds[i];

            createCrudFunctionsForSetting(userSettingName);
        }

        // ============================
        // Private Methods
        // ============================
        function createCrudFunctionsForSetting(userSettingName) {
            that["get" + userSettingName] = function () {
                return getUserSettingById(userSettingName);
            }

            that["set" + userSettingName] = function (newValue) {
                setAndSaveUserSettingById(userSettingName, newValue);
            }

            that["clear" + userSettingName] = function () {
                clearAndSaveUserSettingById(userSettingName);
            }
        }

        function getUserSettingById(settingId) {
            var userSettings = getUserSettings();

            return userSettings.settings[settingId];
        }

        function setAndSaveUserSettingById(settingId, settingValue) {
            var userSettings = getUserSettings();

            userSettings.settings[settingId] = settingValue;

            setUserSettings(userSettings);
        }

        function clearAndSaveUserSettingById(settingId) {
            var userSettings = getUserSettings();

            userSettings.settings[settingId] = "";

            setUserSettings(userSettings);
        }

        function getUserSettings() {
            var currentUserSettings = settingsService.getUserSettings();

            if (!currentUserSettings || determinedThatSettingsAreOfOtherUser(currentUserSettings)) {
                var currentUserId = userDataManager.getUserId();
                currentUserSettings = createNewUserSettings(currentUserId);
            }

            return currentUserSettings;
        }

        function determinedThatSettingsAreOfOtherUser(currentUserSettings) {
            var currentUserId = userDataManager.getUserId();
            return userDataManager.isAuthorized() && currentUserId !== currentUserSettings.userId;
        }

        function createNewUserSettings(currentUserId) {
            var freshUserSettings = new ResponderUserSettings(currentUserId);

            setUserSettings(freshUserSettings);
            return freshUserSettings;
        }

        function setUserSettings(userSettings) {
            return settingsService.setUserSettings(userSettings);
        }
    }
);
