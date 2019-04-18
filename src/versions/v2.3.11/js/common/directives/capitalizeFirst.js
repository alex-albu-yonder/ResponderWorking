angular.module('verklizan.umox.mobile.common').directive('diCapitalizeFirst',
    function () {
        'use strict';

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                // Auto capitalize the first letter of an input field on Android only.
                if (navigator.userAgent.match(/(Android)/)) {
                    var capitalize = function (inputValue) {
                        if (inputValue) {
                            var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                            if (capitalized !== inputValue) {
                                modelCtrl.$setViewValue(capitalized);
                                modelCtrl.$render();
                            }

                            return capitalized;
                        }
                    }

                    modelCtrl.$parsers.push(capitalize);
                    capitalize(scope[attrs.ngModel]); // capitalize initial value
                }
            }
        };
    }
);