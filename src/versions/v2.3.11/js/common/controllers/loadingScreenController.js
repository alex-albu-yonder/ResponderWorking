angular.module('verklizan.umox.mobile.common').controller('loadingScreenController',
    function ($routeParams, $scope) {
        "use strict";

        $scope.loadingMessage = $routeParams.loadingMessage;
    }
);
