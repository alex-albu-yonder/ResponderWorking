angular.module('verklizan.umox.mobile.common').factory('supportingDataManagementServiceRequestModel',
    function (pageSize, domainModel) {
        'use strict';

        var requestData = {};

        requestData.readorganizationnotepage = function (organizationId, dateOffset, pageIndex, _pageSize) {
            var filterDescriptor = null;

            if (dateOffset !== null) {
                //Create filter
                var filterItems = [
                    new domainModel.filterDescriptorItem("ValidPeriod.FromDate", dateOffset, domainModel.filterOperation.Greater)
                ];

                filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);
            }

            return {
                organizationId: organizationId,
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, _pageSize),
                filters: filterDescriptor,
                sort: new domainModel.sortDescriptor(false, "SortIndex")
            };
        };

        requestData.createorganizationnote = function (companyId, subject, content, fromDate, toDate) {
            return {
                note: new domainModel.organizationNote(companyId, subject, content, fromDate, toDate)
            };
        };

        requestData.readNewOrganizationMessageCount = function (sortIndex) {
            return {
                currentSortIndex: sortIndex
            };
        }

        requestData.readcitypage = function (pageIndex, organizationId) {
            var filterDescriptor;

            if (organizationId) {
                var filterItems = [
                    new domainModel.filterDescriptorItem("OrganizationId", organizationId, domainModel.filterOperation.Equals),
                    new domainModel.filterDescriptorItem("Selectable", true, domainModel.filterOperation.Equals)
                ];
                filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);
            }

            return {
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize.XXLarge),
                filters: filterDescriptor,
                sort: null
            }
        };

        requestData.readregionpage = function (pageIndex, organizationId) {
            var filterDescriptor;

            if (organizationId) {
                var filterItems = [
                    new domainModel.filterDescriptorItem("OrganizationId", organizationId, domainModel.filterOperation.Equals)
                ];
                filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);
            }

            return {
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize.Large),
                filters: filterDescriptor,
                sort: null
            }
        };

        requestData.readorganizationpage = function (pageIndex) {
            return requestData.createSimpleRequestData(pageIndex, pageSize.Large);
        }

        requestData.createSimpleRequestData = function (pageIndex, _pageSize) {
            return {
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, _pageSize),
                filters: null,
                sort: null
            };
        }

        requestData.readContractVersion = function (clientName) {
            return {
                client: clientName
            }
        }

        return requestData;
    }
);