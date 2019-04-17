angular.module('verklizan.umox.mobile.subscriber').factory('deviceManagementServiceRequestModel',
    function (pageSize, domainModel) {
        "use strict";
        var requestData = {};

        requestData.readdevicesforsubscriberresidencepage = function (subscriberId, pageNumber, _pageSize) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(pageNumber, _pageSize),
                filters: null,
                sort: null
            };
        };

        requestData.searchdevice = function (searchText, pageNumber, _pageSize, filterOnReadyForPlacement, organizationIdToFilterOn) {

            // Add filters.
            var filterItems = [];

            // - ReadyForPlacement
            if (filterOnReadyForPlacement) {
                filterItems.push(new domainModel.filterDescriptorItem("State.ReadyForPlacement", true, domainModel.filterOperation.Equals));
            }

            // - OrganizationId
            if (organizationIdToFilterOn) {
                filterItems.push(new domainModel.filterDescriptorItem("OrganizationId", organizationIdToFilterOn, domainModel.filterOperation.Equals));
            }

            // Create a filterdescriptor list when filters have been added.
            var filterDescriptorList = null;
            if (filterItems.length !== 0) {
                filterDescriptorList = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);
            }

            return {
                searchText: searchText,
                pageDescriptor: new domainModel.pageDescriptor(pageNumber, _pageSize),
                filters: filterDescriptorList,
                sort: new domainModel.sortDescriptor(true, "Code")
            };
        };

        requestData.readdevicestatepage = function (pageIndex, organizationId) {
            var filterDescriptor;

            if (organizationId) {
                var filterItems = [new domainModel.filterDescriptorItem("OrganizationId", organizationId, domainModel.filterOperation.Equals)];
                filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);
            }

            return {
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize.Large),
                filters: filterDescriptor,
                sort: null
            };
        };

        return requestData;
    }
);