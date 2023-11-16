angular.module('verklizan.umox.mobile.careRequests').controller('careRequestDetailController',
    function ($document, $scope, $q, $routeParams, domainModel, careRequestDataManager, uiMapHelperService, navigationService,
        launchNavigatorService, localizedNotificationService, deviceService, devicePlatformConstants, promiseLoadingSpinnerService,
        careRequestTypes, mapConstants, organizationSettingsService, pomasServiceProxy, settingsService, userSettingsService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.careRequestId = $routeParams.id;
        $scope.careRequest = null;
        $scope.mapErrorMessage = null;
        $scope.emptyDateFormat = "**.**.**";
        $scope.careRequestStatus = domainModel.careRequestStatus;
        $scope.subscriberAddressCoordinates = null;
        $scope.alarmPositionObject = null;
        $scope.destinationCoordinatesOnMap = null;
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

        $scope.openNavigation = function (coordinates) {
            launchNavigatorService.navigate([coordinates.latitude, coordinates.longitude]).catch(openNavigateError);
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
                var loadAlarmPosition = getPositionOfAlarm(careRequest).then(function (positionObject) {
                    $scope.alarmPositionObject = positionObject;
                });
                var loadSubscriberAddressCoordinates = uiMapHelperService.getCoordinatesOfAddress(careRequest.Adress).then(function (googleMapsCoordinates) {
                    $scope.subscriberAddressCoordinates = { latitude: googleMapsCoordinates.lat(), longitude: googleMapsCoordinates.lng() };
                });

                if ($scope.canShowMaps()) {
                    $q.allSettled([loadAlarmPosition, loadSubscriberAddressCoordinates]).then(function () {
                        if ($scope.alarmPositionObject !== null) {
                            displayRouteOnMap(
                                parseFloat($scope.alarmPositionObject.latitude), 
                                parseFloat($scope.alarmPositionObject.longitude), 
                                mapConstants.markerTypes.subscriber);
                        }
                        else {
                            displayRouteOnMap(
                                $scope.subscriberAddressCoordinates.latitude, 
                                $scope.subscriberAddressCoordinates.longitude, 
                                mapConstants.markerTypes.subscriberHome);
                        }
                    });
                }
                checkIfStatusUpdateRequestReceivedIsNeeded($scope.careRequestId);
                setOrganizationSettings();
            });
        }

        var displayRouteOnMap = function (destinationLatitude, destinationLongitude, destinationMarker) {
            $scope.destinationCoordinatesOnMap = { latitude: destinationLatitude, longitude: destinationLongitude };
            var googleMapsCoordinates = new google.maps.LatLng({ lat: destinationLatitude, lng: destinationLongitude });
            return uiMapHelperService
                .initializeMap($scope.myMap, googleMapsCoordinates, mapConstants.markerTypes.responder, destinationMarker)
                .then(addNavigationButtonToMap)
                .catch(initializeMapError);
        }

        var addNavigationButtonToMap = function() {
            var controlDiv = document.createElement("div");

            var controlUI = document.createElement("div");
            controlUI.classList.add("navigationButtonInMap");
            controlDiv.appendChild(controlUI);

            var controlImage = document.createElement("div");
            controlUI.appendChild(controlImage);
            
            controlUI.addEventListener("click", function () {
                $scope.openNavigation($scope.destinationCoordinatesOnMap);
            });

            $scope.myMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
        }

        var getPositionOfAlarm = function (careRequest) {
            var deferred = $q.defer();
            var pomasServiceExists = settingsService.getPomasServiceExists();
            if (careRequest.IncidentId && pomasServiceExists) {
                pomasServiceProxy
                    .getPositionByIncidentId(userSettingsService.getPomasAuthenticationCredentials(), careRequest.IncidentId)
                    .then(function (success) {
                        deferred.resolve(success.data);
                    })
                    .catch(function (error) {
                        deferred.reject();
                    });
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
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

        var initializeMapError = function (error) {
            $scope.mapErrorMessage = error.localizedErrorMessage;
        }

        var openNavigateError = function () {
            localizedNotificationService.alert("_Alerts_NavigateError_", "_Alerts_NavigateError_Title_", "_Ok_");
        }
        
    }
);
