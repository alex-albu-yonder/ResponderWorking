angular.module('verklizan.umox.mobile.careRequests').controller('careRequestDetailController',
    function ($scope, $routeParams, domainModel, careRequestDataManager, uiMapHelperService, navigationService,
        launchNavigatorService, localizedNotificationService, deviceService, devicePlatformConstants, promiseLoadingSpinnerService,
        careRequestTypes, organizationSettingsService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.careRequestId = $routeParams.id;
        $scope.careRequest = null;
        $scope.mapErrorMessage = null;
        $scope.emptyDateFormat = "**.**.**";
        $scope.careRequestStatus = domainModel.careRequestStatus;
        $scope.navigationDestination = "";
        $scope.isLoading = promiseLoadingSpinnerService.getIsLoading;
        $scope.careRequestTypes = careRequestTypes;
        $scope.allowAddNotesInResponder = organizationSettingsService.getAllowAddNotesInResponder();
        $scope.allowActionArrived = null;
        $scope.allowActionDone = null;
        $scope.allowActionDoneIfNotYetArrived = null;

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            loadPage();
        });

        // ============================
        // Public Methods
        // ============================
        $scope.setCareRequestStatus = function (status) {
            if (status === $scope.careRequestStatus.Accept && $scope.careRequest.Type === careRequestTypes.autoAssist) {
                var updateCareRequestPromise = careRequestDataManager.updateCareRequestWithNewStatus($scope.careRequestId, status, null)
                    .then(loadPage);

                promiseLoadingSpinnerService.addLoadingPromise(updateCareRequestPromise);
            }
            else {
                navigationService.navigate("/careRequest/" + $scope.careRequestId + "/update/" + status);
            }
        }

        $scope.setCareRequestToCall = function () {
            var acceptWithSpeakPromise = careRequestDataManager.acceptAutoAssistWithSpeak($scope.careRequestId);
            acceptWithSpeakPromise.then(loadPage);
            promiseLoadingSpinnerService.addLoadingPromise(acceptWithSpeakPromise);
        } 

        $scope.declineSpeechRequest = function () {
            var declineWithSpeakPromise = careRequestDataManager.declineSpeechRequest($scope.careRequestId);
            declineWithSpeakPromise.then(loadPage);
            promiseLoadingSpinnerService.addLoadingPromise(declineWithSpeakPromise);
        }

        $scope.canShowMaps = function () {
            if ($scope.careRequest) {
                var careRequestStatus = $scope.careRequest.Status;

                return careRequestStatus === domainModel.careRequestStatus.Send ||
                    careRequestStatus === domainModel.careRequestStatus.RequestReceived ||
                    careRequestStatus === domainModel.careRequestStatus.Accept;
            }
        }

        $scope.canShowStatusTime = function () {
            if ($scope.careRequest) {
                var careRequestStatus = $scope.careRequest.Status;

                return careRequestStatus !== domainModel.careRequestStatus.Send &&
                    careRequestStatus !== domainModel.careRequestStatus.RequestReceived &&
                    careRequestStatus !== domainModel.careRequestStatus.Accept;
            }
        }

        $scope.navigateToSubscriberDetail = function () {
            navigationService.navigate("/subscriberPage/" + $scope.careRequest.SubscriberId + "/profile");
        }

        $scope.openNavigation = function (adress) {
            if (adress) {
                launchNavigatorService.navigate(adress).catch(openNavigateError);
            }
        }

        $scope.createNewNote = function (subscriberId) {
            navigationService.navigate("/subscriberPage/" + subscriberId + "/newNote");
        }

        $scope.canAcceptWithSpeech = function () {
            if (!$scope.careRequest) {
                return;
            }

            var isAutoAssistCareRequest = !isManualCareRequest();
            var careRequestIsWithSpeech = $scope.careRequest.IsWithSpeech;

            return isAutoAssistCareRequest && careRequestIsWithSpeech;
        }

        $scope.canAcceptWithoutSpeech = function () {
            if (!$scope.careRequest) {
                return;
            }

            var hasCorrectState = $scope.careRequest.Status === $scope.careRequestStatus.Send ||
                $scope.careRequest.Status === $scope.careRequestStatus.RequestReceived
            var careRequestIsWithSpeech = $scope.canAcceptWithSpeech();

            return hasCorrectState && !careRequestIsWithSpeech;
        }

        $scope.canClickDeclineCall = function () {
            if (!$scope.careRequest) {
                return;
            }

            var careRequestHasSpeechConnection = $scope.canAcceptWithSpeech();
            var careRequestIsInStartedState = isInStartedState($scope.careRequest);
            return careRequestHasSpeechConnection && !careRequestIsInStartedState;
        }

        $scope.canClickDone = function () {
            if (!$scope.careRequest) {
                return;
            }

            if (!$scope.allowActionDone) {
                return false;
            }

            var isArrivedStatus = $scope.careRequest.Status === domainModel.careRequestStatus.Arrived;
            var isAcceptStatus = $scope.careRequest.Status === domainModel.careRequestStatus.Accept;

            if (isArrivedStatus) {
                return true;
            }
            else if (isAcceptStatus && $scope.allowActionDoneIfNotYetArrived) {
                return true;
            }
            else {
                return false;
            }
        }

        // ============================
        // Private Methods
        // ============================
        var loadPage = function () {
            loadCareRequest($scope.careRequestId).then(function (careRequest) {
                if ($scope.canShowMaps()) {
                    uiMapHelperService.initializeMap($scope.myMap, careRequest.Adress).catch(initializeMapError);
                }

                checkIfStatusUpdateRequestReceivedIsNeeded($scope.careRequestId);
                setOrganizationSettings();
            });

            setNavigationDestination();
        }

        var setOrganizationSettings = function () {
            if (isManualCareRequest()) {
                $scope.allowActionArrived = organizationSettingsService.getAllowActionArrived();
                $scope.allowActionDone = organizationSettingsService.getAllowActionDone();
            }
            else {
                $scope.allowActionArrived = true;
                $scope.allowActionDone = true;
            }
            $scope.allowActionDoneIfNotYetArrived = organizationSettingsService.getAllowActionDoneIfNotYetArrived();
        }

        var loadCareRequest = function (careRequestId) {
            var careRequestPromise = careRequestDataManager.getCareRequestBySessionId(careRequestId).then(function (careRequest) {
                $scope.careRequest = careRequest;

                return careRequest;
            });

            promiseLoadingSpinnerService.addLoadingPromise(careRequestPromise);

            return careRequestPromise;
        }

        var isManualCareRequest = function () {
            return $scope.careRequest.Type !== careRequestTypes.autoAssist;
        }

        var isInStartedState = function (careRequest) {
            return careRequest.Status === $scope.careRequestStatus.Send ||
                careRequest.Status === $scope.careRequestStatus.RequestReceived
        }

        var checkIfStatusUpdateRequestReceivedIsNeeded = function (sessionId) {
            if ($scope.careRequest.Status === domainModel.careRequestStatus.Send) {
                updateCareRequestStatus(sessionId, domainModel.careRequestStatus.RequestReceived);
            }
        }

        var updateCareRequestStatus = function (sessionId, status) {
            var updateCareRequestPromise = careRequestDataManager.updateCareRequestWithNewStatus(sessionId, status)
                .then(function () {
                    loadCareRequest(sessionId);
                });

            promiseLoadingSpinnerService.addLoadingPromise(updateCareRequestPromise);
        }

        var setNavigationDestination = function () {
            var platform = deviceService.platform;

            if (platform === devicePlatformConstants.Android) {
                $scope.navigationDestination = "Google Maps";
            }
            else if (platform === devicePlatformConstants.iOS) {
                $scope.navigationDestination = "Apple Maps";
            }
        }

        var initializeMapError = function (error) {
            $scope.mapErrorMessage = error.localizedErrorMessage;
        }

        var openNavigateError = function () {
            localizedNotificationService.alert("_Alerts_NavigateError_", "_Alerts_NavigateError_Title_", "_Ok_");
        }

    }
);
