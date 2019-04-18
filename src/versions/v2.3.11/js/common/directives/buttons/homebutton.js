angular.module('verklizan.umox.mobile.common').directive('diHomebutton',
    function (navigationService) {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/common/directives/buttons/homebutton.html',
            link: function (scope, elem, attrs) {
                scope.goHome = function () {
                    navigationService.goHome();
                    console.log("Home button directive triggered");
                };
            }
        };
    }
);
