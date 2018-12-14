angular.module('verklizan.umox.mobile.account').controller('resetPasswordController',
    function ($scope, $routeParams, userDataManager, loadingScreenService, navigationService, promiseLoadingSpinnerService) {
        "use strict";

        // ============================
        // Public Fields
        // ============================
        $scope.isSubmitted = false;

        $scope.formData = {
            username: "",
            password: "",
            passwordReentered: "",
            activationCode : $routeParams.activationCodes
        }        

        // ============================
        // Public Methods
        // ============================
        $scope.resetPassword = function () {
            if ($scope.resetPasswordForm.$invalid) {
                $scope.isSubmitted = true;
                return;
            }

            var resetPasswordPromise = userDataManager.resetPassword($scope.formData.username, $scope.formData.password, $scope.formData.activationCode)
                .then(resetPasswordSuccess);

            promiseLoadingSpinnerService.addLoadingPromise(resetPasswordPromise);
        }

        // ============================
        // Private Methods
        // ============================
        var resetPasswordSuccess = function() {
            loadingScreenService.startAndReplaceLoadingWithTimeout(2000, navigateToLogin, "__Loading_PasswordResetSuccessfull__");
        }

        var navigateToLogin = function() {
            navigationService.navigateAndReplace("/login");
        }
    }
    );
