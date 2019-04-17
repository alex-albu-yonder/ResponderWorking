angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageMedsController',
    function subscriberPageMedsController($scope, $routeParams, navigationService, subscriberDataManager, promiseLoadingSpinnerService) {
        'use strict';
        $scope.medicalInfo = null;
        $scope.medicationInfo = null;
        $scope.profileInfo = null;
        $scope.teleMedicine = null;

        $scope.$on('$viewContentLoaded', function () {
            loadProfileInfo();
            loadMedicalInfo();
            loadMedicationInfo();
            loadTeleMedicineInfo();
        });

        $scope.navigateToTelemedicine = function (indexOfTelemedicine) {
            navigationService.navigate("/subscriberPage/" + $routeParams.id + "/frame/" + indexOfTelemedicine);
        }

        var loadProfileInfo = function () {
            var subscriberInfoPromise = subscriberDataManager.getSubscriberInfo($routeParams.id).then(function (profileInfo) {
                $scope.profileInfo = profileInfo;
            });
            promiseLoadingSpinnerService.addLoadingPromise(subscriberInfoPromise);
        }

        var loadMedicalInfo = function () {
            var medicalInfoPromise = subscriberDataManager.getMedicalInfo($routeParams.id).then(function (medicalInfo) {
                $scope.medicalInfo = medicalInfo;
            });
            promiseLoadingSpinnerService.addLoadingPromise(medicalInfoPromise);
        }

        var loadMedicationInfo = function () {
            var medicationInfoPromise = subscriberDataManager.getMedicationInfo($routeParams.id).then(function (medicationInfo) {
                $scope.medicationInfo = medicationInfo;
            });
            promiseLoadingSpinnerService.addLoadingPromise(medicationInfoPromise);
        }

        var loadTeleMedicineInfo = function () {
            var teleMedicineInfoPromise = subscriberDataManager.getMedicalTeleMedicine($routeParams.id).then(function (teleMedicine) {
                $scope.teleMedicine = teleMedicine;
            });
        }
    }
);
