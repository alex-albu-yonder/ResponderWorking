angular.module('verklizan.umox.mobile.subscriber').service('AutoCompleteDataManager',
    function () {
        'use strict';

        return function (readFunction, addFunction) {
            this.searchPage = readFunction;
            this.add = addFunction;
        }
    }
);