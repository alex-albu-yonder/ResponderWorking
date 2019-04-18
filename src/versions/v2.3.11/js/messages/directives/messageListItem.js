angular.module('verklizan.umox.mobile.messages').directive('diMessageListItem',
    function () {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                message: '=prMessageItem',
                prIsNew: '@'
            },
            templateUrl: 'js/messages/directives/messageListItem.html',
            link: function (scope) {
                scope.isNew = scope.prIsNew === "true";
            }
        };

    }
);