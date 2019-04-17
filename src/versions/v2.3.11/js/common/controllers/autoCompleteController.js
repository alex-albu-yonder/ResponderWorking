angular.module('verklizan.umox.mobile.common').controller('autoCompleteController',
    function ($scope, $routeParams, promiseLoadingSpinnerService, navigationService, autoCompleteService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var pageIncrements = 10;
        var bounceTimeMS = 500; //typing on mobile is hard, lets wait half a second to still keep it kinda snappy
        var bounceIndex;
        var searchRequiredAmountCharacters = 3;
        var lastCallIndex = null;

        // ============================
        // Public Fields
        // ============================
        if (!$routeParams.index || $routeParams.index < 0) { navigationService.goBack(); }
        $scope.autoCompleterObject = autoCompleteService.getAutoCompleter($routeParams.index);
        $scope.title = $scope.autoCompleterObject.title;
        $scope.filterText = "";
        $scope.pageLimit = pageIncrements;
        $scope.searchCharactersRequired = searchRequiredAmountCharacters;

        // ============================
        // Initialization
        // ============================
        $scope.$on("$viewContentLoaded", function () {
            if (window.isNullOrUndefined($scope.autoCompleterObject)) {
                navigationService.goBack();
                return;
            }

            getItems("");
        });

        // ============================
        // Public Methods
        // ============================
        $scope.$watch('filterText', function () {
            $scope.search();
        });

        $scope.selectItem = function (item) {
            $scope.autoCompleterObject.selectItem(item);
        }

        $scope.search = function () {
            $scope.show3CharactersRequired = false;
            if (!$scope.filterText) { $scope.filterText = ""; }

            var filterTextLowerCase = angular.lowercase($scope.filterText).trim();

            if ($scope.searchValue === filterTextLowerCase) {
                return;
            }
            $scope.searchValue = filterTextLowerCase;

            if ($scope.searchValue.length !== 0 && $scope.searchValue.length < 3) {
                $scope.show3CharactersRequired = true;
                $scope.loading = false;
                lastCallIndex = null;
                $scope.items = [];
                $scope.totalCount = 0;
                return;
            }

            getItems();
        }

        $scope.showMore = function () {
            var _internalSearchValue = $scope.searchValue;
            if (($scope.pageIndex * pageIncrements) < $scope.totalCount) {
                if (lastCallIndex === $scope.pageIndex) { return; }
                $scope.loading = true;
                var showMorePromise = $scope.autoCompleterObject.dataManager.searchPage($scope.searchValue, $scope.autoCompleterObject.params, ($scope.pageIndex+1)).then(function (result) {
                    //We will have to manually check if searchValue is still what we expect to add our list to...
                    if (_internalSearchValue !== $scope.searchValue) { return; }
                    //For performance its better to add one by one instead of making a copy with a concat with larger arrays.
                    for (var item in result.Rows) {
                        $scope.items.push(result.Rows[item]);
                    }
                    $scope.loading = false;
                    lastCallIndex = $scope.pageIndex;
                    $scope.pageIndex++;
                });
                promiseLoadingSpinnerService.addLoadingPromise(showMorePromise);
            }
        }

        var bounceWrapper = function (_function, _timedFunction) {

            if (window.isNullOrUndefined(_timedFunction) === false) {
                clearTimeout(_timedFunction);
            }

            return setTimeout(_function, bounceTimeMS);
        }

        var getItems = function () {
            $scope.loading = true;
            var paramWrapper = function (_searchValue) {
                return function () {
                    $scope.pageIndex = 0;
                    var getItemsPromise = $scope.autoCompleterObject.dataManager.searchPage(_searchValue, $scope.autoCompleterObject.params, $scope.pageIndex).then(function (result) {

                        if (_searchValue === $scope.searchValue) {
                            $scope.items = result.Rows;
                            $scope.totalCount = result.TotalCount;
                            lastCallIndex = null;
                        }

                        $scope.loading = false;

                    }).catch(function (reason) {

                        $scope.loading = false;
                        lastCallIndex = null;
                        $scope.items = [];

                    });
                    promiseLoadingSpinnerService.addLoadingPromise(getItemsPromise);
                }

            }

            bounceIndex = bounceWrapper(paramWrapper($scope.searchValue), bounceIndex);
        }

    }
);
