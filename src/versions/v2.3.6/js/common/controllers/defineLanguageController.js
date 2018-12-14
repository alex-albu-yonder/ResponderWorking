angular.module('verklizan.umox.mobile.common').controller('defineLanguageController',
   function defineLanguageController($scope, languageSettingsService, navigationService) {
       'use strict';

       $scope.langError = false;

       $scope.next = function () {
           if (languageSettingsService.getLanguage()) {
               navigationService.navigateAndReplace("/login");
           } else {
               $scope.langError = true;
           }
       }

   }
);