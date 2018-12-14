angular.module('verklizan.umox.mobile.messages').controller('messagesController',
    function messagesController($scope, messageDataManager, navigationService, userSettingsService, EndlessScrollPagingComponent, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.messagesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Normal);
        $scope.messages = null;
        $scope.lastSeenMessage = userSettingsService.getLastSeenOrganizationNoteIndex();

        // ============================
        // Public Methods
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            $scope.loadMoreMessages();
        });

        $scope.loadMoreMessages = function () {
            var loadMessagesPromise = messageDataManager.loadMessages(false, $scope.messagesViewModel.nextPageNumber)
                .then(messagesReceived);

            promiseLoadingSpinnerService.addLoadingPromise(loadMessagesPromise);
        }

        $scope.toNewMessage = function () {
            navigationService.navigate("/newMessage");
        }

        $scope.toDetailMessage = function (index) {
            navigationService.navigate("messages/0/" + index);
        }

        var messagesReceived = function (messages) {
            $scope.messagesViewModel.addData(messages);

            userSettingsService.setLastSeenOrganizationNoteIndex($scope.messagesViewModel.data[0].SortIndex);
        };
    }
);
