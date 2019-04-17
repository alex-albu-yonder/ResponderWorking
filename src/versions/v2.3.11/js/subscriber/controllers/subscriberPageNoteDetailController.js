angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageNoteDetailController',
    function ($scope, $routeParams, $sce, subscriberDataManager, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var subscriberId = $routeParams.id;
        var noteId = $routeParams.noteId;

        // ============================
        // Public Fields
        // ============================
        $scope.profileInfo = null;
        $scope.noteDetailInfo = null;
        $scope.noteDetailFormattedContent = null;
        $scope.imageUrl = null;
        $scope.isLoading = promiseLoadingSpinnerService.getIsLoading;

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function (event) {
            loadProfileInfo(subscriberId);

            loadNoteInfo(noteId);
        });

        // ============================
        // Public methods
        // ============================
        // This method ensures that the html which is provided can be trusted. This makes sure that the styling gets applied.
        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
        }

        // ============================
        // Private methods
        // ============================
        var loadProfileInfo = function (subscriberIdParam) {
            var subscriberInfoPromise = subscriberDataManager.getSubscriberInfo(subscriberIdParam).then(function (profileInfo) {
                $scope.profileInfo = profileInfo;
            });

            promiseLoadingSpinnerService.addLoadingPromise(subscriberInfoPromise);
        }

        var loadNoteInfo = function (noteIdParam) {
            var noteDetailPromise = subscriberDataManager.getNoteDetailInfo(noteIdParam).then(function (noteInfo) {
                $scope.noteDetailInfo = noteInfo;

                $scope.noteDetailFormattedContent = $scope.trustAsHtml(noteInfo.Content);

                setImageUrl(noteInfo.DefaultAttachment);
            });

            promiseLoadingSpinnerService.addLoadingPromise(noteDetailPromise);
        }

        var setImageUrl = function (imageData) {
            if (imageData) {
                $scope.imageUrl = "data:image/jpeg;base64," + imageData;
            }
        }
    }
);