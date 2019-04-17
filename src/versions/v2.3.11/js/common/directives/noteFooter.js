angular.module('verklizan.umox.mobile.common').directive('diNoteFooter',
    function ($routeParams, navigationService, organizationSettingsService, subscriberDataManager) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'js/common/directives/noteFooter.html',
            link: function (scope, element, attr) {

                scope.newNote = function () {
                    subscriberDataManager.newNoteCache = null;
                    var subscriberPageUrl = getNewSubscriberNoteUrl();
                    navigationService.navigate(subscriberPageUrl);
                }

                scope.allowAddNotesInResponder = function() {
                    var allowAddNotesInResponder = organizationSettingsService.getAllowAddNotesInResponder();
                    return allowAddNotesInResponder;
                }

                var getNewSubscriberNoteUrl = function () {
                    var subscriberId = $routeParams.id;

                    var newSubscriberNoteUrl = "/subscriberPage/" + subscriberId + "/newNote";

                    return newSubscriberNoteUrl;
                }
            }
        };
    }
);
