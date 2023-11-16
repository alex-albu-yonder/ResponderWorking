angular.module('verklizan.umox.mobile.careRequests').controller('careRequestUpdateController',
    function ($scope, $routeParams, $q, domainModel, careRequestDataManager, domainEnums, navigationService, geolocationService, organizationSettingsService, fieldLengthConstants, promiseLoadingSpinnerService) {
        'use strict';

        $scope.remarkCharacterCountLimit = fieldLengthConstants.careRequestRemark;

        $scope.careRequestId = $routeParams.id;
        $scope.newStatus = parseInt($routeParams.status);
        $scope.statusUpdateRemark = "";
        $scope.statusesToSendPositionWith = [ 
            parseInt(domainEnums.careRequestStatus.Arrived),
            parseInt(domainEnums.careRequestStatus.Done)
        ];
        $scope.SendResponderPositionOnArrivedAndDone = organizationSettingsService.getSendResponderPositionOnArrivedAndDone();

        $scope.sendStatusUpdate = function () {
            if ($scope.remarkIsToLong()) {
                return;
            }

            var sendStatusUpdate = null;
            if ($scope.SendResponderPositionOnArrivedAndDone && $scope.statusesToSendPositionWith.includes($scope.newStatus)) {
                sendStatusUpdate = getLocationInfoOfThisDevice().then(function (locationInfo) { 
                    return careRequestDataManager.updateCareRequestWithNewStatus($scope.careRequestId, $scope.newStatus, $scope.statusUpdateRemark + " " + locationInfo); 
                });
            }
            else {
                sendStatusUpdate = careRequestDataManager.updateCareRequestWithNewStatus($scope.careRequestId, $scope.newStatus, $scope.statusUpdateRemark);
            }
            sendStatusUpdate = sendStatusUpdate.then(navigateBack);

            promiseLoadingSpinnerService.addLoadingPromise(sendStatusUpdate);
        }

        $scope.remarkIsToLong = function () {
            return $scope.remarkCharactersStillAvailable() < 0;
        }

        $scope.remarkPercentageCharactersAvailable = function () {
            return $scope.remarkCharactersStillAvailable() * 100 / $scope.statusUpdateRemark.length;
        }

        $scope.remarkCharactersStillAvailable = function () {
            return $scope.remarkCharacterCountLimit - $scope.statusUpdateRemark.length;
        }

        var navigateBack = function () {
            if (needsToNavigateHomeWithStatus($scope.newStatus)) {
                navigationService.goBackMultiplePages(2);
            } else {
                navigationService.goBack();
            }
        }

        var needsToNavigateHomeWithStatus = function (status) {
            return status === domainModel.careRequestStatus.Decline || status === domainModel.careRequestStatus.Done;
        }

        var getLocationInfoOfThisDevice = function () {
            var deffered = $q.defer();
            
            var options = {
                enableHighAccuracy: true,
                timeout: 3000
            };
            geolocationService.getCurrentPosition(options)
                .then(function (position) {
                    deffered.resolve("LOC={" + position.coords.latitude + " " + position.coords.longitude + "}");
                })
                .catch(function (error) {
                    deffered.resolve("LOC={" + error.code + "}");
                });

            return deffered.promise;
        }
    }
);
