angular.module('verklizan.umox.mobile.subscriber').factory('subscriberManagementServiceRequestModel',
    function (pageSize, domainModel) {
        'use strict';
        var requestData = {};

        requestData.searchSubscribers = function (searchText, pageIndex, pageSize) {
            return {
                searchText: searchText,
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize),
                filters: null,
                sort: null
            };
        };

        requestData.readsubscriber = function (subscriberId) {
            return {
                subscriberId: subscriberId
            };
        };

        requestData.createsubscriber = function (subscriberProfile, birthDate, status, organization, residence) {
            return {
                subscriber: new domainModel.subscriber(subscriberProfile, birthDate, status, organization, null, residence)
            };
        };

        requestData.readsubscriberstatepage = function (pageIndex, organizationId) {
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

        requestData.readmedicalinfopage = function (subscriberId) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(0, pageSize.Large),
                filters: null,
                sort: null
            };
        };

        requestData.readmedicationpage = function (subscriberId) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(0, pageSize.Large),
                filters: null,
                sort: null
            };
        };

        requestData.createsubscribernote = function (personId, subject, content, crmCheck, callCheck, photo) {
            return {
                note: new domainModel.subscriberNote(personId, subject, content, crmCheck, callCheck, photo)
            };
        };

        requestData.readsubscribernote = function (noteId) {
            return {
                noteId: noteId
            }
        }

        requestData.readsubscribernotepage = function (subscriberId, pageIndex, pageSize) {
            return {
                subscriberId: subscriberId,
                pageDescriptor: new domainModel.pageDescriptor(pageIndex, pageSize),
                filters: null,
                sort: null
            };
        };

        return requestData;
    }
);