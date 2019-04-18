angular.module('verklizan.umox.mobile.subscriber').controller('subscriberPageFrameController',
    function subscriberPageMedsController($scope, $q, $sce, $routeParams, subscriberDataManager, promiseLoadingSpinnerService) {
        'use strict';
        
        $scope.indexOfPage = $routeParams.index;
        $scope.iframeSource = null;
        $scope.iframeLoadingDeffered = $q.defer();

        $scope.$on("$viewContentLoaded", function () {
            promiseLoadingSpinnerService.addLoadingPromise($scope.iframeLoadingDeffered.promise);
            subscriberDataManager.getMedicalTeleMedicine($routeParams.id).then(function(teleMedicine) {
                $scope.iframeSource = teleMedicine[$scope.indexOfPage];
            });
        });

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        window.frameIsLoaded = function () {
            console.log("frame is loaded");
            $scope.iframeLoadingDeffered.resolve();
        }
    }
);
