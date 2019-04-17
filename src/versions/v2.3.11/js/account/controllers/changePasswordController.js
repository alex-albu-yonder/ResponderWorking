angular.module('verklizan.umox.mobile.account').controller('changePasswordController',
    function ($scope, $routeParams, userDataManager, navigationService, promiseLoadingSpinnerService) {
        "use strict";

        // ============================
        // Public Fields
        // ============================
        $scope.isSubmitted = false;
        $scope.usernameRetrieved = false;
        $scope.formData = {
            username : "",
            oldPassword: "",
            newPassword: ""
        }

        // ============================
        // Events
        // ============================
        $scope.$on("$viewContentLoaded", function () {
            var username = userDataManager.getUserName();

            if (typeof username !== "undefined") {
                $scope.usernameRetrieved = true;
                $scope.formData.username = username;
            }
        });

        // ============================
        // Public Methods
        // ============================
        $scope.changePassword = function () {
            if ($scope.changePasswordForm.$invalid) {
                $scope.isSubmitted = true;
                return;
            }

            var changePasswordPromise = userDataManager.changePassword($scope.formData.username, $scope.formData.oldPassword, $scope.formData.newPassword)
                .then(navigateBack);

            promiseLoadingSpinnerService.addLoadingPromise(changePasswordPromise);
        }

        // ============================
        // Private Methods
        // ============================
        var navigateBack = function () {
            navigationService.goBack();
        }
    }
    );