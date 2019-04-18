angular.module('verklizan.umox.mobile.subscriber').service('searchSubscriberDataManager',
    function ($rootScope, subscriberManagementServiceProxy, descriptorFactory) {
        'use strict';

        // ============================
        // Public Methods
        // ============================
        this.searchSubscribers = function (searchText, pageIndex) {
            var requestData = descriptorFactory.readNormalData(pageIndex);
             
            return subscriberManagementServiceProxy.searchSubscribers(searchText, requestData.filters, requestData.sort, requestData.pageDescriptor);
        };
    }
);
