angular.module('verklizan.umox.mobile.common').directive('diBackbutton',
    function (navigationService) {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/common/directives/buttons/backbutton.html',
            link: function (scope, elem, attrs) {
                scope.goBack = function () {
                    navigationService.goBack();

                    console.log("Back button directive triggered");
                }
            }
        };
    }
);
