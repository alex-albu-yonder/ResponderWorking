angular.module('verklizan.umox.mobile.subscriber').service('newSubscriberDataManager',
    function ($rootScope, $q, organizationSettingsService, supportingDataManager, listSelectorService, residenceManagementServiceProxy,
        subscriberManagementServiceProxy, dateExtensionService, userDataManager, subscriberFactory, residenceFactory, AutoCompleteDataManager, autoCompleteService) {
        'use strict';

        //#region Private Fields
        // ============================
        // Private Fields
        // ============================
        var that = this;
        var newSubscriberProfileInfo = {};
        var newSubscriberResidenceInfo = {};
        //#endregion Fields

        //#region Properties
        // ============================
        // Properties
        // ============================
        this.getNewSubscriberProfileInfo = function () {
            return newSubscriberProfileInfo;
        };

        this.getNewSubscriberResidenceInfo = function () {
            return newSubscriberResidenceInfo;
        };

        this.setNewSubscriberProfileInfo = function (profileInfo) {
            newSubscriberProfileInfo = profileInfo;
        };

        this.setNewSubscriberResidenceInfo = function (residenceInfo) {
            newSubscriberResidenceInfo = residenceInfo;
        };

        this.selectCity = function () {
            autoCompleteService.createAutoComplete('_ListSelector_cities_', new AutoCompleteDataManager(supportingDataManager.getCities), setSelectedCity, getUserOrganizationId()).start();
        };

        this.selectRegion = function () {
            autoCompleteService.createAutoComplete('_ListSelector_regions_', new AutoCompleteDataManager(supportingDataManager.getRegions), setSelectedRegion, getUserOrganizationId()).start();
        }

        this.setResidenceInfoAndCreateNewSubscriber = function (residenceInfo) {
            this.setNewSubscriberResidenceInfo(residenceInfo);

            // Check if both the fields are set
            if (newSubscriberProfileInfo && newSubscriberResidenceInfo) {
                console.log("Sending request for new Subscriber");

                // Take over the organization that was chosen by the for the Subscriber.
                newSubscriberResidenceInfo.organizationId = getUserOrganizationId();

                return createResidence().then(function (response) {
                    console.log("succesfull added residence");
                    return createSubscriber(response);
                }).then(function (response) {
                    console.log("succesfull added subscriber");

                    // Clears the data
                    that.setNewSubscriberProfileInfo({});
                    that.setNewSubscriberResidenceInfo({});
                    
                    return response;
                });
            } else {
                console.error("profile info and residence info are not both submitted yet");
                return $q.reject("profile info and residence info are not both submitted yet");
            }
        };
        //#endregion Properties

        //#region Private Methods
        // ============================
        // Private Methods
        // ============================
        var createResidence = function () {
            var residence = residenceFactory.createSimpleResidence(
                newSubscriberResidenceInfo.houseNr,
                newSubscriberResidenceInfo.street,
                newSubscriberResidenceInfo.city.Id,
                getSelectedRegion(),
                newSubscriberResidenceInfo.postcode,
                newSubscriberResidenceInfo.phone,
                newSubscriberResidenceInfo.organizationId);

            return residenceManagementServiceProxy.createResidence(residence);
        };

        var createSubscriber = function (residenceId) {
            var status = organizationSettingsService.getSubscriberStatus();
            console.log("local status: " + status);

            // Convert the date to UTC JSON date value
            var birthDate = null;
            if (newSubscriberProfileInfo.birthDate) {
                birthDate = dateExtensionService.convertDateToMs(newSubscriberProfileInfo.birthDate);
            }

            var subscriber = subscriberFactory.createSimpleSubscriber(newSubscriberProfileInfo,
                birthDate,
                status,
                newSubscriberProfileInfo.organizationId,
                null,
                residenceId);

            return subscriberManagementServiceProxy.createSubscriber(subscriber); 
        };

        var setSelectedCity = function (selectedCity) {
            newSubscriberResidenceInfo.city = selectedCity;
        };

        var setSelectedRegion = function (selectedRegion) {
            newSubscriberResidenceInfo.region = selectedRegion;
        };

        var getSelectedRegion = function () {
            if (typeof (newSubscriberResidenceInfo.region) !== 'undefined') {
                return newSubscriberResidenceInfo.region.Id;
            }
        }

        var getUserOrganizationId = function () {
            return userDataManager.getUserOrganizationId();
        }
        //#endregion Private Methods
    }
);
