angular.module('verklizan.umox.mobile.common').directive('diLoadingSpinnerFromService',
    function ($q, promiseLoadingSpinnerService) {
        'use strict';

        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="spinner" ng-show="loadingSpinnerIsShown"></div>',
            link: function (scope) {
                // ============================
                // Fields
                // ============================
                scope.loadingSpinnerIsShown = false;
                promiseLoadingSpinnerService.registerForLoadingUpdate(isStillLoadingCallback);

                // ============================
                // Private Methods
                // ============================
                function isStillLoadingCallback(isStillLoading) {
                    scope.loadingSpinnerIsShown = isStillLoading;
                }
            }
        };

    }
);