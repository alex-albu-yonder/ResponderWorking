angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageProfileController',
    function ($q, $scope, $routeParams, navigationService, subscriberDataManager, recentViewsDataManager, RecentSubscriber, promiseLoadingSpinnerService) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var subscriberId = $routeParams.id;

        //#endregion

        //#region Public Fields
        // ============================
        // Public Fields
        // ============================
        $scope.profileInfo = null;
        $scope.residenceInfo = null;
        $scope.notesInfo = null;
        //#endregion

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            var profileResidencePromise = loadProfileAndResidenceInfo();
            var phoneNumberPromise = loadPhoneNumbers();
            var notesPromise = loadNotesInfo();

            //when all is loaded
            promiseLoadingSpinnerService.addLoadingPromise($q.all([profileResidencePromise, phoneNumberPromise, notesPromise]));
        });

        $scope.toNotes = function () {
            navigationService.navigate("/subscriberPage/" + $routeParams.id + "/notes");
        };
        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var loadProfileAndResidenceInfo = function () {
            return subscriberDataManager.getSubscriberInfo(subscriberId).then(function (subscriberInfo) {
                $scope.profileInfo = subscriberInfo;

                setRecentSubscriberView(subscriberInfo);

                var residenceId = subscriberInfo.ResidenceId;

                if (residenceId) {
                    return subscriberDataManager.getResidenceInfo(subscriberId, residenceId);
                }
            }).then(function (residence) {
                $scope.residenceInfo = residence;
            });
        };

        var setRecentSubscriberView = function (profileInfo) {
            var recentSubscriber = new RecentSubscriber(profileInfo.Id, profileInfo.Identity.ShortName);
            recentViewsDataManager.addRecentView(recentSubscriber);
        }

        var loadNotesInfo = function () {
            return subscriberDataManager.getNotesInfo(subscriberId).then(function (notesInfo) {
                $scope.notesInfo = notesInfo;
            });
        }

        var loadPhoneNumbers = function () {
            return subscriberDataManager.getSubscriberPhoneNumbers(subscriberId).then(function (phoneNumbers) {
                $scope.subscriberPhoneNumbers = phoneNumbers;
            });
        }

        //#endregion
    }
);
