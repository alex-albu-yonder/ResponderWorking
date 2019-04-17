angular.module('verklizan.umox.mobile.common').constant('urlConstants', {
    loginService: [
        "login",
        "logout",
        "readCurrentUserInfo"
    ],
    settingsService: [
        "getResponderSettings"
    ],
    userManagementService: [
        "readCurrentOperator",
        "requestPasswordReset",
        "resetPassword",
        "changePassword"
    ],
    subscriberManagementService: [
        "searchSubscribers",
        "readsubscriber",
        "createsubscriber",
        "readsubscriberstatepage",
        "readmedicalinfopage",
        "readmedicationpage",
        "createsubscribernote",
        "readSubscriberHtmlNote",
        "readSubscriberHtmlNotePage",
        "readSubscriberNotePage"
    ],
    residenceManagementService: [
        "readresidence",
        "createresidence"
    ],
    careProviderManagementService: [
        "readCaregiversForSubscriberResidenceSchemePage",
        "readCurrentProfessionalCaregiver",
        "readProfessionalCaregiverContactItemPage"
    ],
    deviceManagementService: [
        "readdevicesforsubscriberresidencepage",
        "searchdevice",
        "readdevicestatepage"
    ],
    incidentManagementService: [
        "readincidentpageforsubscriber"
    ],
    supportingDataManagementService: [
        "readOrganizationPage",
        "readNewOrganizationMessageCount",
        "readcitypage",
        "readregionpage",
        "createorganizationnote",
        "readorganizationnotepage",
        "readContractVersion"
    ],
    contractManagementService: [
        "createsubscriberdevicelink",
        "deletesubscriberdevicelink",
        "createresidencedevicelink",
        "deleteresidencedevicelink"
    ],
    pushNotificationService: [
        "registerDevice",
        "unregisterDevice",
        "readCareRequestPage",
        "updateCareRequestStatus",
        "acceptCareRequestWithSpeak",
        "getCareRequest"
    ]
});
