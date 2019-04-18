//Services that supports the autoCompleteService. Refactored code from the previous ListSelectorService.
//The reason to use a slightly different approach an not setting the options and callbacks in this service is so that when
//multiple autocompletes on a single page with a different design (maybe future) can also use this service without having to refactoring this again.

angular.module('verklizan.umox.mobile.common').service('autoCompleteService',
    function (navigationService, $q) {
        'use strict';


        var selectorOptions;
        var selectorFinishedCallback;

        //#region private fields
        var autoCompletes = [];

        //#endregion

        //#region Public methos

        //Title, autoComleterType, dataManager are all required.
        //Callback can be used to get the selected item and actually do something with it.
        //Autoclear is usefull for autoCompleters that are to be removed from the autoCompleter list. Dont understand? Autoclear is true for you..
        //extraParamsObject enables you to set extra parameters to the selected object before creating a new item.
        //onSelectParamsObject enables you to set extra parameters on the selected object before having it returned.
        //saveNotAllowed enables you to disable the saving capabilities in the autoCompleter.
        //DebounceValue sets the wait time before a call will complete. Default is 500.
        //showSearchButton enables you to show the search button. Default is false.
        //Deferred can be used to get the selected item back as a resolved promise.

        this.createAutoComplete = function (title, dataManager, callback, params) {
            if (typeof title === 'undefined' ||
                typeof dataManager === 'undefined' ||
                typeof callback === 'undefined') {
                throw 'Incorrectly implemented autoCompleter';
            }

            var autoCompleteObject = {
                //Required
                title: title,
                dataManager: dataManager,
                callback: callback,

                //Optional
                params: params,

                //Functions
                selectItem: function (selectedItem) {
                    navigationService.goBack();
                    this.callback(selectedItem);
                    _clear(this);
                },
                start: function () {
                    navigationService.navigate("/autoComplete/" + this.index);
                },
                cancel: function () {
                    navigationService.goBack();
                    _clear(this);
                }
            }

            autoCompleteObject.index = autoCompletes.push(autoCompleteObject);
            return autoCompleteObject;
        }

        this.getAutoCompleter = function (index) {
            if (index < 0 || index > autoCompletes.length) { return null; }
            return autoCompletes[index - 1];
        };

        this.updateAutoCompleter = function (autoCompleter) {
            if (autoCompleter.index < 0 || autoCompleter.index > autoCompletes.length) { return false; }
            autoCompletes[autoCompleter.index - 1] = autoCompleter;
            return true;
        }

        //#endregion

        //#region private functions
        var _clear = function (autoCompleteObj) {
            var index = autoCompletes.indexOf(autoCompleteObj);
            if (index < 0) { throw "object not found"; }
            return autoCompletes.splice(index, 1);
        }
        //#endregion
    }
);
