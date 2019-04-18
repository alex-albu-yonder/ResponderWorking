angular.module('verklizan.umox.mobile.subscriber').directive('diSubpagetab',
    function ($location, $routeParams, navigationService, organizationSettingsService) {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/subscriber/directives/subpagetab.html',
            scope: {
                prHeaderIndex: '='
            },
            link: function (scope, elem, attrs) {
                var baseUrl = "../../shared/img/";
                scope.pages = [
                    { url: "profile", image: baseUrl + "subscriber-normal_72x72.png", active: baseUrl + "subscriber-active_72x72.png" },
                    { url: "care", image: baseUrl + "caregivers-normal_72x72.png", active: baseUrl + "caregivers-active_72x72.png" },                   
                    { url: "devices", image: baseUrl + "devices-normal_72x72.png", active: baseUrl + "devices-active_72x72.png" },
                    { url: "alarms", image: baseUrl + "incidents-normal_72x72.png", active: baseUrl + "incidents-active_72x72.png" },
                    { url: "map", image: baseUrl + "map-normal_72x72.png", active: baseUrl + "map-active_72x72.png" }
                ];

                if (organizationSettingsService.getShowMedicalTabSheetInResponder())
                {
                    scope.pages.splice(2, 0, { url: "meds", image: baseUrl + "medical-normal_72x72.png", active: baseUrl + "medical-active_72x72.png" });
                }

                scope.isPageActive = function (urlOfPage) {
                    var navigationUrl = getUrlForPage(urlOfPage);

                    return navigationService.getCurrentPage() === navigationUrl;
                }

                scope.navigate = function (urlSuffix) {
                    var navigationUrl = getUrlForPage(urlSuffix);

                    navigationService.navigateAndReplace(navigationUrl);
                }

                var getUrlForPage = function(urlOfPage) {
                    var subscriberId = $routeParams.id;

                    var navigationUrl = "/subscriberPage/" + subscriberId + "/" + urlOfPage;

                    return navigationUrl;
                }
            }

        }
    }
);
