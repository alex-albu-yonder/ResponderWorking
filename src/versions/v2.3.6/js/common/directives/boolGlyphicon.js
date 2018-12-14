angular.module('verklizan.umox.mobile.common').directive('boolGlyphicon',
    function () {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                isOkGlypicon: '=bool'
            },
            templateUrl: 'js/common/directives/boolGlyphicon.html',
        };

    }
);