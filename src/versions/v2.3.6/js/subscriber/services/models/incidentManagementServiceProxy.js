angular.module('verklizan.umox.mobile.subscriber').factory('incidentManagementServiceRequestModel',
    function (domainModel) {
        "use strict";
        var requestData = {};

        requestData.readincidentpageforsubscriber = function (subscriberId, pageIndex, pageSize) {
            return createSortedRequestModelForSubscriber(subscriberId, pageIndex, pageSize);
        };

        requestData.createSortedRequestModel = function (pageIndex, pageSize) {
            return createSortedRequestModelForSubscriber(null, pageIndex, pageSize);
        }

        var createSortedRequestModelForSubscriber = function (subscriberId, pageIndex, pageSize) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize),
                filter: null,
                sort: new domainModel.sortDescriptor(false, "StartTime")
            };
        }

        return requestData;
    }
);