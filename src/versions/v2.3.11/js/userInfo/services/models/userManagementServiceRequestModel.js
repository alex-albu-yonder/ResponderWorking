angular.module('verklizan.umox.mobile.userInfo').factory('userManagementServiceRequestModel',
    function () {
        var requestData = {};

        requestData.requestPasswordReset = function (username) {
            return {
                email: username
            }
        }

        requestData.resetPassword = function (email, newPassword, resetCode) {
            return {
                email: email,
                password: newPassword,
                resetCode: resetCode
            };
        };

        requestData.changePassword = function (oldPassword, newPassword) {
            return {
                oldPassword: oldPassword,
                newPassword: newPassword
            };
        };

        return requestData;
    }
);