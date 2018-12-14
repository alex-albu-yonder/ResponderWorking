
///////////////////////////////////////////////////////////////
// Keyboard helper is created to solve a bug in Android that 
// when the keyboard is pulled up on focus, the input field is 
// not visible because of the keyboard. This directive is used 
// to create a space at the bottom of the page so the user can 
// scroll down to see the input field.
///////////////////////////////////////////////////////////////

// This directive is placed at the bottom of the page to create a space when the focus is on an input field
angular.module('verklizan.umox.mobile.common').directive('diKeyboardHelper',
    function () {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/common/directives/keyboardHelper/keyboardHelper.html',
            link: function (scope, element, attrs) {

            }
        };
    }
);

// Is placed on every input field that has to activate the diKeyboardHelper directive
angular.module('verklizan.umox.mobile.common').directive('diKeyboardHelperTarget',
    function () {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                //this is a android specific bug, so it needs to be only enabled on android
                if (navigator.userAgent.match(/(Android)/)) {
                    element.bind("focus", function () {
                        scope.$apply(function () {
                            console.log("focus");
                            scope.inputFocus = true;
                        });
                    });

                    element.bind("blur", function () {
                        scope.$apply(function () {
                            console.log("blur");
                            scope.inputFocus = false;
                        });
                    });
                }
            }
        };
    }
);
