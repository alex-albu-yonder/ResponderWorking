angular.module('verklizan.umox.mobile.common').directive('diHeaderBanner',
    function () {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                prHeaderFirstLine: "=",
                prHeaderFirstLineLocalized: "@",
                prHeaderSecondLine: "=",
                prHeaderSecondLineLocalized: "@",
                prBack: "=",
                prHome: "=",
                prAbout: "="
            },
            templateUrl: 'js/common/directives/headerBanner.html',
            link: function (scope) {

            }
        };
    }
);
