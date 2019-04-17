angular.module('verklizan.umox.mobile.common').directive('diTodaysMessages',
    function ($timeout, navigationService, messageDataManager, EndlessScrollPagingComponent, promiseLoadingSpinnerService) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'js/common/directives/homePage/todaysMessages.html',
            scope: {},
            link: function (scope) {
                console.log("messages today directive loaded");
                // ============================
                // Fields
                // ============================
                scope.messagesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Normal);

                // ============================
                // Initialisation
                // ============================
                $timeout(function () {
                    scope.loadMoreMessages();
                }, 0);

                // ============================
                // Public Methods
                // ============================
                scope.loadMoreMessages = function () {
                    var messagesLoadedPromise = messageDataManager.loadMessages(true, scope.messagesViewModel.nextPageNumber)
                        .then(function (messages) {
                            scope.messagesViewModel.addData(messages);
                        }).catch(function (error) {
                            console.error(error);
                        });

                    promiseLoadingSpinnerService.addLoadingPromise(messagesLoadedPromise);
                }

                scope.toDetailMessage = function (index) {
                    navigationService.navigate("messages/1/" + index);
                };
            }
        };
    }
);
