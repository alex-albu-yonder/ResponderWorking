angular.module('verklizan.umox.mobile.common').directive('diAboutbutton',
    function (navigationService) {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/common/directives/buttons/aboutbutton.html',
            link: function (scope, elem, attrs) {
                scope.goAbout = function () {
                    navigationService.navigate('/about');
                    console.log("About button directive triggered");
                }
            }
        };
    }
);