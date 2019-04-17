angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageCareController',
    function subscriberPageCareController($q, $scope, $routeParams, subscriberDataManager, EndlessScrollPagingComponent, 
        promiseLoadingSpinnerService) {
        'use strict';

        $scope.caregiversViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Large);
        $scope.profileInfo = null;

        $scope.$on('$viewContentLoaded', function () {
            var getSubscriberInfoPromise = subscriberDataManager.getSubscriberInfo($routeParams.id).then(function (profileInfo) {
                $scope.profileInfo = profileInfo;
            });

            promiseLoadingSpinnerService.addLoadingPromise(getSubscriberInfoPromise);

            $scope.loadMoreCaregivers();
        });

        $scope.loadMoreCaregivers = function () {
            var listOfPromises = [];

            var caregiverPromise = subscriberDataManager
                .getCaregiversInfo($routeParams.id, $scope.caregiversViewModel.nextPageNumber, $scope.caregiversViewModel.pageSize)
                .then(function (caregivers) {
                    $scope.caregiversViewModel.addData(caregivers);

                    for (var i = 0; i < caregivers.TotalCount; i++) {
                        listOfPromises.push(getCaregiverPhoneNumbers(caregivers.Rows[i]));
                    }

                    promiseLoadingSpinnerService.addLoadingPromise(listOfPromises);
                });

            promiseLoadingSpinnerService.addLoadingPromise(caregiverPromise);
        }

        var getCaregiverPhoneNumbers = function (caregiver) {
            var caregiverPhoneNumberPromise = subscriberDataManager.getCaregiverPhoneNumbers(caregiver.Id);
            caregiverPhoneNumberPromise.then(function (phoneNumbers) {
                caregiver._phoneNumbers = phoneNumbers;
            })

            return caregiverPhoneNumberPromise;
        }
    }
);