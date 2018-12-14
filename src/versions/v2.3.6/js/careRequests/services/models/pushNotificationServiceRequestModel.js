angular.module('verklizan.umox.mobile.careRequests').factory('pushNotificationServiceRequestModel',
    function (pageSize, domainModel) {
        'use strict';
        var requestData = {};

        requestData.updateCareRequestStatus = function (sessionId, status, phoneNumber, remark) {
            return {
                requestMessage: {
                    SessionId: sessionId,
                    Status: status,
                    PhoneNumber: phoneNumber,
                    Remark: remark
                }
            }
        };

        requestData.acceptCareRequestWithSpeak = function (sessionId) {
            return {
                sessionId : sessionId
            }
        }

        requestData.readCareRequestPage = function (phoneNumber) {
            var filterItems = [];
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Done.toString(), domainModel.filterOperation.Not));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Decline.toString(), domainModel.filterOperation.Not));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Cancelled.toString(), domainModel.filterOperation.Not));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Closed.toString(), domainModel.filterOperation.Not));
            var filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.And);

            return readCareRequestPageRequestData(phoneNumber, filterDescriptor, pageSize.Large);
        };

        requestData.readCareRequestPageHistory = function (phoneNumber) {
            var filterItems = [];
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Done.toString(), domainModel.filterOperation.Equals));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Decline.toString(), domainModel.filterOperation.Equals));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Cancelled.toString(), domainModel.filterOperation.Equals));
            filterItems.push(new domainModel.filterDescriptorItem("Status", domainModel.careRequestStatus.Closed.toString(), domainModel.filterOperation.Equals));
            var filterDescriptor = new domainModel.filterDescriptor(filterItems, domainModel.filterOperator.Or);

            return readCareRequestPageRequestData(phoneNumber, filterDescriptor, pageSize.Large);
        };

        var readCareRequestPageRequestData = function (phoneNumber, filterDescriptor, _pageSize) {
            return {
                phoneNumber: phoneNumber,
                pageDescriptor: new domainModel.pageDescriptor(0, _pageSize),
                filters: filterDescriptor,
                sort: null
            }
        }

        requestData.getCareRequest = function (sessionId) {
            return {
                sessionId: sessionId
            }
        };

        requestData.registerDevice = function (phoneNumber, token, operatingSystemType, subscriptionType) {
            return {
                device: {
                    PhoneNumber: phoneNumber,
                    Token: token,
                    Type: operatingSystemType
                },
                subscriptionType: subscriptionType
            };
        }

        requestData.unregisterDevice = function (phoneNumber, subscriptionType) {
            return {
                phoneNumber: phoneNumber,
                subscriptionType: subscriptionType
            }
        }
        return requestData;
    }
);