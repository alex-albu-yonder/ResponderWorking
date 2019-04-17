angular.module('verklizan.umox.mobile.common').service('careRequestAutoResponseService',
    function ($q, $timeout, userSettingsService, careRequestDataManager, domainEnums) {
        'use strict';

        this.handleAutomaticResponse = function (careRequests) {
            var automaticResponseInterval = userSettingsService.getAutoCareRequestInterval();

            return $timeout(sendAutomaticResponses, automaticResponseInterval, true, careRequests);
        }

        var sendAutomaticResponses = function (careRequests) {
            var requestPromises = [];
            console.log("starting sending automatic responses")
            for (var i = 0; i < careRequests.length; i++) {
                var currentCareRequest = careRequests[i];

                var nextStatus = determineNextStateFromCareRequestState(currentCareRequest.Status);
                console.log("next status will be " + nextStatus);

                if (nextStatus !== domainEnums.careRequestStatus.Unknown) {
                    var promise = careRequestDataManager.updateCareRequestWithNewStatus(currentCareRequest.SessionId, nextStatus, "Automatic update by Responder App");
                    requestPromises.push(promise);
                }
            }

            return $q.all(requestPromises);
        }

        var determineNextStateFromCareRequestState = function (careRequestStatus) {
            switch (careRequestStatus) {
                case domainEnums.careRequestStatus.Send:
                case domainEnums.careRequestStatus.RequestReceived:
                    return domainEnums.careRequestStatus.Accept;
                case domainEnums.careRequestStatus.Accept:
                    return domainEnums.careRequestStatus.Arrived;
                case domainEnums.careRequestStatus.Arrived:
                    return domainEnums.careRequestStatus.Done;
                default:
                    return domainEnums.careRequestStatus.Unknown;
            }
        }
    }
);
