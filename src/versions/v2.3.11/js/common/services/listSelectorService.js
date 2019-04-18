angular.module('verklizan.umox.mobile.common').service('listSelectorService',
    function ($q, navigationService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var selectorOptions;
        var selectorFinishedCallback;

        // ============================
        // Public Methods
        // ============================
        this.callSelector = function (title, dataSet, callback, filters) {
            selectorOptions = {
                dataSetPromise: $q.when(dataSet),
                filters: filters | {}
            };
            selectorFinishedCallback = callback;

            navigationService.navigate("/listSelector/" + title);
        };

        this.getControllerData = function () {
            return selectorOptions;
        };

        this.selectItem = function (selectedItem) {
            navigationService.goBack();

            selectorFinishedCallback(selectedItem);

            clearSelectorData();
        }

        // ============================
        // Private Methods
        // ============================
        var clearSelectorData = function () {
            selectorOptions = null;
            selectorFinishedCallback = null;
        }
    }
);
