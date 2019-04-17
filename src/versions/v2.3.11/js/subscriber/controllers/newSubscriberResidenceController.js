angular.module('verklizan.umox.mobile.subscriber').controller('newSubscriberResidenceController',
    function newSubscriberResidenceController($scope, navigationService, newSubscriberDataManager, promiseLoadingSpinnerService) {
        'use strict';

        //#region Public Fields
        // ============================
        // Public Fields
        // ============================
        $scope.invalidCity = false;
        $scope.invalidRegion = false;
        $scope.groupedCities = [];
        $scope.newResidence = newSubscriberDataManager.getNewSubscriberResidenceInfo() || {
            street: "",
            houseNr: null,
            postcode: "",
            city: "",
            region: "",
            phone: null,
        };
        //#endregion Fields

        // ============================
        // Public Methods
        // ============================
        $scope.selectCity = function () {
            newSubscriberDataManager.setNewSubscriberResidenceInfo($scope.newResidence);

            newSubscriberDataManager.selectCity();
        }

        $scope.selectRegion = function () {
            newSubscriberDataManager.setNewSubscriberResidenceInfo($scope.newResidence);

            newSubscriberDataManager.selectRegion();
        }

        $scope.addNewSubscriber = function () {
            $scope.newSubscriberForm.$setSubmitted();

            //resets the invalid bools for when the form is submitted multiple times
            $scope.invalidCity = false;
            $scope.invalidRegion = false;

            if ($scope.newResidence.street && $scope.newResidence.city && $scope.newResidence.phone) {
                var newSubscriberPromise = newSubscriberDataManager.setResidenceInfoAndCreateNewSubscriber($scope.newResidence)
                    .then(createNewSubscriberSuccess);

                promiseLoadingSpinnerService.addLoadingPromise(newSubscriberPromise);
            }
        };

        // ============================
        // Public Methods
        // ============================
        var createNewSubscriberSuccess = function (subscriberId) {
            navigationService.navigateAndReplace("/subscriberPage/" + subscriberId + "/profile");
        }
    }
);