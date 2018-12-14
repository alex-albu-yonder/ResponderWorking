angular.module('verklizan.umox.mobile.common').controller('listSelectorController',
    function ($scope, $routeParams, listSelectorService, promiseLoadingSpinnerService, navigationService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var pageIncrements = 10;

        // ============================
        // Public Fields
        // ============================
        $scope.title = $routeParams.title;
        $scope.filterText = "";
        $scope.selectorOptions = listSelectorService.getControllerData();
        $scope.pageLimit = pageIncrements;

        // ============================
        // Initialization
        // ============================
        $scope.$on("$viewContentLoaded", function () {
            if (typeof $scope.selectorOptions === "undefined") {
                navigationService.goBack();
                return;
            }
            
            var dataSetPromise = $scope.selectorOptions.dataSetPromise.then(function (dataSet) {
                $scope.selectorOptions.dataSet = dataSet;
            });
            promiseLoadingSpinnerService.addLoadingPromise(dataSetPromise);
        })

        $scope.increasePageLimit = function () {
            $scope.pageLimit = $scope.pageLimit + pageIncrements;
        }

        // ============================
        // Public Methods
        // ============================
        $scope.selectItem = function (item) {
            listSelectorService.selectItem(item);
        }

    }
);
