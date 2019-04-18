angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageAlarmsController',
    function ($scope, $routeParams, subscriberDataManager, EndlessScrollPagingComponent, promiseLoadingSpinnerService) {
        'use strict';

        // ============================
        // Public Fields
        // ============================
        $scope.subscriberId = $routeParams.id;
        $scope.profileInfo = null;
        $scope.alarmsViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Normal);

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            subscriberDataManager.getSubscriberInfo($routeParams.id).then(subscriberInfoReceived);

            $scope.getMoreAlarms();
        });

        // ============================
        // Public Methods
        // ============================
        $scope.getMoreAlarms = function () {
            var getAlarmPromise = subscriberDataManager.getAlarmInfo($scope.subscriberId, $scope.alarmsViewModel.nextPageNumber, $scope.alarmsViewModel.pageSize)
                .then(alarmInfoReceived);

            promiseLoadingSpinnerService.addLoadingPromise(getAlarmPromise);
        }

        // ============================
        // Private Methods
        // ============================            

        var subscriberInfoReceived = function (profileInfo) {
            $scope.profileInfo = profileInfo;
        }

        var alarmInfoReceived = function (alarmInfo) {
            $scope.alarmsViewModel.addData(alarmInfo);
        }
    }
);