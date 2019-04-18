angular.module('verklizan.umox.mobile.subscriber').factory('contractManagementServiceRequestModel',
    function () {
        "use strict";
        var requestData = {};

        requestData.createsubscriberdevicelink = function (subscriberId, deviceId, stateId) {
            return subscriberDeviceLink(subscriberId, deviceId, stateId);
        };

        requestData.deletesubscriberdevicelink = function (subscriberId, deviceId, stateId) {
            return subscriberDeviceLink(subscriberId, deviceId, stateId);
        };

        var subscriberDeviceLink = function (subscriberId, deviceId, stateId) {
            return {
                subscriberId: subscriberId,
                deviceId: deviceId,
                newDeviceStateId: stateId
            };
        }

        requestData.createresidencedevicelink = function (residenceId, deviceId, stateId) {
            return residenceDeviceLink(residenceId, deviceId, stateId);
        };

        requestData.deleteresidencedevicelink = function (residenceId, deviceId, stateId) {
            return residenceDeviceLink(residenceId, deviceId, stateId);
        };

        var residenceDeviceLink = function (residenceId, deviceId, stateId) {
            return {
                residenceId: residenceId,
                deviceId: deviceId,
                newDeviceStateId: stateId
            };
        }

        return requestData;
    }
    );
