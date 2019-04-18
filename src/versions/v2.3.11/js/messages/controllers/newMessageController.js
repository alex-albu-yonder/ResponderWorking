angular.module('verklizan.umox.mobile.messages').controller('newMessageController',
    function newMessageController($scope, messageDataManager, organizationTreeBuilderService, fieldLengthConstants, promiseLoadingSpinnerService) {
        'use strict';

        //global accesible variables
        $scope.submitted = false;
        $scope.organizations = organizationTreeBuilderService.getOrganizationTreeView();
        $scope.maxTitleFieldLength = fieldLengthConstants.noteTitle;

        // Create the default empty object.
        $scope.newMessage = {
            organization: "",
            subject: "",
            content: "",
            fromDate: new Date(),
            toDate: ""
        }

        //methods
        $scope.addNewMessage = function () {
            console.log("new Message method called");
            $scope.submitted = true;

            // Validate required fields.
            var isValidToDate = $scope.toDateIsValid();

            if ($scope.newMessageForm.$valid && isValidToDate) {
                var createNotePromise = messageDataManager.createOrganizationNote($scope.newMessage).then(createMessageSuccess);
                promiseLoadingSpinnerService.addLoadingPromise(createNotePromise);
            }
        };

        $scope.toDateIsValid = function () {
            var toDate = $scope.newMessage.toDate;
            var fromDate = $scope.newMessage.fromDate;

            if (toDate && toDate < fromDate) {
                return false;
            } else {
                return true;
            }
        }

        $scope.$on('supportingDataManager::organizationsUpdated', function () {
            $scope.organizations = organizationTreeBuilderService.getOrganizationTreeView();
        });

        var createMessageSuccess = function() {            
            history.back();
        };
    }
);
