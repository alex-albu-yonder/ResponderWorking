angular.module('verklizan.umox.mobile.subscriber').service('deviceDataManager',
    function ($rootScope, organizationSettingsService, supportingDataManager, deviceManagementServiceProxy,
        contractManagementServiceProxy, userDataManager, descriptorFactory, domainEnums) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var currentSubscriberDevices = null;
        var SUBSCRIBER_LINK_ENUM = 2;
        var RESIDENCE_LINK_ENUM = 3;
        //#endregion

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        this.loadDeviceInformationPage = function (subscriberId, pageNumber, pageSize) {
            return getDevicesPage(subscriberId, pageNumber, pageSize);
        };

        this.searchDevice = function (searchText, pageNumber, pageSize) {
            return searchDevices(searchText, pageNumber, pageSize);
        };

        this.linkDevice = function (subscriberId, residenceId, newDeviceId) {
            if (currentSubscriberDevices && currentSubscriberDevices.length === 0) { //Link
                return onlyLinkDeviceToSubscriber(subscriberId, newDeviceId);
            } else if (currentSubscriberDevices && currentSubscriberDevices.length === 1) { //Link and replace
                var oldDevice = currentSubscriberDevices[0];
                var statusId = supportingDataManager.getDeviceState(oldDevice.State);
                var unlinkId = organizationSettingsService.getUnlinkDeviceStatus();

                //check if the previous device was residence or subscriber attached, and do the same with the new one
                if (oldDevice.LinkingOfDevice === SUBSCRIBER_LINK_ENUM) {
                    return linkAndReplaceDeviceToSubscriber(oldDevice.Id, subscriberId, newDeviceId, statusId, unlinkId);
                } else if (oldDevice.LinkingOfDevice === RESIDENCE_LINK_ENUM) {
                    return linkAndReplaceDeviceToResidence(oldDevice.Id, residenceId, newDeviceId, statusId, unlinkId);
                }

            }
        };
        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var onlyLinkDeviceToSubscriber = function (subscriberId, newDeviceId) {
            var deviceStateId = organizationSettingsService.getNewDeviceStatus();

            if (deviceStateId) {
                return linkDeviceToSubscriber(subscriberId, newDeviceId, deviceStateId);
            }
        }

        var linkAndReplaceDeviceToSubscriber = function (oldDeviceId, subscriberId, newDeviceId, statusId, unlinkId) {
            return linkDeviceToSubscriber(subscriberId, newDeviceId, statusId).then(function (response) {
                console.log("new is linked");
                return unLinkDeviceFromSubscriber(subscriberId, oldDeviceId, unlinkId);
            }).then(function (response) {
                console.log("old is unlinked");
            });
        }

        var linkAndReplaceDeviceToResidence = function (oldDeviceId, residenceId, newDeviceId, statusId, unlinkId) {
            return linkDeviceToResidence(residenceId, newDeviceId, statusId).then(function (response) {
                console.log("new is linked");
                return unLinkDeviceFromResidence(residenceId, oldDeviceId, unlinkId);
            }).then(function (response) {
                console.log("old is unlinked");
            });
        }

        var getDevicesPage = function (subscriberId, pageNumber) {
            var requestData = descriptorFactory.readNormalData(pageNumber);

            return deviceManagementServiceProxy
                .readDevicesForSubscriberResidencePage(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor)
                .then(function (response) {
                    currentSubscriberDevices = response.Rows;
                    return response;
                });
        };

        var searchDevices = function (searchText, pageNumber, pageSize) {
            var organizationId = userDataManager.getUserOrganizationId();
            var organizationIdFilter = new descriptorFactory
                .FilterOptionObject('OrganizationId', organizationId, domainEnums.filterOperation.Equals);
            var readyForPlacementFilter = new descriptorFactory
                .FilterOptionObject('State.ReadyForPlacement', true, domainEnums.filterOperation.Equals);
            var contractIsNullFilter = new descriptorFactory
                .FilterOptionObject('Contract', true, domainEnums.filterOperation.IsNULL);

            var requestData = descriptorFactory.readNormalData(pageNumber, [organizationIdFilter, readyForPlacementFilter, contractIsNullFilter]);

            return deviceManagementServiceProxy.searchDevice(searchText, requestData.filters, requestData.sort, requestData.pageDescriptor);
        };

        var linkDeviceToSubscriber = function (subscriberId, deviceId, deviceStateId) {
            return contractManagementServiceProxy.createSubscriberDeviceLink(subscriberId, deviceId, deviceStateId);
        };

        var unLinkDeviceFromSubscriber = function (subscriberId, deviceId, deviceStateId) {
            return contractManagementServiceProxy.deleteSubscriberDeviceLink(subscriberId, deviceId, deviceStateId);
        };

        var linkDeviceToResidence = function (residenceId, deviceId, deviceStateId) {
            return contractManagementServiceProxy.createResidenceDeviceLink(residenceId, deviceId, deviceStateId);
        };

        var unLinkDeviceFromResidence = function (residenceId, deviceId, deviceStateId) {
            return contractManagementServiceProxy.deleteResidenceDeviceLink(residenceId, deviceId, deviceStateId);
        };
        //#endregion

    }
);
