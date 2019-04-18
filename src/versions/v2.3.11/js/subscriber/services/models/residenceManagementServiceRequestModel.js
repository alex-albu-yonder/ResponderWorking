angular.module('verklizan.umox.mobile.subscriber').factory('residenceManagementServiceRequestModel',
    function (domainModel) {
        'use strict';
        var requestData = {};

        requestData.readresidence = function (residenceId) {
            return {
                residenceId: residenceId
            };
        };

        requestData.createresidence = function (houseNr, street, city, region, postcode, phone, organization) {
            return {
                residence: new domainModel.residence(houseNr, street, city, region, postcode, phone, organization)
            };
        };

        return requestData;
    }
    );