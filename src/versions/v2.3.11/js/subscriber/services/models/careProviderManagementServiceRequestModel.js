angular.module('verklizan.umox.mobile.subscriber').factory('careProviderManagementServiceRequestModel',
    function (domainModel, pageSize) {
        'use strict';

        var requestData = {};

        requestData.readCaregiversForSubscriberResidenceSchemePage = function (subscriberId, pageIndex, pageSize) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize),
                filters: null,
                sort: null
            };
        };

        requestData.readProfessionalCaregiverContactItemPage = function(caregiverId) {
            return {
                caregiverId: caregiverId,
                pageDescriptor: new domainModel.pageDescriptor(0, pageSize.Large),
                filters: null,
                sort: null
            }
        }

        return requestData;
    }
);
