angular.module('verklizan.umox.mobile.account').controller('requestResetPasswordController',
    function ($scope, userDataManager, loadingScreenService, navigationService, promiseLoadingSpinnerService) {
        "use strict";

        // ============================
        // Public Fields
        // ============================
        $scope.username = "";
        $scope.isSubmitted = false;

        // ============================
        // Public Methods
        // ============================
        $scope.sendResetPasswordRequest = function (username) {
            if ($scope.forgotPasswordForm.$invalid) {
                $scope.isSubmitted = true;
                return;
            }

            var requestPasswordResetPromise = userDataManager.requestPasswordReset(username)
                .then(requestPasswordResetIsSend);

            promiseLoadingSpinnerService.addLoadingPromise(requestPasswordResetPromise);
        }

        // ============================
        // Private Methods
        // ============================
        var requestPasswordResetIsSend = function () {
            loadingScreenService.startAndReplaceLoadingWithTimeout(2000, navigateToResetPasswordPage, "_Loading_PasswordResetNavigation_");
        }

        var navigateToResetPasswordPage = function() {
            navigationService.navigateAndReplace("/accountPages/resetPassword");
        }
    }
    );
