angular.module('verklizan.umox.mobile.subscriber').controller('newSubscriberProfileController',
    function newSubscriberProfileController($scope, navigationService, localisationService, newSubscriberDataManager,
        supportingDataManager, organizationTreeBuilderService, genderValues) {
        'use strict';

        // ============================
        // Public fields
        // ============================
        $scope.bsnPattern = /^\d{9}$/;
        $scope.organizations = organizationTreeBuilderService.getOrganizationTreeView();
        $scope.genderValues = [
            { id: genderValues.Unknown, localisationString: "_Unknown_" },
            { id: genderValues.Male, localisationString: "_Male_" },
            { id: genderValues.Female, localisationString: "_Female_" }
        ];

        $scope.newSubscriber = newSubscriberDataManager.getNewSubscriberProfileInfo() || {
            surname: "",
            insertion: "",
            firstName: "",
            gender: 0,
            organizationId: "",
            serviceNr: "",
            remark: "",
            birthDate: ""
        };

        // ============================
        // Initialisation
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            for (var genderIndex = 0; genderIndex < $scope.genderValues.length; genderIndex++) {
                translateGender(genderIndex);
            }
        });

        // ============================
        // Public methods
        // ============================
        $scope.submitFirstPage = function () {
            $scope.newSubscriberForm.$setSubmitted();

            //compare the dates, date is invalid if its the same date as today
            //also the date doesnt have to be set, but the surname does
            if ($scope.newSubscriber.surname && $scope.newSubscriber.organizationId) {
                newSubscriberDataManager.setNewSubscriberProfileInfo($scope.newSubscriber);
                navigationService.navigate("/newSubscriber/residence");
            } else {
                console.log("data is not valid or incomplete");
            }

        };

        // ============================
        // Events
        // ============================
        $scope.$on('supportingDataManager::organizationsUpdated', function () {
            $scope.organizations = organizationTreeBuilderService.getOrganizationTreeView();
        });

        $scope.$on('$routeChangeStart', function (current, next) {
            if (next.$$route.templateUrl === "partials/homePage.html") {
                newSubscriberDataManager.setNewSubscriberProfileInfo(null);
                newSubscriberDataManager.setNewSubscriberResidenceInfo(null);
            }
        });

        function translateGender(genderIndex) { 
            var genderToTranslate = $scope.genderValues[genderIndex];

            localisationService.getLocalizedStringAsync(genderToTranslate.localisationString)
                .then(function (translation) {
                    genderToTranslate.value = translation;
                })
        }
    }
);