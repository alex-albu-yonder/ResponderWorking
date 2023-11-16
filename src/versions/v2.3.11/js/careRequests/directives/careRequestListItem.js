angular.module('verklizan.umox.mobile.careRequests').directive('careRequestListItem',
    function ($http, $window, navigationService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                careRequestItem: '=prCareRequestItem',
                navigationFromListItemEnabled: '=prNavigationFromListItemEnabled',
                limitReason: '=prCareRequestLimitedReason',
                showSpeechIcon: '=prShowSpeechIcon'
            },
            templateUrl: 'js/careRequests/directives/careRequestListItem.html',
            link: function (scope) {
                scope.navigateToSubscriberDetail = function () {
                    if (scope.navigationFromListItemEnabled === true) {
                        navigationService.navigate("/subscriberPage/" + scope.careRequestItem.SubscriberId + "/profile");
                    }
                }

                scope.openAlarmDeviceWebsite = function () {
                    var websiteRequest = scope.careRequestItem.AlarmDeviceWebsiteRequest;
                    if (websiteRequest) {
                        if (websiteRequest.WebMethod === "get") {
                            cordova.InAppBrowser.open(websiteRequest.Url, "_system");
                        }
                        else if (websiteRequest.WebMethod === "post") {
                            postPageRequest(websiteRequest.Url, JSON.parse(websiteRequest.Data));
                        }
                    }
                }

                // this hurts my soul
                var postPageRequest = function (url, data) {
                    var pageContent = '<!DOCTYPE html><html><head></head><body><form id="postRequestForm" action="' + url + '" method="post">';
                    for (var property in data) {
                        pageContent += '<input type="hidden" name="' + property + '" value="' + data[property] + '">'
                    }
                    pageContent += '</form><script type="text/javascript">document.getElementById("postRequestForm").submit();</script></body></html>';
                    var pageContentUrl = "data:text/html;base64," + btoa(pageContent);

                    cordova.InAppBrowser.open(pageContentUrl, "_blank");
                }
            }
        };

    }
);