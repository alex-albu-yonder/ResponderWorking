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
        var originMarker;
        var destinationMarker;

        var mapIsGeneratedDeffered;
        var map;

        var uiMapHelperService = {};

        // ============================
        // Public Methods
        // ============================
        uiMapHelperService.getCoordinatesOfAddress = function (address) {
            var deferred = $q.defer();
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ "address": address }, function (results, status) {
                if (status === "OK") { 
                    deferred.resolve(results[0].geometry.location);
                }
                else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        uiMapHelperService.initializeMap = function (uiMap, destinationCoordinates, originMarkerArg, destinationMarkerArg) {
            directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            directionsService = new google.maps.DirectionsService();
            
            directionEnd = destinationCoordinates;
            originMarker = originMarkerArg;
            destinationMarker = destinationMarkerArg;
            
            mapIsGeneratedDeffered = $q.defer();
            map = uiMap;
            
            directionsDisplay.setMap(map);

            geolocationService.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 })
                .then(function (position) {
                    resetLocationUnavailableMessageIsShown();
                    directionStart = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    calculateRoute();
                }).catch(geolocationErrorCallback);

            return mapIsGeneratedDeffered.promise;
        }

        // ============================
        // Private Methods
        // ============================

        var calculateRoute = function () {
            if (!directionStart || !directionEnd) {
                rejectMapGeneration("_Alerts_MapRouteNotFound_");
                return;
            }

            renderCustomMarker(directionStart, "../../" + originMarker.imageFile);
            renderCustomMarker(directionEnd, "../../" + destinationMarker.imageFile);

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
                        alert("from " + directionStart + " to " + directionEnd);
                        rejectMapGeneration("_Alerts_MapRouteError_");
                        break;
                }

                resizeMap();
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
        };

        var rejectMapGeneration = function (localizedErrorMessage) {
            var error = {
                localizedErrorMessage: localizedErrorMessage
            };
            mapIsGeneratedDeffered.reject(error);
        };

        var renderCustomMarker = function (position, imagePath) {
            return new google.maps.Marker({
                position: position,
                map: map,
                icon: {
                    url: imagePath,
                    size: new google.maps.Size(50, 50),
                    scaledSize: new google.maps.Size(25, 25),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(12, 12)
                } 
            });
        };

        // this render is needed to resolve a bug that on the second time the map is shown,
        // the map is not centered correctly and has gray areas.
        var resizeMap = function () {
            google.maps.event.trigger(map, 'resize');
        };

        var resetService = function () {
            directionsDisplay = null;
            directionsService = null;
            directionStart = null;
            directionEnd = null;
            originMarker = null;
            destinationMarker = null;

            map = null;
        };

        var resetLocationUnavailableMessageIsShown = function () {
            userSettingsService.clearLocationUnavailableMessageIsShown();
        };

        return uiMapHelperService;

    }
);
