angular.module('verklizan.umox.mobile.common').directive('diToggleSwitch',
    function ($timeout) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                toggleSwitchId: '@prToggleSwitchId',
                switchModel: '=ngModel',
                ngChange: '&',
                switchDisabled: '=ngDisabled'
            },
            templateUrl: 'js/common/directives/toggleSwitch.html',
            link: function (scope) {

                scope.modelChanged = function (switchValue) {
                    if (typeof scope.ngChange() !== "function") {
                        return;
                    }

                    // this timeout is needed to queue the ngChange.
                    // Otherwise the binded value in the controller will still be the 
                    // previous value at the time the changed function is called
                    $timeout(function () {
                        scope.ngChange()(switchValue);
                    }, 0);
                }
            }
        };

    }
);
