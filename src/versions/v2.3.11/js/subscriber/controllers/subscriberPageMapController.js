angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageMapController',
    function subscriberPageMapController($routeParams, $scope, subscriberDataManager, uiMapHelperService, launchNavigatorService,
        localizedNotificationService, promiseLoadingSpinnerService) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var subscriberId = $routeParams.id;
        var residenceInfoPromise;
        var destinationAddres;
        //#endregion


        //#region Public Fields
        // ============================
        // Public Fields
        // ============================
        $scope.mapIsEnabled = false;
        $scope.mapIsUnusable = false;
        $scope.profileInfo = null;
        $scope.isLoading = promiseLoadingSpinnerService.getIsLoading;
        $scope.pageMessage = "";
        //#endregion


        //#region Events
        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            var subscriberInfoPromise = subscriberDataManager.getSubscriberInfo(subscriberId).then(subscriberInfoReceived);
            promiseLoadingSpinnerService.addLoadingPromise(subscriberInfoPromise);
        });
        //#endregion  

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        $scope.goToExternalNavigation = function() {
            residenceInfoPromise.then(function () {
                launchNavigatorService.navigate(destinationAddres).catch(startNavigateError);
            });
        }

        //#endregion 
        

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var subscriberInfoReceived = function (profileInfo) {
            $scope.profileInfo = profileInfo;

            if ($scope.profileInfo.ResidenceId) {
                residenceInfoPromise = subscriberDataManager.getResidenceInfo(subscriberId, $scope.profileInfo.ResidenceId).then(residenceInfoReceived);
                promiseLoadingSpinnerService.addLoadingPromise(residenceInfoPromise);
            }
            else {
                makeTheMapUnusable();
            }
        };

        var residenceInfoReceived = function (residenceInfo) {
            var residenceAdress = residenceInfo.StreetAddress;

            if (residenceIsValid(residenceAdress)) {
                var loadMapPromise = uiMapHelperService.initializeMap($scope.myMap, residenceAdress.LongAddress).catch(uiMapError).finally(mapIsDoneLoading);
                promiseLoadingSpinnerService.addLoadingPromise(loadMapPromise);
                destinationAddres = residenceAdress.LongAddress;
            } else {
                makeTheMapUnusable();
            }
        };

        var mapIsDoneLoading = function () {
            $scope.mapIsEnabled = true;
        }

        var uiMapError = function (error) {
            makeTheMapUnusable(error.localizedErrorMessage);
        }

        var startNavigateError = function (error) {
            console.error(error);
            makeTheMapUnusable("_Alerts_NavigateError_");
        }

        var residenceIsValid = function (residenceAddress) {

            if (typeof residenceAddress === "undefined") {
                return false;
            } else if (residenceAddress === "") {
                return false;
            } else {
                return true;
            }

        };

        var makeTheMapUnusable = function (message) {
            $scope.mapIsUnusable = true;
            $scope.pageMessage = message || "_Alerts_MapRouteNotFound_";
        }
        //#endregion
    }
);