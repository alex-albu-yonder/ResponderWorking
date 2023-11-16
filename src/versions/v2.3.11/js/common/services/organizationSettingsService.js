angular.module('verklizan.umox.mobile.common').service('organizationSettingsService',
    function ($q, userSettingsService, settingsService, settingsServiceProxy, objectFieldUtilityService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var organizationSettings;
        var that = this;
        var organizationSettingIds = {
            "SubscriberStatus": new OrganizationSetting("NewSubscriberSettings.NewSubscriberDefaultStatus"),
            "NewDeviceStatus": new OrganizationSetting("LinkDeviceSettings.DeviceLinkDefaultStatus"),
            "UnlinkDeviceStatus": new OrganizationSetting("LinkDeviceSettings.DeviceUnlinkDefaultStatus"),
            "AllowAddSubscriberInResponder": new OrganizationSetting("ResponderUsabilitySettings.AllowAddSubscriberInResponder", true),
            "ShowMedicalTabSheetInResponder": new OrganizationSetting("ResponderUsabilitySettings.ShowMedicalTabSheetInResponder", true),
            "AllowChangeDeviceLinkInResponder": new OrganizationSetting("ResponderUsabilitySettings.AllowChangeDeviceLinkInResponder", true),
            "SaveUsernameAfterLoginInResponder": new OrganizationSetting("ResponderUsabilitySettings.SaveUsernameAfterLoginInResponder", true),
            "AllowSearchSubscriberInResponder": new OrganizationSetting("ResponderUsabilitySettings.AllowSearchSubscriberInResponder", true),
            "CareRequestHistoryLengthDaysInResponder": new OrganizationSetting("ResponderUsabilitySettings.CareRequestHistoryLengthDaysInResponder", 7),
            "AllowAddNotesInResponder": new OrganizationSetting("ResponderUsabilitySettings.AllowAddNotesInResponder", true),
            "ShowSubscriptionNumberOfSubscriberInResponder": new OrganizationSetting("ResponderUsabilitySettings.ShowSubscriptionNumberOfSubscriberInResponder"),
            "ShowAuthenticationIdOfSubscriberInResponder": new OrganizationSetting("ResponderUsabilitySettings.ShowAuthenticationIdOfSubscriberInResponder"),
            "ShowCitizenServiceNumberOfSubscriberInResponder": new OrganizationSetting("ResponderUsabilitySettings.ShowCitizenServiceNumberOfSubscriberInResponder"),
            "OrganizationLogo": new OrganizationSetting("ResponderAppearance.LogoBase64"),
            "OrganizationLogoMimetype": new OrganizationSetting("ResponderAppearance.LogoMimeType"),
            "ShowBannerBehindLogo": new OrganizationSetting("ResponderAppearance.BannerVisible", true),
            "AllowActionArrived": new OrganizationSetting("CareRequestBusinessSettings.AllowResponderToSetArrived"),
            "AllowActionDone": new OrganizationSetting("CareRequestBusinessSettings.AllowResponderToSetDone"),
            "AllowActionDoneIfNotYetArrived": new OrganizationSetting("CareRequestBusinessSettings.ResponderActionDoneSetsArrived"),
            "SendResponderPositionOnArrivedAndDone": new OrganizationSetting("CareRequestBusinessSettings.LetResponderSendPositionOnArrivedAndDone"),
        };

        // ============================
        // Initialisation
        // ============================
        for (var organizationSettingName in organizationSettingIds) {
            createCrudFunctionsForSetting(organizationSettingName);
        }

        // ============================
        // Public Methods
        // ============================
        this.loadOrganizationSettings = function () {
            return loadOrganizationSettings();
        }

        this.getOrganizationSettings = function () {
            if (organizationSettings) {
                return $q.when(organizationSettings);
            }
            else {
                return loadOrganizationSettings();
            }
        }

        // ============================
        // Private Methods
        // ============================
        var loadOrganizationSettings = function () {
            return settingsServiceProxy.getResponderSettings()
                .then(function (response) {
                    organizationSettings = response;

                    persistAppearanceSettings(organizationSettings.ResponderAppearance);
                });
        }

        function createCrudFunctionsForSetting(userSettingName) {
            that["get" + userSettingName] = function () {
                return getSetting(userSettingName);
            }

            that["set" + userSettingName] = function (newValue) {
                saveUserSettingById(userSettingName, newValue);
            }

            that["clear" + userSettingName] = function () {
                clearAndSaveUserSettingById(userSettingName);
            }

            that["is" + userSettingName + "OrganizationSetting"] = function () {
                return getIfSettingIsOrganizationSetting(userSettingName);
            }
        }

        function getSetting(settingId) {
            var organizationSettingValue = getOrganizationSetting(settingId);

            if (organizationSettingValue === null) {
                return getUserSettingById(settingId);
            }
            else {
                return organizationSettingValue;
            }
        }

        function getUserSettingById(settingId) {
            return userSettingsService["get" + settingId]();
        }

        function saveUserSettingById(settingId, settingValue) {
            userSettingsService["set" + settingId](settingValue);
        }

        function clearAndSaveUserSettingById(settingId) {
            userSettingsService["clear" + settingId]();
        }

        function getIfSettingIsOrganizationSetting(settingId) {
            var organizationSetting = getOrganizationSetting(settingId);
            return organizationSetting !== null && typeof organizationSetting !== "undefined";
        }

        function getOrganizationSetting(settingId) {
            var organizationSetting = organizationSettingIds[settingId];

            if (!organizationSetting) {
                throw "Setting id " + settingId + " is not known";
            }

            var organizationSettingValue = objectFieldUtilityService.getFieldValue(organizationSettings, organizationSetting.dtoIdentifier);
            if (organizationSettingValue !== null) {
                return organizationSettingValue;
            }
            else {
                return organizationSetting.defaultValue;
            }
        }

        function persistAppearanceSettings(appearanceSettings) {
            settingsService.setAppearanceSettings(appearanceSettings);
        }

        function OrganizationSetting(settingsDtoIdentifier, defaultValue) {
            this.dtoIdentifier = settingsDtoIdentifier;
            this.defaultValue = defaultValue || null;
        }
    }
);
