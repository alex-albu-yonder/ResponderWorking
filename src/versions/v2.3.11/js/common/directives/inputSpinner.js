angular.module('verklizan.umox.mobile.common').directive('diInputSpinnerFullsize',
    function ($q) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                isLoadedPromise: '=prIsLoadingPromise'
            },
            transclude: true,
            templateUrl: 'js/common/directives/inputSpinner.html',
            link: function(scope) {
                scope.isSmallSpinnerLoading = true;

                $q.when(scope.isLoadedPromise).finally(function () {
                    scope.isSmallSpinnerLoading = false;
                })
            }
        };

    }
);