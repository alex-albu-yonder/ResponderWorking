angular.module('verklizan.umox.mobile.careRequests').controller('careRequestUpdateController',
    function ($scope, $routeParams, domainModel, careRequestDataManager, navigationService, fieldLengthConstants, promiseLoadingSpinnerService) {
        'use strict';

        $scope.remarkCharacterCountLimit = fieldLengthConstants.careRequestRemark;

        $scope.careRequestId = $routeParams.id;
        $scope.newStatus = parseInt($routeParams.status);
        $scope.statusUpdateRemark = "";

        $scope.sendStatusUpdate = function () {
            if ($scope.remarkIsToLong()) {
                return;
            }

            var updateCareRequestPromise = careRequestDataManager.updateCareRequestWithNewStatus($scope.careRequestId, $scope.newStatus, $scope.statusUpdateRemark)
                .then(careRequestStatusUpdated);

            promiseLoadingSpinnerService.addLoadingPromise(updateCareRequestPromise);
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

        var careRequestStatusUpdated = function () {
            if (needsToNavigateHomeWithStatus($scope.newStatus)) {
                navigationService.goBackMultiplePages(2);
            } else {
                navigationService.goBack();
            }
        }

        var needsToNavigateHomeWithStatus = function (status) {
            return status === domainModel.careRequestStatus.Decline || status === domainModel.careRequestStatus.Done;
        }
    }
);
