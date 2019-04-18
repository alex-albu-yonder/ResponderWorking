angular.module('verklizan.umox.mobile.common').factory('uiMapHelperService',
    function ($rootScope, $q, localizedNotificationService, geolocationService, userSettingsService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var directionsDisplay;
        var directionsService;
        var directionStart;
        var directionEnd;

        var mapIsGeneratedDeffered;
        var map;

        var uiMapHelperService = {};

        // ============================
        // Public Methods
        // ============================
        uiMapHelperService.initializeMap = function (uiMap, destination) {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService = new google.maps.DirectionsService();
            directionEnd = destination;

            mapIsGeneratedDeffered = $q.defer();
            map = uiMap;

            calculateCurrentPosition();

            return mapIsGeneratedDeffered.promise;
        }

        // ============================
        // Private Methods
        // ============================
        var calculateCurrentPosition = function () {
            console.log("initializes the map");
            directionsDisplay.setMap(map);

            var options = {
                enableHighAccuracy: true,
                timeout: 10000
            };

            geolocationService.getCurrentPosition(options)
                .then(function (position) {
                    resetLocationUnavailableMessageIsShown();

                    directionStart = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    calculateRoute();
                }).catch(geolocationErrorCallback);
        };

        var calculateRoute = function () {
            if (!directionStart || !directionEnd) {
                rejectMapGeneration("_Alerts_MapRouteNotFound_");
                return;
            }

            var request = {
                origin: directionStart,
                destination: directionEnd,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (result, status) {

                switch (status) {
                    case google.maps.DirectionsStatus.OK:
                        map.setCenter(directionStart);
                        map.setZoom(17);
                        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        map.setOptions({ disableDefaultUI: true });

                        directionsDisplay.setDirections(result);
                        break;
                    case google.maps.DirectionsStatus.NOT_FOUND:
                        rejectMapGeneration("_Alerts_MapRouteNotFound_");
                        break;
                    case google.maps.DirectionsStatus.ZERO_RESULTS:
                        rejectMapGeneration("_Alerts_MapRouteNoResult_");
                        break;
                    default:
                        rejectMapGeneration("_Alerts_MapRouteError_");
                        break;
                }

                renderMap();
                resetService();
                resolveMapGeneration();
            });
        };

        var geolocationErrorCallback = function (error) {
            switch (error.code) {
                case error.POSITION_UNAVAILABLE:
                case error.TIMEOUT:
                case error.PERMISSION_DENIED:
                    rejectMapGeneration("_Alerts_MapPositionUnavailable_");
                    break;
                default:
                    rejectMapGeneration("_Alerts_MapLocationError_");
                    break;
            }
        };

        var resolveMapGeneration = function () {
            mapIsGeneratedDeffered.resolve();
        }

        var rejectMapGeneration = function (localizedErrorMessage) {
            var error = {
                localizedErrorMessage: localizedErrorMessage
            };
            mapIsGeneratedDeffered.reject(error);
        }

        // this render is needed to resolve a bug that on the second time the map is shown,
        // the map is not centered correctly and has gray areas.
        var renderMap = function () {
            google.maps.event.trigger(map, 'resize');
        }

        var resetService = function () {
            directionsDisplay = null;
            directionsService = null;
            directionStart = null;
            directionEnd = null;

            map = null;
        }

        var resetLocationUnavailableMessageIsShown = function () {
            userSettingsService.clearLocationUnavailableMessageIsShown();
        }

        return uiMapHelperService;

    }
);
