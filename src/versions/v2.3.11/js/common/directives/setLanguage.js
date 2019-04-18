angular.module('verklizan.umox.mobile.common').directive('diSetLanguage',
    function (languageSettingsService, supportingDataManager, localisationService, navigationService) {
        'use strict';

        return {
            restrict: 'A',
            templateUrl: 'js/common/directives/setLanguage.html',
            link: function (scope, element, attr) {
                scope.language = languageSettingsService.getLanguage();
                scope.languages = supportingDataManager.getLanguages();

                scope.setLanguage = function () {
                    languageSettingsService.setLanguage(scope.language);
                    localisationService.initNewLanguage();
                    navigationService.reloadCurrentPage();
                };
            }
        };
    }
);
