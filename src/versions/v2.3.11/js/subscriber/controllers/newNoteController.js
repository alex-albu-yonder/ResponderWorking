angular.module('verklizan.umox.mobile.subscriber').controller('newNoteController',
    function newNoteController($scope, $routeParams, subscriberDataManager, cameraService,
        fieldLengthConstants, promiseLoadingSpinnerService, navigationService) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var subscriberId = $routeParams.id;

        // ============================
        // Public Fields
        // ============================
        $scope.submitted = false;
        $scope.subscriberInfo = null;
        $scope.base64StringPrefix = "data:image/jpeg;base64,";
        $scope.maxTitleFieldLength = fieldLengthConstants.noteTitle;

        $scope.newNote = subscriberDataManager.newNoteCache || {
            subject: "",
            content: "",
            photo: "",
            callcenterNote: false,
            crmNote: false
        }

        // ============================
        // Events
        // ============================
        $scope.$on('$viewContentLoaded', function () {
            loadSubscriberInfo();
        });

        // ============================
        // Public Methods
        // ============================
        $scope.addNewNote = function () {
            console.log("new Note method called");
            $scope.submitted = true;

            if ($scope.newNoteForm.$valid) {
                var newNotePromise = subscriberDataManager.createNote(subscriberId, $scope.newNote)
                    .then(noteCreatedSucces);

                promiseLoadingSpinnerService.addLoadingPromise(newNotePromise);
            }
        };

        $scope.setPicture = function () {
            saveCurrentNewNote();

            var options = {
                returnAsBytes: true,
                targetWidth: 1000,
                targetHeight: 1000,
                correctOrientation: true
            };

            var cameraGetPromise = cameraService.getPicture(options).then(function (imageData) {
                $scope.newNote.photo = imageData;
                console.log("succes camera");
            }).catch(function (message) {
                console.log("error camera: " + message);
            });

            promiseLoadingSpinnerService.addLoadingPromise(cameraGetPromise);

            console.log("set picture method called");
        };

        // ============================
        // Private Methods
        // ============================
        var loadSubscriberInfo = function () {
            subscriberDataManager.getSubscriberInfo(subscriberId).then(function (subscriberInfo) {
                $scope.subscriberInfo = subscriberInfo;
            });
        }

        var saveCurrentNewNote = function () {
            subscriberDataManager.newNoteCache = $scope.newNote;
        }

        var noteCreatedSucces = function () {
            navigationService.goBack();
        };
    }
);