angular.module('verklizan.umox.mobile.common').directive('diCareRequests',
    function ($location, navigationService, careRequestDataManager, promiseLoadingSpinnerService,
        organizationSettingsService, userSettingsService, careRequestAutoResponseService) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'js/common/directives/homePage/careRequests.html',
            scope: {},
            link: function (scope, element, attr) {
                // ============================
                // Fields
                // ============================
                scope.currentCareRequests = null;
                scope.previousCareRequests = null;
                scope.state = $location.search();
                scope.showOnlyToday = $location.search().state !== "careHistory";
                scope.careRequestHistoryLengthDaysInResponder = organizationSettingsService.getCareRequestHistoryLengthDaysInResponder();

                // ============================
                // Public Methods
                // ============================
                (function() {
                    if (scope.showOnlyToday) {
                        getCareRequestsToday();
                    } else {
                        getPreviousCareRequests();
                    }
                })();

                scope.showTodaysCareRequests = function () {
                    $location.search("state", null);
                }

                scope.showPreviousCareRequests = function () {
                    $location.search("state", "careHistory");
                }

                scope.toCareRequestDetail = function (careRequestId) {
                    navigationService.navigate("careRequest/" + careRequestId);
                };

                // ============================
                // Private Methods
                // ============================
                function getCareRequestsToday() {
                    var getTodayPromise = careRequestDataManager.getCareRequestsOfToday().then(function (careRequests) {
                        scope.currentCareRequests = careRequests;

                        if (shouldSendCareRequest(careRequests)) {
                            console.log("Automatic response is enabled and will be handled")
                            careRequestAutoResponseService.handleAutomaticResponse(careRequests).then(getCareRequestsToday);
                        }
                    });

                    promiseLoadingSpinnerService.addLoadingPromise(getTodayPromise);
                }

                function shouldSendCareRequest(careRequests) {
                    var careRequestsAvailable = careRequests.length > 0;

                    var automaticCareRequestsEnabled = userSettingsService.getAutoCareRequestEnabled() && userSettingsService.getIsInDebugMode();

                    return careRequestsAvailable && automaticCareRequestsEnabled;
                }

                function getPreviousCareRequests() {                   
                    var getHistoryPromise = careRequestDataManager.getPreviousCareRequests().then(function (careRequests) {
                        scope.previousCareRequests = careRequests;
                    });

                    promiseLoadingSpinnerService.addLoadingPromise(getHistoryPromise);
                }
            }
        };
    }
);
