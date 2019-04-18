angular.module('verklizan.umox.mobile.subscriber').controller('searchSubscriberResultsController',
        function ($scope, $routeParams, searchSubscriberDataManager, navigationService, recentViewsDataManager,
            EndlessScrollPagingComponent, promiseLoadingSpinnerService, subscriberDataManager, organizationSettingsService) {
            'use strict';

            //#region Constants
            // ============================
            // Constants
            // ============================
            var searchSubscribersViewModel = new EndlessScrollPagingComponent(EndlessScrollPagingComponent.pageSizes.Normal);
            //#endregion

            //#region Public Fields
            // ============================
            // Public Fields
            // ============================        
            $scope.allowSearchSubscriberInResponder = organizationSettingsService.getAllowSearchSubscriberInResponder();
            $scope.searchSubscribersViewModel = searchSubscribersViewModel;
            $scope.searchText = $routeParams.searchText;
            $scope.submitted = false;
            $scope.recentViews = recentViewsDataManager.getRecentViews();
            $scope.userHasPushedSearchButton = false;
            //#endregion

            //#region Events
            // ============================
            // Events
            // ============================
            $scope.$on('$viewContentLoaded', function () {
                if ($scope.searchText) {
                    $scope.getSearchSubscriberData();
                }
            });
            //#endregion

            //#region Public Methods
            // ============================
            // Public Methods
            // ============================
            $scope.selectSubscriber = function (subscriber) {
                navigateToSubscriberProfile(subscriber.Id);
            };

            $scope.navigateToRecentView = function (subscriber) {
                navigateToSubscriberProfile(subscriber.id);
            };

            $scope.getMore = function () {
                $scope.getSearchSubscriberData();
            };

            $scope.getSearchSubscriberData = function () {
                if (promiseLoadingSpinnerService.getIsLoading()) {
                    return;
                }

                $scope.userHasPushedSearchButton = true;

                var searchPromise = searchSubscriberDataManager
                    .searchSubscribers($scope.searchText, searchSubscribersViewModel.nextPageNumber, searchSubscribersViewModel.pageSize)
                        .then(searchSubscribersLoaded)

                promiseLoadingSpinnerService.addLoadingPromise(searchPromise);
            }

            $scope.searchSubscribers = function () {
                $scope.submitted = true;

                if ($scope.searchSubscriberForm.$valid && $scope.searchText !== $routeParams.searchText) {
                    var linkToNavigate = "/searchSubscriberResults/" + sanitizeSearchText($scope.searchText);
                    if ($routeParams.searchText) {
                        navigationService.navigateAndReplace(linkToNavigate);
                    }
                    else {
                        navigationService.navigate(linkToNavigate);
                    }
                }
            };
            //#endregion

            // ============================
            // Private Methods
            // ============================
            function navigateToSubscriberProfile(subscriberId) {
                subscriberDataManager.clearCachedData();
                navigationService.navigate("/subscriberPage/" + subscriberId + "/profile");
            }

            function searchSubscribersLoaded(data) {
                searchSubscribersViewModel.addData(data);
            }

            function sanitizeSearchText(searchText) {
                var sanitizedSearchText = searchText.replace(/\//g, "-");
                return sanitizedSearchText;
            }
        }
);
