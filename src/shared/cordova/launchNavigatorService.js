angular.module('verklizan.umox.mobile.shared.cordova').factory('launchNavigatorService',
[
    '$window', '$rootScope', '$q', 'cordovaReady',
    function($window, $rootScope, $q, cordovaReady) {
        'use strict';

        var launchNavigatorService = {};
        var navigationDeffered;
        var destination;
        var start;

        // ============================
        // Public Methods
        // ============================
        launchNavigatorService.navigate = function(_destination, _start) {
            navigationDeffered = $q.defer();
            destination = _destination;
            start = _start;

            cordovaReady.then(startNavigation).catch(navigateError);

            return navigationDeffered.promise;
        }

        // ============================
        // Private Methods
        // ============================
        var startNavigation = function() {
            $window.launchnavigator.navigate(destination, start, navigateSuccess, navigateError);
        }

        var navigateSuccess = function(result) {
            navigationDeffered.resolve(result);
        }

        var navigateError = function(error) {
            navigationDeffered.reject(error);
        }

        return launchNavigatorService;
    }
]);