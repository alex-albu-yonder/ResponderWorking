angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageNotesController',
    function subscriberPageNotesController($scope, $routeParams, $sce, navigationService, subscriberDataManager, EndlessScrollPagingComponent, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var subscriberId = $routeParams.id;

        // ============================
        // Public Fields
        // ============================
        $scope.profileInfo = null;
        $scope.notesViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Normal);

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            loadProfileInfo();

            $scope.loadMoreNotes();
        });

        // ============================
        // Public methods
        // ============================
        $scope.loadMoreNotes = function () {
            var notesInfoPromise = subscriberDataManager.getNotesInfo(subscriberId, $scope.notesViewModel.nextPageNumber, $scope.notesViewModel.pageSize)
                .then(function (notesInfo) {
                    $scope.notesViewModel.addData(notesInfo);
                });

            promiseLoadingSpinnerService.addLoadingPromise(notesInfoPromise);
        }

        // This method ensures that the html which is provided can be trusted. This makes sure that the styling gets applied.
        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
        }

        $scope.navigateToNoteDetail = function (noteId) {
            var url = "/subscriberPage/" + subscriberId + "/notes/" + noteId;

            navigationService.navigate(url);
        }

        // ============================
        // Private methods
        // ============================
        var loadProfileInfo = function () {
            var profileInfoPromise = subscriberDataManager.getSubscriberInfo(subscriberId).then(function (profileInfo) {
                $scope.profileInfo = profileInfo;
            });

            promiseLoadingSpinnerService.addLoadingPromise(profileInfoPromise);
        }
    }
);
