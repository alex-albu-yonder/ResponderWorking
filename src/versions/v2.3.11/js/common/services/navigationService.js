angular.module('verklizan.umox.mobile.common').service('navigationService',
    function ($rootScope, $location, $route, $window, cordovaReady) {
        'use strict';

        // ============================
        // Page
        // ============================
        function Page(originalPath, params) {
            this.path = originalPath;
            this.params = params || {};

            this.toString = function () {
                if (!this.path) {
                    return "";
                }

                var parameterValues = this.params;               

                return this.path.replace(/\/(:.+?)\//g, function (match, group) {
                    var paramKey = group.replace(':', '');

                    return typeof parameterValues[paramKey] !== 'undefined' ?
                        '/' + parameterValues[paramKey] + '/' :
                        match
                    ;
                });
            }

            this.isSamePageAs = function(otherPage) {
                var thisPageStringified = JSON.stringify(this);
                var otherPageStringified = JSON.stringify(otherPage);
                return thisPageStringified === otherPageStringified;
            }
        }

        //#region Fields
        // ============================
        // Private Fields
        // ============================
        var that = this;
        var historyBackStack = [];
        //#endregion

        //#region Initialisation
        // ============================
        // Initialisation
        // ============================
        cordovaReady.then(function () {
            registerCordovaEvents();
        });
        //#endregion

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        this.navigate = function (urlToNavigateTo, params) {
            console.log("navigate to: " + urlToNavigateTo);

            var pageToNavigateTo = new Page(urlToNavigateTo, params);
            navigateToPage(pageToNavigateTo);
        };

        this.navigateAndReplace = function (urlToNavigateTo, params) {
            console.log("navigate and replace to: " + urlToNavigateTo);

            var pageToNavigateTo = new Page(urlToNavigateTo, params);
            navigateToPage(pageToNavigateTo).replace();
        };      

        this.getCurrentPage = function () {
            return $location.path();
        };

        this.reloadCurrentPage = function () {
            $route.reload();
        }

        this.goHome = function () {
            $route.updateParams({
                state: ""
            });
            this.navigate("/home");
        };

        this.goBack = function () {
            console.log("Navigate: back");

            $window.history.back();
        };

        this.goBackMultiplePages = function (pages) {
            console.log("Navigate: back multiple pages: " + pages);

            $window.history.go(-(pages));
        };
        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var navigateToPage = function(page) {
            if (!(page instanceof Page)) {
                return;
            }

            return $location.path(page.toString());
        }

        var registerCordovaEvents = function () {
            document.addEventListener('backbutton', goBackNative, false);
        }

        var goBackNative = function (e) {
            e.preventDefault();
            that.goBack();
        }

        var userDidNotGoBack = function (current) {
            if (historyBackStack.length <= 1) {
                return true;
            }

            var previousPage = historyBackStack[historyBackStack.length - 2];

            return !previousPage.isSamePageAs(current);
        }

        var getPositionOfPageInHistory = function(newUrl) {
            for (var i = 0; i < historyBackStack.length; i++) {
                var currentPage = historyBackStack[i];

                if (currentPage.isSamePageAs(newUrl)) {
                    return i;
                }
            }

            return -1;
        }
        //#endregion
    }
);
