angular.module('verklizan.umox.mobile.subscriber').service('subscriberDataManager',
    function ($rootScope, $q, 
        subscriberManagementServiceProxy, residenceManagementServiceProxy,
        incidentManagementServiceProxy, careProviderManagementServiceProxy, pageSize,
        incidentManagementServiceRequestModel, subscriberFactory, descriptorFactory) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var that = this;
        var subscriberIdOfThisModel;

        var profileInfoLoaded = false;
        var residenceInfoLoaded = false;
        var medicalInfoLoaded = false;
        var medicationInfoLoaded = false;

        var profileInfoDeffered;
        var residenceInfoDeffered;
        var medicalInfoDeffered;
        var medicationInfoDeffered;
        //#endregion

        //#region Public Fields
        // ============================
        // Public Fields
        // ============================
        this.newNoteCache = null;
        //#endregion

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        this.clearCachedData = function () {
            resetDataManager();
        }

        this.getSubscriberInfo = function (subscriberId) {
            checkIfSubscriberIsChanged(subscriberId);

            if (profileInfoLoaded === false) {
                loadProfileInformation(subscriberId);
            }

            return profileInfoDeffered.promise;
        };

        this.getSubscriberPhoneNumbers = function (subscriberId) {
            var requestData = descriptorFactory.readXXLargeData(0);

            return subscriberManagementServiceProxy.readSubscriberContactItemPage(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor);
        }

        this.getResidenceInfo = function (subscriberId, residenceId) {
            checkIfSubscriberIsChanged(subscriberId);

            if (residenceInfoLoaded === false) {
                loadResidenceInformation(residenceId);
            }

            return residenceInfoDeffered.promise;
        }

        this.getMedicalTeleMedicine = function (subscriberId) {
            var matchMedicalInfo = /(MEDICAL\d=(.*))/g;
            var requestData = descriptorFactory.readNormalData(0);

            return subscriberManagementServiceProxy
                .readSubscriberSoapNotePage(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor)
                .then(function (response) {
                    var data = response;

                    var medicalDataRows = [];
                    for (var i = 0; i < data.Rows.length; i++) {
                        var currentNoteContent = data.Rows[i].Content; 

                        var result;
                        while ((result = matchMedicalInfo.exec(currentNoteContent))) {
                            var urlOfTeleMedicine = result[2];
                            if (urlOfTeleMedicine.indexOf("http") !== 0) {
                                urlOfTeleMedicine = "http://" + urlOfTeleMedicine;
                            }
                            medicalDataRows.push(urlOfTeleMedicine);
                        }
                    }
                    return medicalDataRows;
                });
        }

        this.getNotesInfo = function (subscriberId, pageIndex, pageSize) {
            return loadNotesInfo(subscriberId, pageIndex, pageSize);
        }

        this.getNoteDetailInfo = function (noteId) {
            return subscriberManagementServiceProxy.readSubscriberHtmlNote(noteId);
        }

        this.getCaregiversInfo = function (subscriberId, pageIndex, pageSize) {
            return loadCaregiversInfo(subscriberId, pageIndex, pageSize);
        }

        this.getCaregiverPhoneNumbers = function (caregiverId) {
            var requestData = descriptorFactory.readXXLargeData(0);

            return careProviderManagementServiceProxy
                .readProfessionalCaregiverContactItemPage(caregiverId, requestData.filters, requestData.sort, requestData.pageDescriptor);
        }

        this.getMedicalInfo = function (subscriberId) {
            checkIfSubscriberIsChanged(subscriberId);

            if (medicalInfoLoaded === false) {
                loadMedicalInfo(subscriberId);
            }

            return medicalInfoDeffered.promise;
        }

        this.getMedicationInfo = function (subscriberId) {
            checkIfSubscriberIsChanged(subscriberId);

            if (medicationInfoLoaded === false) {
                loadMedicationInfo(subscriberId);
            }

            return medicationInfoDeffered.promise;
        }

        this.getAlarmInfo = function (subscriberId, pageIndex) {
            return loadAlarmInfo(subscriberId, pageIndex);
        }

        this.createNote = function (subscriberId, newNote) {
            this.newNoteCache = newNote;

            return that.getSubscriberInfo(subscriberId).then(function (profileInfo) {
                var personId = profileInfo.Identity.Id;

                return createNote(personId, newNote.subject, newNote.content, newNote.crmNote, newNote.callcenterNote, newNote.photo);
            });
        };


        //#endregion

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var checkIfSubscriberIsChanged = function (subscriberId) {
            if (subscriberIdOfThisModel !== subscriberId) {
                resetDataManager();
                subscriberIdOfThisModel = subscriberId;
            }
        }

        var loadProfileInformation = function (subscriberId) {
            return subscriberManagementServiceProxy.readSubscriber(subscriberId).then(function (response) {
                profileInfoLoaded = true;
                profileInfoDeffered.resolve(response);
            }).catch(function (error) {
                profileInfoDeffered.reject(error);
            });
        };

        var loadResidenceInformation = function (residenceId) {
            return residenceManagementServiceProxy.readResidence(residenceId).then(function (response) {
                residenceInfoLoaded = true;
                residenceInfoDeffered.resolve(response);
            }).catch(function (error) {
                residenceInfoDeffered.reject(error);
            });
        };

        var loadNotesInfo = function (subscriberId, pageIndex) {
            var requestData = descriptorFactory.readNormalData(pageIndex);

            return subscriberManagementServiceProxy
                .readSubscriberHtmlNotePage(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor);
        };

        var loadCaregiversInfo = function (subscriberId, pageIndex) {
            var requestData = descriptorFactory.readNormalData(pageIndex);

            return careProviderManagementServiceProxy
                .readCaregiversForSubscriberResidenceSchemePage(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor);
        }

        var loadMedicalInfo = function (subscriberId) {
            return subscriberManagementServiceProxy.readMedicalInfoPage(subscriberId).then(function (response) {
                medicalInfoDeffered.resolve(response);
            });
        }

        var loadMedicationInfo = function (subscriberId) {
            subscriberManagementServiceProxy.readMedicationPage(subscriberId).then(function (response) {
                medicationInfoDeffered.resolve(response);
            });
        }

        var loadAlarmInfo = function (subscriberId, pageIndex) {
            var requestData = incidentManagementServiceRequestModel.createSortedRequestModel(pageIndex, pageSize.Normal);
            return incidentManagementServiceProxy
                .readIncidentPageForSubscriber(subscriberId, requestData.filters, requestData.sort, requestData.pageDescriptor);
        };

        var createNote = function (personId, subject, content, crmCheck, callCheck, photo) {
            var note = subscriberFactory
                .createSimpleSubscriberNote(personId, subject, content, crmCheck, callCheck, photo);

            return subscriberManagementServiceProxy.createSubscriberNote(note)
                .then(function (response) {
                    that.newNoteCache = null;
                });
        };

        var resetDataManager = function () {
            profileInfoLoaded = false;
            residenceInfoLoaded = false;
            medicalInfoLoaded = false;
            medicationInfoLoaded = false;

            profileInfoDeffered = $q.defer();
            residenceInfoDeffered = $q.defer();
            medicalInfoDeffered = $q.defer();
            medicationInfoDeffered = $q.defer();
        }
        //#endregion
    }
);
