angular.module('verklizan.umox.mobile.careRequests').directive('careRequestListItem',
    function (navigationService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                careRequestItem: '=prCareRequestItem',
                navigationFromListItemEnabled: '=prNavigationFromListItemEnabled',
                limitReason: '=prCareRequestLimitedReason',
                showSpeechIcon: '=prShowSpeechIcon'
            },
            templateUrl: 'js/careRequests/directives/careRequestListItem.html',
            link: function (scope) {
                scope.navigateToSubscriberDetail = function () {
                    if (scope.navigationFromListItemEnabled === true) {
                        navigationService.navigate("/subscriberPage/" + scope.careRequestItem.SubscriberId + "/profile");
                    }
                }

            }
        };

    }
);