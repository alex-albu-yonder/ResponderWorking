angular.module('verklizan.umox.mobile.careRequests').service('careRequestDataManager',
    function ($q, config, webRequestService, pushNotificationServiceRequestModel, pushNotificationSettingsService,
        pushNotificationServiceProxy, GenericHttpErrorHandler, descriptorFactory, domainEnums, descriptors,
        organizationSettingsService) {
        'use strict';
        var that = this;

        // ============================
        // Public Methods
        // ============================
        this.getCareRequestsOfToday = function () {
            if (config.testData && config.testData.overrideCareRequests) {
                return $q.when([config.testData.manualCareRequest]);
            }

            var phoneNumber = pushNotificationSettingsService.getPushTelNumber();
            if (!phoneNumber) {
                return $q.reject();
            }

            var filterItems = [];
            filterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Done.toString(), domainEnums.filterOperation.Not));
            filterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Decline.toString(), domainEnums.filterOperation.Not));
            filterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Cancelled.toString(), domainEnums.filterOperation.Not));
            filterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Closed.toString(), domainEnums.filterOperation.Not));
            var filterDescriptor = new descriptors.filterDescriptor(filterItems, domainEnums.filterOperator.And);

            var requestData = descriptorFactory.readLargeData(0, filterItems);
            var sortDescriptor = new descriptors.sortDescriptor(false, 'AlarmFiredTime');

            return pushNotificationServiceProxy
                .readCareRequestPage(phoneNumber, filterDescriptor, sortDescriptor, requestData.pageDescriptor)
                .then(readCareRequestPageSuccess);
        };

        this.getPreviousCareRequests = function () {
            var phoneNumber = pushNotificationSettingsService.getPushTelNumber();
            if (!phoneNumber) {
                return $q.reject();
            }

            var statusFilterItems = [];
            statusFilterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Done.toString(), domainEnums.filterOperation.Equals));
            statusFilterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Decline.toString(), domainEnums.filterOperation.Equals));
            statusFilterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Cancelled.toString(), domainEnums.filterOperation.Equals));
            statusFilterItems.push(new descriptors.filterDescriptorItem("Status", domainEnums.careRequestStatus.Closed.toString(), domainEnums.filterOperation.Equals));
            var statusFilterDescriptor = new descriptors.filterDescriptor(statusFilterItems , domainEnums.filterOperator.Or);

            var dayFilters = [];
            dayFilters.push(new descriptors.filterDescriptorItem("AlarmFiredTime", getMaxCareRequestDateHistory(), domainEnums.filterOperation.Greater));
            var dayFilterDescriptor = new descriptors.filterDescriptor(dayFilters, domainEnums.filterOperator.And);

            var filterDescriptor = new descriptors.filterDescriptor([statusFilterDescriptor, dayFilterDescriptor] , domainEnums.filterOperator.And);

            var requestData = descriptorFactory.readLargeData(0);
            var sortDescriptor = new descriptors.sortDescriptor(false, 'AlarmFiredTime');

            return pushNotificationServiceProxy
                .readCareRequestPage(phoneNumber, filterDescriptor, sortDescriptor, requestData.pageDescriptor)
                .then(readCareRequestPageSuccess);
        };

        this.updateCareRequestWithNewStatus = function (sessionId, status, remark) {
            var phoneNumber = pushNotificationSettingsService.getPushTelNumber();

            var requestMessage = {
                SessionId: sessionId,
                Status: status,
                PhoneNumber: phoneNumber,
                Remark: remark
            }

            return pushNotificationServiceProxy.updateCareRequestStatus(requestMessage);
        };

        this.acceptAutoAssistWithSpeak = function (sessionId) {
            return pushNotificationServiceProxy.acceptCareRequestWithSpeak(sessionId);
        }

        this.declineSpeechRequest = function (sessionId) {
            return pushNotificationServiceProxy.declineSpeechRequest(sessionId);
        }

        this.getCareRequestBySessionId = function (sessionId) {
            if (!sessionId) {
                return $q.reject("must provide a session id");
            }

            if (config.testData && sessionId === config.testData.manualCareRequest.SessionId) {
                return $q.when(config.testData.manualCareRequest);
            }

            return pushNotificationServiceProxy.getCareRequest(sessionId);
        };

        // ============================
        // Private Methods
        // ============================
        var getMaxCareRequestDateHistory = function() {
            var daysThatNeedToBeSubstracted = organizationSettingsService.getCareRequestHistoryLengthDaysInResponder();
            var dateOfAuthorization = new Date(new Date().setDate(new Date().getDate()-daysThatNeedToBeSubstracted));
            return dateOfAuthorization;
        }

        var readCareRequestPageSuccess = function (result) {
            var data = result.CareRequests;

            return data;
        }
    }
);
