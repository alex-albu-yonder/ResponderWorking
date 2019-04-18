angular.module('verklizan.umox.mobile.messages').controller('messagesDetailController',
    function messagesDetailController($scope, $routeParams, messageDataManager, navigationService, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.message = null;

        // ============================
        // Public Methods
        // ============================
        $scope.toNewMessage = function () {
            navigationService.navigate("/newMessage");
        }

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            getMessages();
        });

        // ============================
        // Private Methods
        // ============================
        function getMessages() {
            var isToday = getBoolFromInt($routeParams.isToday);
            var loadMessagePromise = messageDataManager.loadMessage(isToday, parseInt($routeParams.index))
                .then(messagesReceived);
            promiseLoadingSpinnerService.addLoadingPromise(loadMessagePromise);
        }

        function messagesReceived(message) {
            $scope.message = message;
        }

        function getBoolFromInt(stringIntBool) {
            return stringIntBool === "1";
        }
    }
);