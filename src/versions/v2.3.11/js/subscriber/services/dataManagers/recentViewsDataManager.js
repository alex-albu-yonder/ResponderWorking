angular.module('verklizan.umox.mobile.subscriber').service('recentViewsDataManager',
    function (userSettingsService) {
        'use strict';

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        this.addRecentView = function (recentSubscriber) {
            var recentViewList = this.getRecentViews();

            //removes the duplicate
            var indexOfDuplicate = checkArrayForDuplicateOf(recentSubscriber.id, recentViewList);

            if (indexOfDuplicate !== -1) {
                recentViewList.splice(indexOfDuplicate, 1);
            }

            //inserts the new item at the beginning of the list
            recentViewList.unshift(recentSubscriber);
            if (recentViewList.length > 5) {
                recentViewList.pop();
            }

            //sets the new list in the local storage
            userSettingsService.setRecentSubscriberViews(recentViewList);
        };

        this.getRecentViews = function () {
            var recentViewsFromStorage = userSettingsService.getRecentSubscriberViews();

            return recentViewsFromStorage || [];
        };

        this.clearRecentViews = function () {
            userSettingsService.clearRecentSubscriberViews();
        };

        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var checkArrayForDuplicateOf = function (subscriberId, list) {
            for (var i = 0; i < list.length; i++) {
                var tempSubscriber = list[i];
                if (tempSubscriber.id === subscriberId) {
                    return i;
                }
            }
            return -1;
        };
        //#endregion
    }
);
