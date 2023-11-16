/**
 * @ngdoc overview
 * @name CordovaUTIL
*/
angular.module('verklizan.umox.common.html5.vkz-webrequests', [
    'verklizan.umox.common.html5.vkz-webrequests.domain',
    'verklizan.umox.common.html5.vkz-webrequests.service',
    'verklizan.umox.common.html5.vkz-webrequests.directives'
]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.domain', [
    'verklizan.umox.common.html5.vkz-utilities.general',
    'verklizan.umox.common.html5.vkz-webrequests.domain.enums'
]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums', []);

angular.module('verklizan.umox.common.html5.vkz-webrequests.service', [
    'verklizan.umox.common.html5.vkz-webrequests.proxy',
    'verklizan.umox.common.html5.vkz-webrequests.domain',
    'verklizan.umox.common.html5.vkz-utilities'
]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy', [
    'verklizan.umox.common.html5.vkz-webrequests.general'
]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general', [
    'verklizan.umox.common.html5.vkz-utilities.settings'
]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.directives', [
    'verklizan.umox.common.html5.vkz-webrequests.general'
]);

/**
 * @ngdoc directive
 * @name WebRequests.directives.ngAuthorization
 *
 * @description
 * This directive will not render the transcluded content if no access
*/
angular.module('verklizan.umox.common.html5.vkz-webrequests.directives').directive('diAuthorized',
    ['$rootScope', '$window', '$log', 'taskAuthorizationService', 'moduleAuthorizationService', function ($rootScope, $window, $log, taskAuthorizationService, moduleAuthorizationService) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                ngAuthorizationTask: '=',
                ngAuthorizationModule: '='
            },
            transclude: true,
            link: function (scope, elem, attrs, ctrl, transcludeFnc) {

                function AmIAuthorizedForTask() {
                    if (angular.isArray(scope.ngAuthorizationTask)) {
                        for (var index = 0; index < scope.ngAuthorizationTask.length; index++) {
                            var element = scope.ngAuthorizationTask[index];
                            if (taskAuthorizationService.isAuthorizedForTask(element) === false) {
                                return false;
                            }
                        }
                    } else {
                        if (taskAuthorizationService.isAuthorizedForTask(scope.ngAuthorizationTask) === false) {
                            return  false;
                        }
                    }
                    return true;
                }

                function AmIAuthorizedForModule() { 
                    if (angular.isArray(scope.ngAuthorizationModule)) {
                        for (var index = 0; index < scope.ngAuthorizationModule.length; index++) {
                            var element = scope.ngAuthorizationModule[index];
                            if (moduleAuthorizationService.isAuthorizedForModule(element) === false) {
                                return false;
                            }
                        }
                    } else {
                        if (moduleAuthorizationService.isAuthorizedForModule(scope.ngAuthorizationModule) === false) {
                            return false;
                        }
                    }
                    return true;
                }

                if(AmIAuthorizedForTask() && AmIAuthorizedForModule()) {
                    transcludeFnc(scope.$parent, function (clone) { //Take the parent scope, stupid changes in the 1.3 release in my opinion
                        elem.append(clone);
                        console.log('authorized granted');
                    });
                }   
            }
        };
    }]
);

/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('appointmentFactory',
    ['domainDefaults', 'domainEnums', function (domainDefaults, domainEnums) {
        'use strict';

        var model = {};

        model.createAppointment = function () {
            var appointment = {
                appointmentPageDtoItem: null,
                customAppointmentDtoItem: model.createCustomAppointmentDtoItem(),
                plannedDate: null,
                endDate: null,
                isRecurrenceEnabled: false,
                isAllowedToEditRecurrence: true,
            };

            appointment.setAppointmentType = function (appointmentType) {
                appointment.customAppointmentDtoItem.Appointment.AppointmentTypeId = appointmentType.Id;
                appointment.customAppointmentDtoItem.Appointment.AppointmentHandlerId = appointmentType.AppointmentHandlerId;
            };

            return appointment;
        };

        // This object contains properties which are both part of the 'SingleAppointment' and 'RecurringAppointmentOccurrence' objects.
        model.createCustomAppointmentDtoItem = function () {
            return {
                Appointment: {
                    AppointmentTypeId: null,
                    AppointmentHandlerId: null,
                    Subject: null,
                    Remarks: null,
                    RecurrenceDaysOfWeek: 0,
                    DurationMinutes: 0
                }
            }
        };

        model.createCalendarDto = function (ownerId) {
            return {
                OwnerType: domainEnums.calendarOwnerTypeValues.Subscriber,
                OwnerId: ownerId
            }
        };

        model.createRecurringAppointmentDto = function (appointmentTypeId, appointmentHandlerId, subject, remarks, startDate, timeZone, recurrenceDaysOfWeek, ownerId, reminderActionBeforeStartInMinutes) {
            return {
                Appointment: {
                    AppointmentKind: domainEnums.appointmentKindValues.Appointment,
                    AppointmentTypeId: appointmentTypeId,
                    AppointmentHandlerId: appointmentHandlerId,
                    Subject: subject,
                    Remarks: remarks,
                    DurationMinutes: 0,
                    HandlerActionBeforeStartDateMinutes: reminderActionBeforeStartInMinutes,
                    StartDate: startDate,
                    TimeZone: timeZone,
                    RecurrenceCount: -1,
                    RecurrenceFrequency: 1,
                    RecurrenceType: domainEnums.appointmentRecurrenceTypeValues.Weekly,
                    RecurrenceDaysOfWeek: recurrenceDaysOfWeek,
                    RecurrenceDayNumber: 0,
                    RecurrenceDayType: domainEnums.appointmentRecurrenceDaysOfWeekValues.None
                },

                Calendars: [model.createCalendarDto(ownerId)]
            }
        };

        model.createSingleAppointmentDto = function (appointmentTypeId, appointmentHandlerId, subject, remarks, plannedDate, ownerId, durationMinutes, reminderActionBeforeStartInMinutes) {
            return {
                Appointment: {
                    //Id: '00000000-0000-0000-0000-000000000000',
                    //DeletedDate: null,
                    //Version: 0,
                    AppointmentKind: domainEnums.appointmentKindValues.Appointment,
                    AppointmentTypeId: appointmentTypeId,
                    AppointmentHandlerId: appointmentHandlerId,
                    Subject: subject,
                    Remarks: remarks,
                    DurationMinutes: durationMinutes,
                    HandlerActionBeforeStartDateMinutes: reminderActionBeforeStartInMinutes,
                    PlannedDate: plannedDate,
                    Status: domainEnums.appointmentStateValues.Planned,
                    HandlerStatus: domainEnums.appointmentHandlerStateValues.Unhandled
                },

                Calendars: [model.createCalendarDto(ownerId)]
            }
        };

        return model;
    }])
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('descriptorFactory',
['$window', 'descriptors', 'domainEnums', 'pageSize', function ($window, descriptors, domainEnums, pageSize) {
    'use strict';

    var model = {};

    //#region genericPages
    function createFilterSelectable() {
        var filterItems = [];
        filterItems.push(new descriptors.filterDescriptorItem('Selectable', true, domainEnums.filterOperation.Equals));
        return filterItems;
    }

    function createSortSortIndex() {
        return new descriptors.sortDescriptor(true, 'SortIndex');
    }

    function createSortSortIndexDescending() {
        return new descriptors.sortDescriptor(false, 'SortIndex');
    }

    function createSortName() {
        return new descriptors.sortDescriptor(true, 'Name');
    }

    function createSortDescription() {
        return new descriptors.sortDescriptor(true, 'Description');
    }

    //This code will generate a collection of request bodies which are often used in paging.
    //This code will generate the following structure of calls:
    //  readSmallData / readNormalData / etc
    //  readSmallDataSortSortIndex / readNormalDataSortIndex / readNormalDataSortName / etc
    //  readSmallDataSortSortIndexFilterSelectable / readNormalDataSortNameFilterSelectable / etc
    (function () {


        var pageSizes = [
            {
                name: 'Small',
                pageSize: pageSize.Small
            },
            {
                name: 'Normal',
                pageSize: pageSize.Normal
            },
            {
                name: 'Large',
                pageSize: pageSize.Large
            },
            {
                name: 'XXLarge',
                pageSize: pageSize.XXLarge
            }
        ];

        var filters = [
            {
                name: 'Selectable',
                fnc: createFilterSelectable()
            }
        ];

        var sorts = [
            {
                name: 'SortIndex',
                fnc: createSortSortIndex()
            },
            {
                name: 'SortIndexDesc',
                fnc: createSortSortIndexDescending()
            },
            {
                name: 'Name',
                fnc: createSortName()
            },
            {
                name: 'Description',
                fnc: createSortDescription()
            }
        ];

        function dynamicFunctionClosure(pageSize, sort, filterItem) {
            return function (pageIndex, filterOptions) {
                var _filterItem = filterItem;

                var filter = null;
                //Setup filters
                if(angular.isArray(filterOptions)){
                    for (var i = 0; i < filterOptions.length; i++) {
                        var filterOptionObject = filterOptions[i];
                        _filterItem = !$window.isNullOrUndefined(_filterItem) ? _filterItem : [];
                        _filterItem.push(new descriptors.filterDescriptorItem(filterOptionObject.filterProperty, filterOptionObject.filterValue, filterOptionObject.filterOperator));
                    }
                }

                if ($window.isNullOrUndefined(_filterItem) === false) {
                    filter = new descriptors.filterDescriptor(_filterItem, domainEnums.filterOperator.And);
                }

                return {
                    pageDescriptor: new descriptors.pageDescriptor(pageIndex, pageSize),
                    sort: sort,
                    filters: filter
                };
            };
        }

        //Loop through all pagesizes and generate functions
        for (var i = 0; i < pageSizes.length; i++) {
            var setupFunctionName = 'read' + pageSizes[i].name + 'Data';
            model[setupFunctionName] = dynamicFunctionClosure(pageSizes[i].pageSize, null, null); //create 'normal' read functions like readSmallData

            for (var i1 = 0; i1 < sorts.length; i1++) {
                var sortFunctionName = 'read' + pageSizes[i].name + 'DataSort' + sorts[i1].name;
                model[sortFunctionName] = dynamicFunctionClosure(pageSizes[i].pageSize, sorts[i1].fnc, null);//create sort functions like readSmallDataSortSortIndex

                for (var i2 = 0; i2 < filters.length; i2++) {
                    var sortAndFilterFunctionName = 'read' + pageSizes[i].name + 'DataSort' + sorts[i1].name + 'Filter' + filters[i2].name;
                    model[sortAndFilterFunctionName] = dynamicFunctionClosure(pageSizes[i].pageSize, sorts[i1].fnc, filters[i2].fnc); // create sort and filter functions like readSmallDataSortSortIndexFilterSelectable
                }
            }
            for (var i3 = 0; i3 < filters.length; i3++) {
                var filterFunctionName = 'read' + pageSizes[i].name + 'DataFilter' + filters[i3].name;
                model[filterFunctionName] = dynamicFunctionClosure(pageSizes[i].pageSize, null, filters[i3].fnc); //create filter functions like readSmallDataFilterSelectable
            }
        }
    })();

    model.FilterOptionObject = function(filterProperty, filterValue, filterOperator) {
        if ($window.isNullOrUndefined(filterProperty) || angular.isUndefined(filterValue)) { //filter value is allowed to be null
            throw 'Incorrect creation of a FilterOptionObject';
        }
        filterOperator = filterOperator || domainEnums.filterOperation.Equals;
        this.filterProperty = filterProperty;
        this.filterValue = filterValue;
        this.filterOperator = filterOperator;
    };

    return model;

}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('descriptors',
function () {
    'use strict';

    var model = {};

    model.pageDescriptor = function (pageIndex, pageSize) {
        this.__type = "PageDescriptor:www.verklizan.com";
        this.PageIndex = pageIndex;
        this.PageSize = pageSize;
    };

    model.filterDescriptorItem = function (property, value, filterOperation) {
        if (angular.isArray(property) === false) {
            property = [property];
        }

        this.__type = "FilterDescriptor:www.verklizan.com";
        this.FilterProperty = property;
        this.FilterValue = value;
        this.Operation = filterOperation;
    };

    model.filterDescriptor = function (list, operator) {
        this.__type = "FilterDescriptorList:www.verklizan.com";
        this.List = list;
        this.Operator = operator;
    };

    model.sortDescriptor = function (directionIsAscending, sortProperty) {
        this.__type = "SortDescriptorList:www.verklizan.com";
        this.List = [
            {
                Direction: (directionIsAscending ? 1 : 2),
                SortProperty: [sortProperty]
            }
        ];
    };

    model.sortDescriptorWithMultipleSortProperties = function (directionIsAscending, sortProperties) {
        this.__type = "SortDescriptorList:www.verklizan.com";
        this.List = [
            {
                Direction: (directionIsAscending ? 1 : 2),
                SortProperty: sortProperties
            }
        ];
    };

    return model;
});

/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('domainDefaults',
    function () {
        'use strict';

        var defaults = {};

        defaults.emptyGuid = "00000000-0000-0000-0000-000000000000";

        defaults.emptyString = "";

        defaults.defaultImageMemeType = "image/jpeg";

        return defaults;
    });

/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('domainEnums',
    function () {
        'use strict';

        var model = {};

        // Note: Place in alphabetical order

        model.addressFormatTypeValues = {
            Default : 0,
            UKAddress : 1
        };

        model.appointmentHandlerStateValues = {
            Unknown: 0,
            Unhandled: 1,
            Succeeded: 2,
            Failed: 3,
            OutOfTime: 4
        };

        model.appointmentKindValues = {
            Unknown: 0,
            Appointment: 1,
            ServiceTask: 2,
            AutoProc: 3
        };

        model.appointmentRecurrenceTypeValues = {
            Daily: 0,
            Weekly: 1,
            Monthly: 2,
            Yearly: 3
        };

        model.appointmentRecurrenceDaysOfWeekValues = {
            None: 0,
            Sunday: 1,
            Monday: 2,
            Tuesday: 4,
            Wednesday: 8,
            Thursday: 16,
            Friday: 32,
            Saturday: 64
        };

        model.appointmentStateValues = {
            Unknown: 0,
            Planned: 1,
            Unplanned: 2,
            Completed: 3,
            Failed: 4
        };

        model.calendarOwnerTypeValues = {
            None: 0,
            Operator: 1,
            Subscriber: 2,
            Technician: 3,
            Role: 4
        };

        model.caregiverCategory = {
            Unknown: 0,
            Professional: 1,
            Relational: 2,
            Warden: 4,
            ProfessionalAsRelational: 8
        };

        model.careRequestStatus = {
            Unknown: 0,
            Send: 1,
            RequestReceived: 2,
            Accept: 3,
            Decline: 4,
            Arrived: 5,
            Done: 6,
            DeviceNotReachable: 7,
            Cancelled: 8,
            Closed: 9,
        };

        model.deviceTypeValues = {
            Unknown : 0,
            DeviceType : 1,
            SimpleDeviceType : 2
        };

        model.eventTypeValues = {
            Unknown : 0,
            NoAlarm : 16777216,
            OperatorStartAlarm : 16777217,
            MainAlarm : 16777316,
            VoiceRemoteAlarm : 16777317,
            PersonalTrigger1Alarm : 16777317,
            PersonalTrigger2Alarm : 16777318,
            PersonalTrigger3Alarm : 16777319,
            PersonalTrigger4Alarm : 16777320,
            PersonalTrigger5Alarm : 16777321,
            PersonalTrigger6Alarm : 16777322,
            PersonalTrigger7Alarm : 16777323,
            PersonalTrigger8Alarm : 16777324,
            PersonalTrigger9Alarm : 16777325,
            PersonalTrigger10Alarm : 16777326,
            MainEndAlarm : 16777326,
            RepeatedCallAlarm : 16777327,
            DoorBellAlarm : 16777328,
            BurglaryDetectionAlarm : 16777329,
            SmokeDetectorAlarm : 16777330,
            LowTemperatureAlarm : 16777331,
            AcousticAlarm : 16777332,
            DoorAlarm : 16777333,
            MedicalAlarmWithVoiceAlarm : 16777334,
            BedAlarm : 16777335,
            AssistanceAlarmWithVoiceAlarm : 16777336,
            KitchenAlarm : 16777337,
            LivingroomAlarm : 16777338,
            HallAlarm : 16777339,
            ToiletAlarm : 16777340,
            SurroundingAlarm : 16777341,
            GasAlarm : 16777342,
            LightFailureAlarm : 16777343,
            FireAlarm : 16777344,
            HeaterFailureAlarm : 16777345,
            VoiceTestAlarm : 16777346,
            PowerFailAlarm : 16777347,
            AbsentAlarm : 16777348,
            PresentAlarm : 16777349,
            PoweronAlarm : 16777350,
            VoicePowerRestoreAlarm : 16777351,
            TamperAlarm : 16777352,
            MaintenanceAlarm : 16777353,
            MovementDetectionAlarm : 16777354,
            SmokeAlarm : 16777355,
            SleepingroomAlarm : 16777356,
            BathroomAlarm : 16777357,
            DiningroomAlarm : 16777358,
            StudyAlarm : 16777359,
            StairsAlarm : 16777360,
            GarageAlarm : 16777361,
            GardenAlarm : 16777362,
            FallDetectorAlarm : 16777363,
            ElevatorAlarm : 16777364,
            GeoFenceAlarm : 16777365,
            InactivitieDetectAlarm : 16777366,
            PeriodicCheckReportAlarm : 16777367,
            FrequentOutOfBedAlarm : 16777368,
            PullCordAlarm : 16777369,
            CareWorkerAbsentVoiceAlarm : 16777370,
            MoistureAlarm : 16777371,
            VoiceRemoteLostAlarm : 16777372,
            GeneralDeviceErrorAlarm : 16777373,
            CoDetectorAlarm : 16777375,
            ServiceReportAlarm : 16777376,
            VoicePowerFaultAlarm : 16777377,
            VoiceRemoteBatteryFaultAlarm : 16777378,
            VoiceBatteryFaultAlarm : 16777379,
            VoiceWardenAttendanceAlarm : 16777380,
            UrgencyAlarm : 16777381,
            ExternalAlarm : 16777382,
            InvalidEndOfAlarm : 16777383,
            VoiceIntruderAlarm : 16777385,
            CareWorkerPresentVoiceAlarm : 16777386,
            VoiceBatteryRestoreAlarm : 16777387,
            CriteriumFaultAlarm : 16777388,
            DeviceCommunicationLostAlarm : 16777389,
            DeviceCommunicationRestoreAlarm : 16777390,
            AssaultAlarm : 16777391,
            PullCordTamperAlarm : 16777392,
            WanderAlarm : 16777393,
            LoneWorkerAlarm : 16777394,
            VoicePanicButtonAlarm : 16777395,
            Error1Alarm : 16777396,
            Error2Alarm : 16777397,
            Error3Alarm : 16777398,
            Error4Alarm : 16777399,
            Error5Alarm : 16777400,
            UnwantedVisitorAlarm : 16777401,
            ReservedAlarm : 16777402,
            NewSubscriberAlarm : 16777403,
            ClosedSubscriberAlarm : 16777404,
            ForgottenMedicationAlarm : 16777405,
            VideoAlarm : 16777406,
            MobileAlarm : 16777407,
            WristbandOffAlarm : 16777408,
            WristbandOnAlarm : 16777409,
            NoActivityAlarm : 16777410,
            WorseningHealthAlarm : 16777411,
            TelephoneAlarm : 16777412,
            TelephoneCallAlarm : 16777413,
            ManualAlarm : 16777414,
            DialAlarm : 16777415,
            OperatorEndAlarm : 16777415,
            LogStartAlarm : 16777416,
            MainAlarmNoVoiceAlarm : 16777416,
            DevicePowerFailAlarm : 16777417,
            TelephoneLineFaultAlarm : 16777418,
            BatteryFaultAlarm : 16777419,
            ExternalBatteryFaultAlarm : 16777420,
            DisconnectAlarm : 16777421,
            LightFailureAlarmNoVoiceAlarm : 16777422,
            FireAlarmNoVoiceAlarm : 16777423,
            HeaterFailureAlarmNoVoiceAlarm : 16777424,
            SystemAlarm : 16777425,
            ProtocolTimeoutAlarm : 16777426,
            DeviceIdErrorAlarm : 16777427,
            AlarmIdErrorAlarm : 16777428,
            IntruderDetectionAlarm : 16777429,
            SmokeDetectorAlarmNoVoiceAlarm : 16777430,
            LowTemperatureAlarmNoVoiceAlarm : 16777431,
            GasAlarmNoVoiceAlarm : 16777432,
            MoistureAlarmNoVoiceAlarm : 16777433,
            ManualAlarmNoVoiceAlarm : 16777434,
            DoorAlarmNoVoiceAlarm : 16777435,
            GeneralInputAlarm : 16777436,
            Input1TestAlarm : 16777437,
            Input2TestAlarm : 16777438,
            Input3TestAlarm : 16777439,
            Input4TestAlarm : 16777440,
            Input5TestAlarm : 16777441,
            Input6TestAlarm : 16777442,
            Input7TestAlarm : 16777443,
            Input8TestAlarm : 16777444,
            Input9TestAlarm : 16777445,
            BedAlarmNoVoiceAlarm : 16777446,
            HeaterAlarmNoVoiceAlarm : 16777447,
            ToiletAlarmNoVoiceAlarm : 16777448,
            KitchenAlarmNoVoiceAlarm : 16777449,
            LivingroomAlarmNoVoiceAlarm : 16777450,
            HallAlarmNoVoiceAlarm : 16777451,
            AbsentAlarmNoVoiceAlarm : 16777452,
            PresentAlarmNoVoiceAlarm : 16777453,
            PoweronAlarmNoVoiceAlarm : 16777454,
            SurroundingAlarmNoVoiceAlarm : 16777455,
            EpilepsyAlarm : 16777456,
            DementiaAlarm : 16777457,
            TestAlarm : 16777458,
            MedicalAlarm : 16777459,
            AssistanceAlarm : 16777461,
            StartInterruptorAlarm : 16777462,
            ExternAlarm : 16777463,
            MaintenanceAlarmNoVoiceAlarm : 16777464,
            MovementAlarm : 16777465,
            DeviceLostAlarm : 16777466,
            DeviceVerifyAlarm : 16777467,
            WatchdogReportAlarm : 16777468,
            SmokeDetectorFailureNoVoiceAlarm : 16777469,
            LocalResetAlarm : 16777470,
            RemoteBatteryFaultAlarm : 16777471,
            RemoteLostAlarm : 16777472,
            InactivitieDetectNoVoiceAlarm : 16777473,
            ServiceReadyAlarm : 16777474,
            RemoteLongDistanceAlarm : 16777475,
            BaseStationLostAlarm : 16777476,
            WardenAttendanceAlarm : 16777477,
            BaseStationErrorAlarm : 16777478,
            LogAlarm : 16777479,
            DeviceCommunicationLostNoVoiceAlarm : 16777480,
            DeviceCommunicationRestoreNoVoiceAlarm : 16777481,
            SmokeDetectorStartupAlarm : 16777482,
            BatteryFullAlarm : 16777483,
            IntruderAlarm : 16777484,
            ErrorInMessageAlarm : 16777485,
            PanicButtonAlarm : 16777486,
            DevicePowerRestoreAlarm : 16777487,
            TelephoneLineRestoreAlarm : 16777488,
            BatteryRestoreAlarm : 16777489,
            DevicePoweronAlarm : 16777490,
            SmokeDetectorRestoreAlarm : 16777491,
            LowTempDetectorRestoreAlarm : 16777492,
            IntruderDetectorRestoreAlarm : 16777493,
            RemoteCommunicationRestoreAlarm : 16777494,
            RemoteFoundAlarm : 16777495,
            SystemError1ReportAlarm : 16777496,
            SystemError2ReportAlarm : 16777497,
            SystemError3ReportAlarm : 16777498,
            SystemError4ReportAlarm : 16777499,
            SystemError5ReportAlarm : 16777500,
            SystemError6ReportAlarm : 16777501,
            SystemError7ReportAlarm : 16777502,
            SystemError8ReportAlarm : 16777503,
            SystemError9ReportAlarm : 16777504,
            SystemError10ReportAlarm : 16777505,
            SystemError11ReportAlarm : 16777506,
            SystemError12ReportAlarm : 16777507,
            SystemError13ReportAlarm : 16777508,
            SystemError14ReportAlarm : 16777509,
            SystemError15ReportAlarm : 16777510,
            SystemError16ReportAlarm : 16777511,
            SystemError17ReportAlarm : 16777512,
            SystemError18ReportAlarm : 16777513,
            SystemError19ReportAlarm : 16777514,
            SystemError20ReportAlarm : 16777515,
            LocationVoiceStartAlarm : 16777516,
            AcousticAlarmNoVoiceAlarm : 16777516,
            FloodDetectorAlarm : 16777517,
            FloodDetectorAlarm2Alarm : 16777518,
            FloodDetectorAlarm3Alarm : 16777519,
            FloodDetectorAlarm4Alarm : 16777520,
            FloodDetectorAlarm5Alarm : 16777521,
            NotToBedAlarm : 16777522,
            NotOutOfBedAlarm : 16777523,
            OutOfBedAlarm : 16777524,
            Sleepingroom1Alarm : 16777525,
            Sleepingroom2Alarm : 16777526,
            RadioOutputModule1Alarm : 16777527,
            RadioOutputModule2Alarm : 16777528,
            RadioOutputModule3Alarm : 16777529,
            RadioOutputModule4Alarm : 16777530,
            Bathroom1Alarm : 16777531,
            Bathroom2Alarm : 16777532,
            ToiletDownstairsAlarm : 16777533,
            ToiletOutsideAlarm : 16777534,
            Kitchen1Alarm : 16777535,
            Kitchen2Alarm : 16777536,
            Livingroom1Alarm : 16777537,
            Livingroom2Alarm : 16777538,
            Garage1Alarm : 16777539,
            Garage2Alarm : 16777540,
            FrontYardAlarm : 16777541,
            BackYardAlarm : 16777542,
            AcousticDetector1Alarm : 16777543,
            AcousticDetector2Alarm : 16777544,
            AcousticDetector3Alarm : 16777545,
            AcousticDetector4Alarm : 16777546,
            AcousticDetector5Alarm : 16777547,
            ExtremeTemperatureDetectorAlarm : 16777548,
            ExtremeTemperatureDetectorLowAlarm : 16777549,
            ExtremeTemperatureDetectorHighAlarm : 16777550,
            PushButtonFallDetectorAlarm : 16777551,
            WanderDetectorAlarm : 16777552,
            FallDetector2Alarm : 16777553,
            SensorFailureAlarm : 16777554,
            SensorLifetimeExpiredAlarm : 16777555,
            Epilepsy2Alarm : 16777556,
            HeartProblemsAlarm : 16777557,
            SupervisorOnLocationAlarm : 16777558,
            PersonDownAlarm : 16777559,
            TemperatureLowAlarm : 16777560,
            TemperatureRisingAlarm : 16777561,
            BedInuseAlarm : 16777562,
            ChairInUseAlarm : 16777563,
            BathroomInUseAlarm : 16777564,
            PremisesInUseAlarm : 16777565,
            SupervisorLeftLocationAlarm : 16777566,
            ChairAbandonedAlarm : 16777567,
            BedLevelAlarm : 16777568,
            SystemTestModeAlarm : 16777569,
            AnounceBatteryFailAlarm : 16777571,
            InBatteryLoaderAlarm : 16777576,
            RemovedFromBatteryLoaderAlarm : 16777577,
            DoorLeftOpenAlarm : 16777578,
            BackupDeviceCommunicationLostNoVoiceAlarm : 16777580,
            BackupDeviceCommunicationRestoreNoVoiceAlarm : 16777581,
            ParkinsonAlarm : 16777592,
            OutsideGeoFenceAreaAlarm : 16777596,
            InsideGeoFenceAreaAlarm : 16777597,
            OutsideGeoFenceAreaReportAlarm : 16777598,
            InsideGeoFenceAreaReportAlarm : 16777599,
            PeriodicMessageNotAcknowledgedAlarm : 16777600,
            PeriodicMessageAcknowledgedAlarm : 16777601,
            AlarmunitNoRFdevicesAlarm : 16777604,
            ExternalAlarmRestoredAlarm : 16777605,
            AlarmRecoveredAlarm : 16777615,
            LocationVoiceEndAlarm : 16777615,
            HomeUnitOkAlarm : 16777616,
            SubscriberOkAlarm : 16777617,
            PanicRestoreAlarm : 16777618,
            BatteryFaultyAlarm : 16777619,
            ReminderAlarm : 16777620,
            PreviousSessionCommunicationErrorAlarm : 16777621,
            IncontinenceAlarm : 16777622,
            FallDetectionOnAlarm : 16777623,
            FallDetectionOffAlarm : 16777624,
            DevicePowerdownAlarm : 16777625,
            SimulatedAlarm : 16777626,
            RepeatedCallNoVoiceAlarm : 16777627,
            IncommingCallAlarm : 16777628,
            IntruderAlarmOnAlarm : 16777629,
            IntruderAlarmOffAlarm : 16777630,
            TeleMedicineAlarm : 16777631,
            AcknowledgementAlarm : 16777632,
            TeleMedicineErrorAlarm : 16777633,
            TelemedicineAlarm : 16777634,
            Movement2Alarm : 16777635,
            BadMeasurementDataAlarm : 16777636,
            BraceletOnAlarm : 16777637,
            BraceletOffAlarm : 16777638,
            BloodPressureHighAlarm : 16777639,
            PulseAlarm : 16777640,
            BodyTemperatureAlarm : 16777641,
            TelemedicineCancledAlarm : 16777642,
            TelemedicineTimeoutAlarm : 16777643,
            ServiceAlarm : 16777645,
            TeleMedicineTresholdAlarm : 16777646,
            TeleMedicineCriticalAlarm : 16777646,
            DeviceResetAlarm : 16777647,
            AlarmZoneShortedAlarm : 16777648,
            FalseAlarm : 16777649,
            DeviceRegisteredAlarm : 16777650,
            AlarmDeactivatedAlarm : 16777651,
            CareWorkerAbsentNoVoiceAlarm : 16777652,
            CareWorkerPresentNoVoiceAlarm : 16777653,
            CareWorkerMobilizedNoVoiceAlarm : 16777654,
            ActivityMonitorOnAlarm : 16777655,
            ActivityMonitorOffAlarm : 16777656,
            RadioRestoreAlarm : 16777657,
            ActionInformationAlarm : 16777658,
            NurseCallAlarm : 16777659,
            DoorMatAlarm : 16777660,
            TamperRestoreAlarm : 16777661,
            TamperNoVoiceAlarm : 16777662,
            FallDetectorNoVoiceAlarm : 16777663,
            CareWorkerRefusedNoVoiceAlarm : 16777664,
            GeoFenceAlarmNoVoiceAlarm : 16777665,
            GeoFenceReportAlarm : 16777666,
            ResetInactivityAlarm : 16777667,
            TransmitterOutOfRangeAlarm : 16777668,
            TransmitterInRangeAlarm : 16777669,
            RemoteBatteryRestoreAlarm : 16777670,
            NoAlarmAlarm : 16777671,
            RadioFailureAlarm : 16777672,
            CareworkerDoneAutomaticallyAlarm : 16777673,
            SmokeDetectorBatteryLowAlarm : 16777674,
            TransmitterLongRangeAlarm : 16777675,
            PositionUpdateAlarm : 16777676,
            PositionRequestByPhoneAlarm : 16777677,
            PositionRequestBySmsAlarm : 16777678,
            TraceOnAlarm : 16777679,
            TraceOffAlarm : 16777680,
            PositionUpdateRegistrationAlarm : 16777681,
            PositionRequestByPhoneRegistrationAlarm : 16777682,
            PositionRequestBySmsRegistrationAlarm : 16777683,
            TraceOnRegistrationAlarm : 16777684,
            TraceOffRegistrationAlarm : 16777685,
            DoorOpenRequestAlarm : 16777686,
            DoorOpenCommandAlarm : 16777687,
            PinVerifyRequestAlarm : 16777688,
            SerialNumberInputAlarm : 16777689,
            IgnitionAlarm : 16777690,
            StatusAlarmInputAlarm : 16777691,
            SpeedViolationAlarm : 16777692,
            KeyCodeRequestAlarm : 16777693,
            KeyCodeChangeAlarm : 16777694,
            UnrequestedDataAlarm : 16777695,
            MedicationAlarm : 16777696,
            MedicationTakenAlarm : 16777697,
            MedicationNotTakenAlarm : 16777698,
            NewTrayAlarm : 16777699,
            OnlineAlarm : 16777700,
            NoSchematicAlarm : 16777701,
            UnknownMessageAlarm : 16777702,
            TimePeriodExpiredAlarm : 16777703,
            WrongTemperatureAlarm : 16777706,
            FlatBatteryAlarm : 16777707,
            KidnapAlarm : 16777708,
            CarJackAlarm : 16777709,
            CollisionAlarm : 16777710,
            AssistanceRequestAlarm : 16777711,
            TrailerUncoupledAlarm : 16777712,
            TrailerUncoupledRestoreAlarm : 16777713,
            EmergencyStopAlarm : 16777714,
            EmergencyStopRestoreAlarm : 16777715,
            IncontinenceBatteryLowAlarm : 16777716,
            NotInBedDetectorBatteryLowAlarm : 16777717,
            NotOutOfBedDetectorBatteryLowAlarm : 16777718,
            OutOfBedDetectorBatteryLowAlarm : 16777719,
            BatteryLoadingAlarm : 16777720,
            SimReplacedAlarm : 16777721,
            CriteriaNotSupportedAlarm : 16777722,
            ChargingInterruptedAlarm : 16777723,
            ProgramModeEntryAlarm : 16777734,
            ProgramModeExitAlarm : 16777735,
            DownloadStartAlarm : 16777736,
            TimeDateResetAlarm : 16777737,
            GasDetectionRestoreAlarm : 16777738,
            TeleMedicineWarningAlarm : 16777746,
            InactivityRestoredAlarm : 16777765,
            DeviceRestoredAlarm : 16777766,
            DeviceResultAlarm : 16777767,
            Test2Alarm : 16777771,
            NetworkConnectionErrorAlarm : 16777775,
            NetworkConnectionRestoredAlarm : 16777776,
            GSMNetworkerrorAlarm : 16777778,
            GSMNetworkRestoredAlarm : 16777779,
            UnknownMeaningFirstAlarm : 16777816,
            UnknownMeaningLastAlarm : 16777915,
            AdministrationAlarm : 16777916,
            SubAlarm : 16777917,
            LoneWorkerJobAlarm : 16777918,
            PortStatusAlarm : 16778016,
            ProgrammingSuccesfullAlarm : 16778017,
            NoSystemAcknowledgeReceivedAlarm : 16778018,
            LogEndAlarm : 16778115,
            InternalStartAlarm : 16778116,
            InterfaceTimedoutAlarm : 16778116,
            SystemPowerFailAlarm : 16778117,
            SystemPowerRestoreAlarm : 16778118,
            LineFaultAlarm : 16778119,
            LineRestoreAlarm : 16778120,
            asBatteryFaultAlarm : 16778121,
            asBatteryRestoredAlarm : 16778122,
            BridgeStopAlarm : 16778123,
            BridgeStartAlarm : 16778124,
            LocalDiskAlarm : 16778125,
            ExceptionAlarm : 16778126,
            NetworkAlarm : 16778127,
            TransactionErrAlarm : 16778128,
            LogFileCopyAlarm : 16778129,
            TransactionOkAlarm : 16778130,
            CardLostAlarm : 16778131,
            CardFoundAlarm : 16778132,
            CardApplicErrAlarm : 16778133,
            CleanupFailAlarm : 16778134,
            AutoProcessFailAlarm : 16778135,
            ServiceFaultAlarm : 16778136,
            ServiceRestoreAlarm : 16778137,
            AudioNetworkFailAlarm : 16778138,
            AudioNetworkRestoreAlarm : 16778139,
            AudioRecorderLostAlarm : 16778140,
            DuplicateLocationAlarm : 16778141,
            DatabaseBackFailAlarm : 16778142,
            AutoCloseAddedAlarm : 16778143,
            AutoCloseRemovedAlarm : 16778144,
            LoopBackRestoreAlarm : 16778145,
            SmsModemLostAlarm : 16778146,
            SmsModemRestoreAlarm : 16778147,
            UmoTestAlarm : 16778148,
            LoopBackFailAlarm : 16778149,
            SmsModemNetworkLostAlarm : 16778150,
            SmsModemNetworkRestoreAlarm : 16778151,
            SmsModemSimNotInsertAlarm : 16778152,
            SmsModemSimRestoreAlarm : 16778153,
            UnknownSmsReceivedAlarm : 16778154,
            AutoCloseStartedAlarm : 16778155,
            CPUUsageLimitAlarm : 16778156,
            DiskUsageLimitAlarm : 16778157,
            MemoryUsageLimitAlarm : 16778158,
            AudioRecorderFailureAlarm : 16778159,
            ServiceModeStartAlarm : 16778160,
            ServiceModeStopAlarm : 16778161,
            UmoEscapeWarningAlarm : 16778162,
            BackupAlarm : 16778163,
            SwitchToStandbyAlarm : 16778164,
            SwitchToActiveAlarm : 16778165,
            ForcedCheckDoneAlarm : 16778166,
            LoopbackTestAlarm : 16778167,
            DialinWhileDialoutAlarm : 16778168,
            InterfaceHardwareErrorAlarm : 16778169,
            VoicemailWarningAlarm : 16778170,
            CardDisconnectAlarm : 16778171,
            CardWatchdogAlarm : 16778172,
            GuardProtocolAlarm : 16778173,
            CardConflictAlarm : 16778174,
            ReplicationErrorAlarm : 16778175,
            ProtocolErrorMinAlarm : 16778176,
            ProtocolErrorAlarm : 16778176,
            ProtocolError1Alarm : 16778177,
            ProtocolError2Alarm : 16778178,
            ProtocolError3Alarm : 16778179,
            ProtocolError4Alarm : 16778180,
            ProtocolError5Alarm : 16778181,
            ProtocolError6Alarm : 16778182,
            ProtocolError7Alarm : 16778183,
            ProtocolError8Alarm : 16778184,
            ProtocolError9Alarm : 16778185,
            ProtocolErrorMaxAlarm : 16778185,
            NetworkCommunicationRestoreAlarm : 16778186,
            NetworkCommunicationTimeoutAlarm : 16778187,
            NetworkCommunicationErrorAlarm : 16778189,
            ExternalServiceCommunicationLostAlarm : 16778190,
            ExternalServiceCommunicationRestoreAlarm : 16778191,
            DataExportSucceededAlarm : 16778192,
            DataExportRepeatedAttemptAlarm : 16778193,
            DataExportFailedAlarm : 16778194,
            ForcedProcessDbDisconnectAlarm : 16778195,
            SmsModemRoamingAlarm : 16778196,
            IncompleteAlarm : 16778206,
            UmoTest2Alarm : 16778210,
            WatchdogAlarm : 16778211,
            AlarmConflictAlarm : 16778212,
            AlarmLostAlarm : 16778213,
            AlarmCleanedAlarm : 16778214,
            CriteriumErrorAlarm : 16778215,
            InternalEndAlarm : 16778215,
            AutoCriteriumAlarm : 16778216,
            AutoCriteriumStartAlarm : 16778217,
            AutoCriteriumEndAlarm : 16779215,
            EventCriteriumStartAlarm : 16779216,
            EventCriteriumEndAlarm : 16780215,
            MaxCriteriumAlarm : 16780216,
            OpenIncidentRequest : 33554432,
            HoldIncidentRequest : 33554433,
            ReleaseIncidentRequest : 33554434,
            CloseIncidentRequest : 33554435,
            TakeoverIncidentRequest : 33554436,
            NewIncidentSourceRequest : 33554437,
            AssistanceRequiredRequest : 33554438,
            AssistanceNotRequiredRequest : 33554439,
            AssistanceMobilizedRequest : 33554440,
            AssistanceDoneRequest : 33554441,
            AcceptConferencePartyRequest : 33554442,
            HoldConferencePartyRequest : 33554443,
            StartConferencePartyRequest : 33554444,
            CloseConferencePartyRequest : 33554445,
            PersonContactRequest : 33554446,
            CaregiverMobilizedRequest : 33554447,
            CaregiverArrivedRequest : 33554448,
            CaregiverDoneRequest : 33554449,
            AddNoteRequest : 33554450,
            RemoveNoteRequest : 33554451,
            PrintRequest : 33554452,
            EmailRequest : 33554453,
            FaxRequest : 33554454,
            SmsRequest : 33554455,
            AddReminderRequest : 33554456,
            RemoveReminderRequest : 33554457,
            DismissReminderRequest : 33554458,
            NewLoneworkerJobRequest : 33554459,
            ExtendLoneworkerJobRequest : 33554460,
            CancelLoneworkerJobRequest : 33554461,
            DialPhoneNumberRequest : 33554462,
            CancelDialRequest : 33554463,
            GeneralDeviceControl : 50331648,
            OpenDoorControl : 50331649,
            TraceControl : 50331650,
            TrackingControl : 50331651,
            ForcedConnectControl : 50331652,
            CarBlockControl : 50331653,
            ServiceModeControl : 50331654,
            DeviceProgrammingControl : 50331655,
            DeviceReadoutControl : 50331656,
            ForcedCheckControl : 50331657,
            CareTimeoutWarning : 67108864,
            CareRefusedWarning : 67108865,
            BusyContactChannelWarning : 67108866,
            NoAutoCareInfoWarning : 67108867,
            AutoCareOverallTimeoutWarning : 67108868,
            ContactChannelError : 83886080,
            ForceReleaseIncidentSystem : 100663296,
            UserDefinedInfo : 117440512,
            IncidentMemoViewedInfo : 117440513,
            TechnicalEventFollowupInfo : 117440514,
            CaregiverRefusedInfo : 117440515,
            AutoCareStartedInfo : 117440516,
            AutoCareTerminatedInfo : 117440517,
            TraceData : 134217728,
            CaregiverCalledStatus : 150994944,
            CaregiverMobilizedStatus : 150994945,
            CaregiverArrivedStatus : 150994946,
            CaregiverSignedOutStatus : 150994947,
            OperatorRegistration : 167772160,
            OperatorUnregistration : 167772161,
            DeviceConnected : 184549376,
            DeviceDisconnected : 184549377
        };

        model.filterOperator = {
            And: 0,
            Or: 1
        };

        model.filterOperation = {
            InvalidOperation: 0,
            Equals: 1,
            Not: 2,
            Like: 3,
            Greater: 4,
            Smaller: 5,
            NotNULL: 6,
            In: 7,
            IsNULL: 8,
            OnDate: 9,
            StartsWith: 10,
            EndsWith: 11,
            GreaterThanOrEqual: 12,
            LessThanOrEqual: 13
        };

        model.functionValues = {
            Unknown : 0,
            ExternalPhone : 1,
            InternalPhone : 2,
            Operator : 3,
            Email : 4,
            PDA : 5,
            SMS : 6,
            SIP : 7,
            SkypePhone : 8,
            GsmModem : 9,
            UniteMember : 10,
            SmsAssist : 11,
            CareFollowUp : 12,
            Facetime : 13,
            CareApp : 14
            // Note: do not add the ExternalLink values (values 101, 102, etc.) here
        };

        model.genderValues = {
            Unknown: 0,
            Male: 1,
            Female: 2
        };

        model.invoiceAddressTypeValues = {
            Unknown: 0,
            ResidenceAddress: 1,
            DebtorAddress: 2,
            InvoiceAddress: 3
        };

        model.leaseCountCategoryValues = {
            Unknown : 0,
            PersonAlarmAnaloge : 1,
            PersonAlarmAnalogeSIP : 2,
            IPAlarmSIPAudio : 3,
            IPAlarmXMLInterface : 4,
            MobileAlarmTalkMeHome : 5,
            MobileAlarmTrackAndTrace : 6,
            SMSInterface : 7,
            TelemedicineDirect : 8,
            TelemedicineIndirect : 9,
            TelemedicineMedicineMonitoring : 10,
            VideoSIPVideo : 11,
            VideoMonitoring : 12,
            KeySafe : 13,
            DoorSystem : 14,
            NoTax : 15
        };

        model.linkingType = {
            Unknown: 0,
            None: 1,
            Subscriber: 2,
            Residence: 3,
            Scheme: 4,
        };

        model.loginOwningTypeValues = {
            None: 0,
            Operator: 1,
            Caregiver: 2,
            Subscriber: 4,
            Executable: 8
        };

        model.operatingSystemType = {
            Unkown: 0,
            iOS: 1,
            Android: 2,
            WindowsPhone: 3,
            AndroidFcm: 4,
            iOSFcm: 5
        };

        model.pushSubscriptionType = {
            Unknown: 0,
            CareRequests: 1,
            FaceTime: 2
        };

        model.traceEventTypeEnum = {
            Critical: 1,
            Error: 2,
            Warning: 4,
            Information: 8,
            Verbose: 16,
            Start: 256,
            Stop: 512,
            Suspend: 1024,
            Resume: 2048,
            Transfer: 4096
        };

        model.traceSourceType = {
            Unknown : 0,
            Executable : 1,
            Operator : 2,
            Subscriber : 3,
            ProfessionalCaregiver : 4
        }

        model.values = {
            Unknown: 0,
            Low: 1,
            Medium: 2,
            High: 3
        };

        return model;
    });

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AddressFormatTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AddressFormatTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('addressFormatTypeValues', {
			Default : 0,
			UKAddress : 1,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentHandlerStateValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentHandlerStateValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentHandlerStateValues', {
			Unknown : 0,
			Unhandled : 1,
			Succeeded : 2,
			Failed : 3,
			OutOfTime : 4,
			Skipped : 5,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentHandlerValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentHandlerValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentHandlerValues', {
			None : 0,
			AppointmentRemindByAlarm : 1,
			AutoProcExecute : 2,
			AutoAppointmentService_OnBirthday : 3,
			AutoAppointmentService_AfterSubscriberActivation : 5,
			AutoAppointmentService_BeforeReIndicationDate : 7,
			AutoAppointmentService_BeforeWellBeingAppointmentRangeEndDate : 8,
			AutoAppointmentService_OnEndOfAbsencePeriod : 9,
			AutoAppointmentService_OnStartOfAbsencePeriod : 10,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentKindValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentKindValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentKindValues', {
			Unknown : 0,
			Appointment : 1,
			ServiceTask : 2,
			AutoProc : 3,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentRecurrenceDaysOfWeekValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentRecurrenceDaysOfWeekValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentRecurrenceDaysOfWeekValues', {
			None : 0,
			Sunday : 1,
			Monday : 2,
			Tuesday : 4,
			Wednesday : 8,
			Thursday : 16,
			Friday : 32,
			Saturday : 64,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentRecurrenceTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentRecurrenceTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentRecurrenceTypeValues', {
			Daily : 0,
			Weekly : 1,
			Monthly : 2,
			Yearly : 3,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.AppointmentStateValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on AppointmentStateValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('appointmentStateValues', {
			Unknown : 0,
			Planned : 1,
			Unplanned : 2,
			Completed : 3,
			Failed : 4,
			Postponed : 5,
			CompletedAndPostponed : 6,
			FailedAndPostponed : 7,
			Canceled : 8,
			CanceledAndPostponed : 9,
			PlannedAndLocked : 10,
			PostponedAndLocked : 11,
			FailedAndLocked : 12,
			FailedAndPostponedAndLocked : 13,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.CalendarOwnerTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on CalendarOwnerTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('calendarOwnerTypeValues', {
			None : 0,
			Operator : 1,
			Subscriber : 2,
			Technician : 3,
			Role : 4,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.CaregiverTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on CaregiverTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('caregiverTypeValues', {
			Unknown : 0,
			Professional : 1,
			Relational : 2,
			Warden : 4,
			ProfessionalAsRelational : 8,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Contracts.ConferencePartyState.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ConferencePartyState.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('conferencePartyState', {
			Unknown : 0,
			Offline : 1,
			Away : 2,
			DoNotDisturb : 3,
			Connecting : 4,
			Online : 5,
			Holding : 6,
			OnHold : 7,
			Disconnecting : 8,
			Error : 9,
});
		
/* istanbul ignore next */
// This enum is auto-generated from the original enum in DataAccess. When modification is required, please change and build the DataAccess first. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').factory('conferencePartyType',
    function () {
	    'use strict';
		return {              
		      Unknown : 0,
              Operator : 1,
              ProfCareGiver : 2,
              DirectCareGiver : 3,
              Subscriber : 4,
              Technician : 5,
        };
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Contracts.ConferenceState.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ConferenceState.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('conferenceState', {
			Unknown : 0,
			Idle : 1,
			Active : 2,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.ContactItemTypeFunctionValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ContactItemTypeFunctionValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('contactItemTypeFunctionValues', {
			Unknown : 0,
			ExternalPhone : 1,
			InternalPhone : 2,
			Operator : 3,
			Email : 4,
			PDA : 5,
			SMS : 6,
			SIP : 7,
			SkypePhone : 8,
			GsmModem : 9,
			UniteMember : 10,
			SmsAssist : 11,
			CareFollowUp : 12,
			Facetime : 13,
			CareApp : 14,
			ExternalLinkCamera : 101,
			ExternalLinkWeb : 102,
			ExternalLinkMedical : 103,
			ExternalLinkMap : 104,
			ExternalLinkWord : 105,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.ContactItemTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ContactItemTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('contactItemTypeValues', {
			Unknown : 0,
			PhoneNumber : 1,
			EmailAddress : 2,
			Website : 3,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.PersonalizationService.Contracts.CustomValidationType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on CustomValidationType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('customValidationType', {
			Unknown : 0,
			Regex : 1,
			IBAN : 2,
			DNI : 3,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.DayOfWeekValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on DayOfWeekValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('dayOfWeekValues', {
			WholeWeek : 0,
			Sunday : 1,
			Monday : 2,
			Tuesday : 3,
			Wednesday : 4,
			Thursday : 5,
			Friday : 6,
			Saturday : 7,
			Weekdays : 8,
			Weekend : 9,
			Never : 10,
});

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Shared.Dto.DeviceLinkingType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on DeviceLinkingType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('deviceLinkingType', {
			Unknown : 0,
			None : 1,
			Subscriber : 2,
			Residence : 3,
			Scheme : 4,
});

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.DeviceTypeTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on DeviceTypeTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('deviceTypeTypeValues', {
			Unknown : 0,
			DeviceType : 1,
			SimpleDeviceType : 2,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.EventTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on EventTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('eventTypeValues', {
			Unknown : 0,
			NoAlarm : 16777216,
			OperatorStartAlarm : 16777217,
			MainAlarm : 16777316,
			VoiceRemoteAlarm : 16777317,
			PersonalTrigger1Alarm : 16777317,
			PersonalTrigger2Alarm : 16777318,
			PersonalTrigger3Alarm : 16777319,
			PersonalTrigger4Alarm : 16777320,
			PersonalTrigger5Alarm : 16777321,
			PersonalTrigger6Alarm : 16777322,
			PersonalTrigger7Alarm : 16777323,
			PersonalTrigger8Alarm : 16777324,
			PersonalTrigger9Alarm : 16777325,
			PersonalTrigger10Alarm : 16777326,
			MainEndAlarm : 16777326,
			RepeatedCallAlarm : 16777327,
			DoorBellAlarm : 16777328,
			BurglaryDetectionAlarm : 16777329,
			SmokeDetectorAlarm : 16777330,
			LowTemperatureAlarm : 16777331,
			AcousticAlarm : 16777332,
			DoorAlarm : 16777333,
			MedicalAlarmWithVoiceAlarm : 16777334,
			BedAlarm : 16777335,
			AssistanceAlarmWithVoiceAlarm : 16777336,
			KitchenAlarm : 16777337,
			LivingroomAlarm : 16777338,
			HallAlarm : 16777339,
			ToiletAlarm : 16777340,
			SurroundingAlarm : 16777341,
			GasAlarm : 16777342,
			LightFailureAlarm : 16777343,
			FireAlarm : 16777344,
			HeaterFailureAlarm : 16777345,
			VoiceTestAlarm : 16777346,
			PowerFailAlarm : 16777347,
			AbsentAlarm : 16777348,
			PresentAlarm : 16777349,
			PoweronAlarm : 16777350,
			VoicePowerRestoreAlarm : 16777351,
			TamperAlarm : 16777352,
			MaintenanceAlarm : 16777353,
			MovementDetectionAlarm : 16777354,
			SmokeAlarm : 16777355,
			SleepingroomAlarm : 16777356,
			BathroomAlarm : 16777357,
			DiningroomAlarm : 16777358,
			StudyAlarm : 16777359,
			StairsAlarm : 16777360,
			GarageAlarm : 16777361,
			GardenAlarm : 16777362,
			FallDetectorAlarm : 16777363,
			ElevatorAlarm : 16777364,
			GeoFenceAlarm : 16777365,
			InactivitieDetectAlarm : 16777366,
			PeriodicCheckReportAlarm : 16777367,
			FrequentOutOfBedAlarm : 16777368,
			PullCordAlarm : 16777369,
			CareWorkerAbsentVoiceAlarm : 16777370,
			MoistureAlarm : 16777371,
			VoiceRemoteLostAlarm : 16777372,
			GeneralDeviceErrorAlarm : 16777373,
			CoDetectorAlarm : 16777375,
			ServiceReportAlarm : 16777376,
			VoicePowerFaultAlarm : 16777377,
			VoiceRemoteBatteryFaultAlarm : 16777378,
			VoiceBatteryFaultAlarm : 16777379,
			VoiceWardenAttendanceAlarm : 16777380,
			UrgencyAlarm : 16777381,
			ExternalAlarm : 16777382,
			InvalidEndOfAlarm : 16777383,
			VoiceIntruderAlarm : 16777385,
			CareWorkerPresentVoiceAlarm : 16777386,
			VoiceBatteryRestoreAlarm : 16777387,
			CriteriumFaultAlarm : 16777388,
			DeviceCommunicationLostAlarm : 16777389,
			DeviceCommunicationRestoreAlarm : 16777390,
			AssaultAlarm : 16777391,
			PullCordTamperAlarm : 16777392,
			WanderAlarm : 16777393,
			LoneWorkerAlarm : 16777394,
			VoicePanicButtonAlarm : 16777395,
			Error1Alarm : 16777396,
			Error2Alarm : 16777397,
			Error3Alarm : 16777398,
			Error4Alarm : 16777399,
			Error5Alarm : 16777400,
			UnwantedVisitorAlarm : 16777401,
			ReservedAlarm : 16777402,
			NewSubscriberAlarm : 16777403,
			ClosedSubscriberAlarm : 16777404,
			ForgottenMedicationAlarm : 16777405,
			VideoAlarm : 16777406,
			MobileAlarm : 16777407,
			WristbandOffAlarm : 16777408,
			WristbandOnAlarm : 16777409,
			NoActivityAlarm : 16777410,
			WorseningHealthAlarm : 16777411,
			TelephoneAlarm : 16777412,
			TelephoneCallAlarm : 16777413,
			ManualAlarm : 16777414,
			DialAlarm : 16777415,
			OperatorEndAlarm : 16777415,
			LogStartAlarm : 16777416,
			MainAlarmNoVoiceAlarm : 16777416,
			DevicePowerFailAlarm : 16777417,
			TelephoneLineFaultAlarm : 16777418,
			BatteryFaultAlarm : 16777419,
			ExternalBatteryFaultAlarm : 16777420,
			DisconnectAlarm : 16777421,
			LightFailureAlarmNoVoiceAlarm : 16777422,
			FireAlarmNoVoiceAlarm : 16777423,
			HeaterFailureAlarmNoVoiceAlarm : 16777424,
			SystemAlarm : 16777425,
			ProtocolTimeoutAlarm : 16777426,
			DeviceIdErrorAlarm : 16777427,
			AlarmIdErrorAlarm : 16777428,
			IntruderDetectionAlarm : 16777429,
			SmokeDetectorAlarmNoVoiceAlarm : 16777430,
			LowTemperatureAlarmNoVoiceAlarm : 16777431,
			GasAlarmNoVoiceAlarm : 16777432,
			MoistureAlarmNoVoiceAlarm : 16777433,
			ManualAlarmNoVoiceAlarm : 16777434,
			DoorAlarmNoVoiceAlarm : 16777435,
			GeneralInputAlarm : 16777436,
			Input1TestAlarm : 16777437,
			Input2TestAlarm : 16777438,
			Input3TestAlarm : 16777439,
			Input4TestAlarm : 16777440,
			Input5TestAlarm : 16777441,
			Input6TestAlarm : 16777442,
			Input7TestAlarm : 16777443,
			Input8TestAlarm : 16777444,
			Input9TestAlarm : 16777445,
			BedAlarmNoVoiceAlarm : 16777446,
			HeaterAlarmNoVoiceAlarm : 16777447,
			ToiletAlarmNoVoiceAlarm : 16777448,
			KitchenAlarmNoVoiceAlarm : 16777449,
			LivingroomAlarmNoVoiceAlarm : 16777450,
			HallAlarmNoVoiceAlarm : 16777451,
			AbsentAlarmNoVoiceAlarm : 16777452,
			PresentAlarmNoVoiceAlarm : 16777453,
			PoweronAlarmNoVoiceAlarm : 16777454,
			SurroundingAlarmNoVoiceAlarm : 16777455,
			EpilepsyAlarm : 16777456,
			DementiaAlarm : 16777457,
			TestAlarm : 16777458,
			MedicalAlarm : 16777459,
			AssistanceAlarm : 16777461,
			StartInterruptorAlarm : 16777462,
			ExternAlarm : 16777463,
			MaintenanceAlarmNoVoiceAlarm : 16777464,
			MovementAlarm : 16777465,
			DeviceLostAlarm : 16777466,
			DeviceVerifyAlarm : 16777467,
			WatchdogReportAlarm : 16777468,
			SmokeDetectorFailureNoVoiceAlarm : 16777469,
			LocalResetAlarm : 16777470,
			RemoteBatteryFaultAlarm : 16777471,
			RemoteLostAlarm : 16777472,
			InactivitieDetectNoVoiceAlarm : 16777473,
			ServiceReadyAlarm : 16777474,
			RemoteLongDistanceAlarm : 16777475,
			BaseStationLostAlarm : 16777476,
			WardenAttendanceAlarm : 16777477,
			BaseStationErrorAlarm : 16777478,
			LogAlarm : 16777479,
			DeviceCommunicationLostNoVoiceAlarm : 16777480,
			DeviceCommunicationRestoreNoVoiceAlarm : 16777481,
			SmokeDetectorStartupAlarm : 16777482,
			BatteryFullAlarm : 16777483,
			IntruderAlarm : 16777484,
			ErrorInMessageAlarm : 16777485,
			PanicButtonAlarm : 16777486,
			DevicePowerRestoreAlarm : 16777487,
			TelephoneLineRestoreAlarm : 16777488,
			BatteryRestoreAlarm : 16777489,
			DevicePoweronAlarm : 16777490,
			SmokeDetectorRestoreAlarm : 16777491,
			LowTempDetectorRestoreAlarm : 16777492,
			IntruderDetectorRestoreAlarm : 16777493,
			RemoteCommunicationRestoreAlarm : 16777494,
			RemoteFoundAlarm : 16777495,
			SystemError1ReportAlarm : 16777496,
			SystemError2ReportAlarm : 16777497,
			SystemError3ReportAlarm : 16777498,
			SystemError4ReportAlarm : 16777499,
			SystemError5ReportAlarm : 16777500,
			SystemError6ReportAlarm : 16777501,
			SystemError7ReportAlarm : 16777502,
			SystemError8ReportAlarm : 16777503,
			SystemError9ReportAlarm : 16777504,
			SystemError10ReportAlarm : 16777505,
			SystemError11ReportAlarm : 16777506,
			SystemError12ReportAlarm : 16777507,
			SystemError13ReportAlarm : 16777508,
			SystemError14ReportAlarm : 16777509,
			SystemError15ReportAlarm : 16777510,
			SystemError16ReportAlarm : 16777511,
			SystemError17ReportAlarm : 16777512,
			SystemError18ReportAlarm : 16777513,
			SystemError19ReportAlarm : 16777514,
			SystemError20ReportAlarm : 16777515,
			LocationVoiceStartAlarm : 16777516,
			AcousticAlarmNoVoiceAlarm : 16777516,
			FloodDetectorAlarm : 16777517,
			FloodDetectorAlarm2Alarm : 16777518,
			FloodDetectorAlarm3Alarm : 16777519,
			FloodDetectorAlarm4Alarm : 16777520,
			FloodDetectorAlarm5Alarm : 16777521,
			NotToBedAlarm : 16777522,
			NotOutOfBedAlarm : 16777523,
			OutOfBedAlarm : 16777524,
			Sleepingroom1Alarm : 16777525,
			Sleepingroom2Alarm : 16777526,
			RadioOutputModule1Alarm : 16777527,
			RadioOutputModule2Alarm : 16777528,
			RadioOutputModule3Alarm : 16777529,
			RadioOutputModule4Alarm : 16777530,
			Bathroom1Alarm : 16777531,
			Bathroom2Alarm : 16777532,
			ToiletDownstairsAlarm : 16777533,
			ToiletOutsideAlarm : 16777534,
			Kitchen1Alarm : 16777535,
			Kitchen2Alarm : 16777536,
			Livingroom1Alarm : 16777537,
			Livingroom2Alarm : 16777538,
			Garage1Alarm : 16777539,
			Garage2Alarm : 16777540,
			FrontYardAlarm : 16777541,
			BackYardAlarm : 16777542,
			AcousticDetector1Alarm : 16777543,
			AcousticDetector2Alarm : 16777544,
			AcousticDetector3Alarm : 16777545,
			AcousticDetector4Alarm : 16777546,
			AcousticDetector5Alarm : 16777547,
			ExtremeTemperatureDetectorAlarm : 16777548,
			ExtremeTemperatureDetectorLowAlarm : 16777549,
			ExtremeTemperatureDetectorHighAlarm : 16777550,
			PushButtonFallDetectorAlarm : 16777551,
			WanderDetectorAlarm : 16777552,
			FallDetector2Alarm : 16777553,
			SensorFailureAlarm : 16777554,
			SensorLifetimeExpiredAlarm : 16777555,
			Epilepsy2Alarm : 16777556,
			HeartProblemsAlarm : 16777557,
			SupervisorOnLocationAlarm : 16777558,
			PersonDownAlarm : 16777559,
			TemperatureLowAlarm : 16777560,
			TemperatureRisingAlarm : 16777561,
			BedInuseAlarm : 16777562,
			ChairInUseAlarm : 16777563,
			BathroomInUseAlarm : 16777564,
			PremisesInUseAlarm : 16777565,
			SupervisorLeftLocationAlarm : 16777566,
			ChairAbandonedAlarm : 16777567,
			BedLevelAlarm : 16777568,
			SystemTestModeAlarm : 16777569,
			AnounceBatteryFailAlarm : 16777571,
			InBatteryLoaderAlarm : 16777576,
			RemovedFromBatteryLoaderAlarm : 16777577,
			DoorLeftOpenAlarm : 16777578,
			BackupDeviceCommunicationLostNoVoiceAlarm : 16777580,
			BackupDeviceCommunicationRestoreNoVoiceAlarm : 16777581,
			WelfareAcknowledgeAlarm : 16777586,
			ParkinsonAlarm : 16777592,
			OutsideGeoFenceAreaAlarm : 16777596,
			InsideGeoFenceAreaAlarm : 16777597,
			OutsideGeoFenceAreaReportAlarm : 16777598,
			InsideGeoFenceAreaReportAlarm : 16777599,
			PeriodicMessageNotAcknowledgedAlarm : 16777600,
			PeriodicMessageAcknowledgedAlarm : 16777601,
			AlarmunitNoRFdevicesAlarm : 16777604,
			ExternalAlarmRestoredAlarm : 16777605,
			AlarmRecoveredAlarm : 16777615,
			LocationVoiceEndAlarm : 16777615,
			HomeUnitOkAlarm : 16777616,
			SubscriberOkAlarm : 16777617,
			PanicRestoreAlarm : 16777618,
			BatteryFaultyAlarm : 16777619,
			ReminderAlarm : 16777620,
			PreviousSessionCommunicationErrorAlarm : 16777621,
			IncontinenceAlarm : 16777622,
			FallDetectionOnAlarm : 16777623,
			FallDetectionOffAlarm : 16777624,
			DevicePowerdownAlarm : 16777625,
			SimulatedAlarm : 16777626,
			RepeatedCallNoVoiceAlarm : 16777627,
			IncommingCallAlarm : 16777628,
			IntruderAlarmOnAlarm : 16777629,
			IntruderAlarmOffAlarm : 16777630,
			TeleMedicineAlarm : 16777631,
			AcknowledgementAlarm : 16777632,
			TeleMedicineErrorAlarm : 16777633,
			TelemedicineAlarm : 16777634,
			Movement2Alarm : 16777635,
			BadMeasurementDataAlarm : 16777636,
			BraceletOnAlarm : 16777637,
			BraceletOffAlarm : 16777638,
			BloodPressureHighAlarm : 16777639,
			PulseAlarm : 16777640,
			BodyTemperatureAlarm : 16777641,
			TelemedicineCancledAlarm : 16777642,
			TelemedicineTimeoutAlarm : 16777643,
			ServiceAlarm : 16777645,
			TeleMedicineTresholdAlarm : 16777646,
			TeleMedicineCriticalAlarm : 16777646,
			DeviceResetAlarm : 16777647,
			AlarmZoneShortedAlarm : 16777648,
			FalseAlarm : 16777649,
			DeviceRegisteredAlarm : 16777650,
			AlarmDeactivatedAlarm : 16777651,
			CareWorkerAbsentNoVoiceAlarm : 16777652,
			CareWorkerPresentNoVoiceAlarm : 16777653,
			CareWorkerMobilizedNoVoiceAlarm : 16777654,
			ActivityMonitorOnAlarm : 16777655,
			ActivityMonitorOffAlarm : 16777656,
			RadioRestoreAlarm : 16777657,
			ActionInformationAlarm : 16777658,
			NurseCallAlarm : 16777659,
			DoorMatAlarm : 16777660,
			TamperRestoreAlarm : 16777661,
			TamperNoVoiceAlarm : 16777662,
			FallDetectorNoVoiceAlarm : 16777663,
			CareWorkerRefusedNoVoiceAlarm : 16777664,
			GeoFenceAlarmNoVoiceAlarm : 16777665,
			GeoFenceReportAlarm : 16777666,
			ResetInactivityAlarm : 16777667,
			TransmitterOutOfRangeAlarm : 16777668,
			TransmitterInRangeAlarm : 16777669,
			RemoteBatteryRestoreAlarm : 16777670,
			NoAlarmAlarm : 16777671,
			RadioFailureAlarm : 16777672,
			CareworkerDoneAutomaticallyAlarm : 16777673,
			SmokeDetectorBatteryLowAlarm : 16777674,
			TransmitterLongRangeAlarm : 16777675,
			PositionUpdateAlarm : 16777676,
			PositionRequestByPhoneAlarm : 16777677,
			PositionRequestBySmsAlarm : 16777678,
			TraceOnAlarm : 16777679,
			TraceOffAlarm : 16777680,
			PositionUpdateRegistrationAlarm : 16777681,
			PositionRequestByPhoneRegistrationAlarm : 16777682,
			PositionRequestBySmsRegistrationAlarm : 16777683,
			TraceOnRegistrationAlarm : 16777684,
			TraceOffRegistrationAlarm : 16777685,
			DoorOpenRequestAlarm : 16777686,
			DoorOpenCommandAlarm : 16777687,
			PinVerifyRequestAlarm : 16777688,
			SerialNumberInputAlarm : 16777689,
			IgnitionAlarm : 16777690,
			StatusAlarmInputAlarm : 16777691,
			SpeedViolationAlarm : 16777692,
			KeyCodeRequestAlarm : 16777693,
			KeyCodeChangeAlarm : 16777694,
			UnrequestedDataAlarm : 16777695,
			MedicationAlarm : 16777696,
			MedicationTakenAlarm : 16777697,
			MedicationNotTakenAlarm : 16777698,
			NewTrayAlarm : 16777699,
			OnlineAlarm : 16777700,
			NoSchematicAlarm : 16777701,
			UnknownMessageAlarm : 16777702,
			TimePeriodExpiredAlarm : 16777703,
			WrongTemperatureAlarm : 16777706,
			FlatBatteryAlarm : 16777707,
			KidnapAlarm : 16777708,
			CarJackAlarm : 16777709,
			CollisionAlarm : 16777710,
			AssistanceRequestAlarm : 16777711,
			TrailerUncoupledAlarm : 16777712,
			TrailerUncoupledRestoreAlarm : 16777713,
			EmergencyStopAlarm : 16777714,
			EmergencyStopRestoreAlarm : 16777715,
			IncontinenceBatteryLowAlarm : 16777716,
			NotInBedDetectorBatteryLowAlarm : 16777717,
			NotOutOfBedDetectorBatteryLowAlarm : 16777718,
			OutOfBedDetectorBatteryLowAlarm : 16777719,
			BatteryLoadingAlarm : 16777720,
			SimReplacedAlarm : 16777721,
			CriteriaNotSupportedAlarm : 16777722,
			ChargingInterruptedAlarm : 16777723,
			ProgramModeEntryAlarm : 16777734,
			ProgramModeExitAlarm : 16777735,
			DownloadStartAlarm : 16777736,
			TimeDateResetAlarm : 16777737,
			GasDetectionRestoreAlarm : 16777738,
			WellbeingDialoutAlarm : 16777743,
			TeleMedicineWarningAlarm : 16777746,
			InactivityRestoredAlarm : 16777765,
			DeviceRestoredAlarm : 16777766,
			DeviceResultAlarm : 16777767,
			Test2Alarm : 16777771,
			NetworkConnectionErrorAlarm : 16777775,
			NetworkConnectionRestoredAlarm : 16777776,
			GSMNetworkerrorAlarm : 16777778,
			GSMNetworkRestoredAlarm : 16777779,
			UnknownMeaningFirstAlarm : 16777816,
			UnknownMeaningLastAlarm : 16777915,
			AdministrationAlarm : 16777916,
			SubAlarm : 16777917,
			LoneWorkerJobAlarm : 16777918,
			ManualDeviceVerifyAlarm : 16777919,
			PortStatusAlarm : 16778016,
			ProgrammingSuccesfullAlarm : 16778017,
			NoSystemAcknowledgeReceivedAlarm : 16778018,
			LogEndAlarm : 16778115,
			InternalStartAlarm : 16778116,
			InterfaceTimedoutAlarm : 16778116,
			SystemPowerFailAlarm : 16778117,
			SystemPowerRestoreAlarm : 16778118,
			LineFaultAlarm : 16778119,
			LineRestoreAlarm : 16778120,
			asBatteryFaultAlarm : 16778121,
			asBatteryRestoredAlarm : 16778122,
			BridgeStopAlarm : 16778123,
			BridgeStartAlarm : 16778124,
			LocalDiskAlarm : 16778125,
			ExceptionAlarm : 16778126,
			NetworkAlarm : 16778127,
			TransactionErrAlarm : 16778128,
			LogFileCopyAlarm : 16778129,
			TransactionOkAlarm : 16778130,
			CardLostAlarm : 16778131,
			CardFoundAlarm : 16778132,
			CardApplicErrAlarm : 16778133,
			CleanupFailAlarm : 16778134,
			AutoProcessFailAlarm : 16778135,
			ServiceFaultAlarm : 16778136,
			ServiceRestoreAlarm : 16778137,
			AudioNetworkFailAlarm : 16778138,
			AudioNetworkRestoreAlarm : 16778139,
			AudioRecorderLostAlarm : 16778140,
			DuplicateLocationAlarm : 16778141,
			DatabaseBackFailAlarm : 16778142,
			AutoCloseAddedAlarm : 16778143,
			AutoCloseRemovedAlarm : 16778144,
			LoopBackRestoreAlarm : 16778145,
			SmsModemLostAlarm : 16778146,
			SmsModemRestoreAlarm : 16778147,
			UmoTestAlarm : 16778148,
			LoopBackFailAlarm : 16778149,
			SmsModemNetworkLostAlarm : 16778150,
			SmsModemNetworkRestoreAlarm : 16778151,
			SmsModemSimNotInsertAlarm : 16778152,
			SmsModemSimRestoreAlarm : 16778153,
			UnknownSmsReceivedAlarm : 16778154,
			AutoCloseStartedAlarm : 16778155,
			CPUUsageLimitAlarm : 16778156,
			DiskUsageLimitAlarm : 16778157,
			MemoryUsageLimitAlarm : 16778158,
			AudioRecorderFailureAlarm : 16778159,
			ServiceModeStartAlarm : 16778160,
			ServiceModeStopAlarm : 16778161,
			UmoEscapeWarningAlarm : 16778162,
			BackupAlarm : 16778163,
			SwitchToStandbyAlarm : 16778164,
			SwitchToActiveAlarm : 16778165,
			ForcedCheckDoneAlarm : 16778166,
			LoopbackTestAlarm : 16778167,
			DialinWhileDialoutAlarm : 16778168,
			InterfaceHardwareErrorAlarm : 16778169,
			VoicemailWarningAlarm : 16778170,
			CardDisconnectAlarm : 16778171,
			CardWatchdogAlarm : 16778172,
			GuardProtocolAlarm : 16778173,
			CardConflictAlarm : 16778174,
			ReplicationErrorAlarm : 16778175,
			ProtocolErrorMinAlarm : 16778176,
			ProtocolErrorAlarm : 16778176,
			ProtocolError1Alarm : 16778177,
			ProtocolError2Alarm : 16778178,
			ProtocolError3Alarm : 16778179,
			ProtocolError4Alarm : 16778180,
			ProtocolError5Alarm : 16778181,
			ProtocolError6Alarm : 16778182,
			ProtocolError7Alarm : 16778183,
			ProtocolError8Alarm : 16778184,
			ProtocolError9Alarm : 16778185,
			ProtocolErrorMaxAlarm : 16778185,
			NetworkCommunicationRestoreAlarm : 16778186,
			NetworkCommunicationTimeoutAlarm : 16778187,
			NetworkCommunicationErrorAlarm : 16778189,
			ExternalServiceCommunicationLostAlarm : 16778190,
			ExternalServiceCommunicationRestoreAlarm : 16778191,
			DataExportSucceededAlarm : 16778192,
			DataExportRepeatedAttemptAlarm : 16778193,
			DataExportFailedAlarm : 16778194,
			ForcedProcessDbDisconnectAlarm : 16778195,
			SmsModemRoamingAlarm : 16778196,
			IncompleteAlarm : 16778206,
			UmoTest2Alarm : 16778210,
			WatchdogAlarm : 16778211,
			AlarmConflictAlarm : 16778212,
			AlarmLostAlarm : 16778213,
			AlarmCleanedAlarm : 16778214,
			CriteriumErrorAlarm : 16778215,
			InternalEndAlarm : 16778215,
			AutoCriteriumAlarm : 16778216,
			AutoCriteriumStartAlarm : 16778217,
			AutoCriteriumEndAlarm : 16779215,
			EventCriteriumStartAlarm : 16779216,
			EventCriteriumEndAlarm : 16780215,
			MaxCriteriumAlarm : 16780216,
			OpenIncidentRequest : 33554432,
			HoldIncidentRequest : 33554433,
			ReleaseIncidentRequest : 33554434,
			CloseIncidentRequest : 33554435,
			TakeoverIncidentRequest : 33554436,
			NewIncidentSourceRequest : 33554437,
			AssistanceRequiredRequest : 33554438,
			AssistanceNotRequiredRequest : 33554439,
			AssistanceMobilizedRequest : 33554440,
			AssistanceDoneRequest : 33554441,
			AcceptConferencePartyRequest : 33554442,
			HoldConferencePartyRequest : 33554443,
			StartConferencePartyRequest : 33554444,
			CloseConferencePartyRequest : 33554445,
			PersonContactRequest : 33554446,
			CaregiverMobilizedRequest : 33554447,
			CaregiverArrivedRequest : 33554448,
			CaregiverDoneRequest : 33554449,
			AddNoteRequest : 33554450,
			RemoveNoteRequest : 33554451,
			PrintRequest : 33554452,
			EmailRequest : 33554453,
			FaxRequest : 33554454,
			SmsRequest : 33554455,
			AddReminderRequest : 33554456,
			RemoveReminderRequest : 33554457,
			DismissReminderRequest : 33554458,
			NewLoneworkerJobRequest : 33554459,
			ExtendLoneworkerJobRequest : 33554460,
			CancelLoneworkerJobRequest : 33554461,
			DialPhoneNumberRequest : 33554462,
			CancelDialRequest : 33554463,
			CloseConferenceRequest : 33554464,
			CloseIncidentToFollowUpRequest : 33554465,
			ResetDeviceTimeoutRequest : 33554466,
			OperatorListenSpeechModeRequest : 33554467,
			OperatorSpeakSpeechModeRequest : 33554468,
			OperatorFullDuplexSpeechModeRequest : 33554469,
			OperatorVolumeUpRequest : 33554470,
			OperatorVolumeDownRequest : 33554471,
			DeviceControl : 50331648,
			OpenDoorControl : 50331649,
			TraceControl : 50331650,
			TrackingControl : 50331651,
			ForceConnectControl : 50331652,
			CarBlockControl : 50331653,
			ServiceModeControl : 50331654,
			DeviceProgrammingControl : 50331655,
			DeviceReadoutControl : 50331656,
			ForceCheckControl : 50331657,
			CareTimeoutWarning : 67108864,
			CareRefusedWarning : 67108865,
			BusyContactChannelWarning : 67108866,
			NoAutoCareInfoWarning : 67108867,
			AutoCareOverallTimeoutWarning : 67108868,
			ContactChannelError : 83886080,
			ForceReleaseIncidentSystem : 100663296,
			UpdateIncidentSystem : 100663297,
			UpdateConferenceSystem : 100663298,
			UserDefinedInfo : 117440512,
			IncidentMemoViewedInfo : 117440513,
			TechnicalEventFollowupInfo : 117440514,
			CaregiverRefusedInfo : 117440515,
			AutoCareStartedInfo : 117440516,
			AutoCareTerminatedInfo : 117440517,
			TraceData : 134217728,
			CaregiverCalledStatus : 150994944,
			CaregiverMobilizedStatus : 150994945,
			CaregiverArrivedStatus : 150994946,
			CaregiverSignedOutStatus : 150994947,
			OperatorRegistration : 167772160,
			OperatorUnregistration : 167772161,
			OperatorSkillsSelection : 167772162,
			DeviceConnected : 184549376,
			DeviceDisconnected : 184549377,
});

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.GenderValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on GenderValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('genderValues', {
			Unknown : 0,
			Male : 1,
			Female : 2,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Contracts.IdentityOwnerType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on IdentityOwnerType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('identityOwnerType', {
			None : 0,
			Caregiver : 1,
			DeviceManager : 2,
			Operator : 4,
			Subscriber : 8,
			Debtor : 16,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.IncidentStateValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on IncidentStateValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('incidentStateValues', {
			Unknown : 0,
			Free : 1,
			Inuse : 2,
			Closed : 3,
			New : 4,
			FollowUp : 5,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.InvoiceAddressTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on InvoiceAddressTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('invoiceAddressTypeValues', {
			Unknown : 0,
			ResidenceAddress : 1,
			DebtorAddress : 2,
			InvoiceAddress : 3,
});
		

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.LeaseCountCategoryValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on LeaseCountCategoryValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('leaseCountCategoryValues', {
			Unknown : 0,
			PersonAlarmAnaloge : 1,
			PersonAlarmAnalogeSIP : 2,
			IPAlarmSIPAudio : 3,
			IPAlarmXMLInterface : 4,
			MobileAlarmTalkMeHome : 5,
			MobileAlarmTrackAndTrace : 6,
			SMSInterface : 7,
			TelemedicineDirect : 8,
			TelemedicineIndirect : 9,
			TelemedicineMedicineMonitoring : 10,
			VideoSIPVideo : 11,
			VideoMonitoring : 12,
			KeySafe : 13,
			DoorSystem : 14,
			NoTax : 15,
});
		

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.LoginOwningTypeValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on LoginOwningTypeValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('loginOwningTypeValues', {
			None : 0,
			Operator : 1,
			Caregiver : 2,
			Subscriber : 4,
			Executable : 8,
			Warden : 16,
			Technician : 32,
});
		

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.OperatorGateway.Contracts.OperatorMessageType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on OperatorMessageType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('operatorMessageType', {
			None : 0,
			OperatorRequest : 1,
			OperatorResult : 2,
			IncidentUpdateNotification : 3,
			ConferenceUpdateNotification : 4,
			ConferenceUpdateRequest : 5,
			ConferenceUpdateResult : 6,
			ConferencesNotification : 7,
			Alive : 8,
			OperatorActionsUnavailable : 9,
			OperatorActionsAvailable : 10,
			PositionInfoNotification : 11,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Shared.Dto.Enums.PersonalizationContexts.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on PersonalizationContexts.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('personalizationContexts', {
			DevicesInClientInfo : 0,
			SubscribersInClientInfo : 1,
			SubscriberWizardInClientInfo : 2,
			ResidencesInClientInfo : 3,
			SchemesInClientInfo : 4,
			IncidentsInClientInfo : 5,
			ProfessionalCaregiversInClientInfo : 6,
			RelationalCaregiversInClientInfo : 7,
			DeviceWizardInClientInfoConfiguration : 8,
			ProfessionalAsRelationalCaregiversInClientInfo : 9,
			SubscriberWizardInIntakerApp : 10,
			ResidenceWizardInClientInfoConfiguration : 11,
			RelationalCaregiverWizardInClientInfoConfiguration : 12,
			ProfessionalCaregiverWizardInClientInfoConfiguration : 13,
			SchemeWizardInClientInfoConfiguration : 14,
			LoginsInSystemInfo : 15,
			TraceLogsInSystemInfo : 16,
			ReportsInSystemInfo : 17,
			ReportsWizardInSystemInfo : 18,
			UsersInSystemInfo : 19,
			OperatorsInSystemInfo : 20,
			OperatorsWizardInSystemInfo : 21,
			RelationalCaregiverWizardInClientInfoConfigurationWithoutNotesTab : 22,
			TemplateDevicesInClientInfo : 23,
			TemplateDeviceWizardInClientInfoConfiguration : 24,
			CaregiverGroupsInClientInfo : 25,
			CaregiverGroupWizardInClientInfoConfiguration : 26,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Shared.Dto.Enums.FieldType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on FieldType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('fieldType', {
			Unknown : 0,
			Text : 1,
			Date : 2,
			DateTime : 3,
			Password : 4,
			Number : 5,
			Textarea : 6,
			Checkbox : 7,
			DeviceCodeMask : 8,
			Email : 9,
			SelectOrganizationLevel1 : 10,
			SelectDeviceLinkingType : 11,
			SelectDeviceType : 12,
			SelectDeviceManager : 13,
			SelectDeviceState : 14,
			SelectDeviceReadyForPlacementState : 15,
			SelectGender : 16,
			SelectTitle : 17,
			SelectSalutation : 18,
			SelectLanguage : 19,
			SelectSubscriberState : 20,
			SelectMaritalState : 21,
			SelectPointOfEntry : 22,
			SelectResidenceType : 23,
			SelectCity : 24,
			SelectCountry : 25,
			SelectRegion : 26,
			SelectAspect : 27,
			SelectAspectValue : 28,
			SelectOrganizationLevel1AndBelow : 29,
			SelectTemplate : 30,
			SelectContactItemType : 31,
			SelectMedicine : 32,
			SelectMedicationPriority : 33,
			SelectMedicalCondition : 34,
			SelectMedicalConditionValue : 35,
			SelectMedicalPriority : 36,
			SelectCaregiverCategory : 37,
			SelectCaregiverType : 38,
			SelectConsumerState : 39,
			SelectPaymentMethod : 40,
			SelectInsurer : 41,
			SelectTerminationReason : 42,
			SelectTariff : 43,
			SelectDistrict : 44,
			SelectKeyLocation : 45,
			SelectNonPeriodicalCostForTariffId : 46,
			SelectPeriodicalCostForTariffId : 47,
			SelectLinkAsType : 48,
			SelectRelationType : 49,
			SelectLinkingOfDevice : 50,
			SelectSkill : 51,
			SelectSelectableCity : 52,
			SelectConsumerGroup : 53,
			SelectAbsenceReason : 54,
			SelectProject : 55,
			SelectProjectDetail : 56,
			SelectSecurityType : 57,
			SelectEventSourceType : 58,
			SelectTraceType : 59,
			SelectReportEntityType : 60,
			SelectReportType : 61,
			SelectOrganization : 62,
			SelectRoles : 63,
			SelectImage : 64,
			Time : 65,
			SelectCallbackAppointmentType : 66,
			SelectLanguageNonSelectable : 67,
			SelectPostalCodeAPI : 68,
			SelectNullableBoolean : 69,
			SelectExternalWebLinkType : 70,
			SelectModule : 71,
			SelectScheme : 72,
			SelectDeviceControl : 73,
			SelectDoctorReference : 74,
			SelectInsuranceClass : 75,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.PersonalizationService.Contracts.Enums.PersonalizationGridContexts.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on PersonalizationGridContexts.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('personalizationGridContexts', {
			AlarmpostWebActive : 0,
			AlarmpostWebFollowUp : 1,
			AlarmpostWebGeneralHistory : 2,
			AlarmpostWebClientHistory : 3,
			AlarmpostWebSchemeHistory : 4,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Shared.Dto.Enums.PersonalizationPanels.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on PersonalizationPanels.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('personalizationPanels', {
			DevicePanel : 0,
			SubscriberPanel : 1,
			ResidencePanel : 2,
			SchemePanel : 3,
			IncidentPanel : 4,
			CaregiverPanel : 5,
			SelectPanel : 6,
			FinancialPanel : 7,
			MedicalPanel : 8,
			MedicationPanel : 9,
			LoginPanel : 10,
			TraceLogPanel : 11,
			ReportPanel : 12,
			UserPanel : 13,
			OperatorPanel : 14,
			TemplateDevicePanel : 15,
			CaregiverGroupPanel : 16,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Shared.Dto.Enums.PersonalizationTabs.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on PersonalizationTabs.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('personalizationTabs', {
			DeviceTab : 0,
			SubscriberTab : 1,
			ResidenceTab : 2,
			SchemeTab : 3,
			IncidentTab : 4,
			CaregiverTab : 5,
			FinancialTab : 6,
			MedicalTab : 7,
			MedicationTab : 8,
			SelectTab : 9,
			ContactItemsTab : 10,
			AvailabilityTab : 11,
			CharacteristicsTab : 12,
			NotesTab : 13,
			AuditTrailTab : 14,
			StateHistoryTab : 15,
			SubscriberPartnersTab : 16,
			TestCallingTab : 17,
			EventsTab : 18,
			OperatorActionsTab : 19,
			CaregiverActionsTab : 20,
			LoginTab : 21,
			TraceLogTab : 22,
			ReportTab : 23,
			OrganizationReportTab : 24,
			UserTab : 25,
			OperatorTab : 26,
			SecurityTab : 27,
			UserApprovalTab : 28,
			UserLockTab : 29,
			UserPasswordTab : 30,
			UserRolesTab : 31,
			OperatorApprovalTab : 32,
			OperatorLockTab : 33,
			OperatorPasswordTab : 34,
			OperatorRolesTab : 35,
			SubscriberWebLinksTab : 36,
			HolidayTab : 37,
			DeviceControlTab : 38,
			TemplateDeviceTab : 39,
			AlarmCallTab : 40,
			CaregiverGroupTab : 41,
			GroupMembersTab : 42,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.ResidenceManagementService.Contracts.PostalCode.PostalCodeValidationResult.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on PostalCodeValidationResult.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('postalCodeValidationResult', {
			UnknownResult : 0,
			Valid : 1,
			ProvinceUnknown : 2,
			CityUnknownInProvince : 3,
			PostalCodeUnknown : 4,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Services.Contracts.ResultCodes.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ResultCodes.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('resultCodes', {
			None : 0,
			InProgress : 100,
			Success : 200,
			GeneralError : 500,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Security.UserManagementService.Contracts.RoleLimitationsForDeletingValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on RoleLimitationsForDeletingValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('roleLimitationsForDeletingValues', {
			None : 0,
			IsDefault : 1,
			HasUsersWithRole : 2,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Common.Domain.ServiceTaskStateValues.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on ServiceTaskStateValues.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('serviceTaskStateValues', {
			Unknown : 0,
			NotAssigned : 1,
			Assigned : 2,
			Planned : 3,
			Finished : 4,
});
		

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.OperatorGateway.Contracts.SystemActionRequestType.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on SystemActionRequestType.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('systemActionRequestType', {
			None : 0,
			ReRegister : 1,
});
		

/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.OperatorGateway.Contracts.SystemStatusTypes.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on SystemStatusTypes.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('systemStatusTypes', {
			Healthy : 0,
			LegacyUnavailable : 1,
			IncidentProcessorUnavailable : 2,
			ConferenceManagerUnavailable : 3,
			RouterUnavailable : 4,
			Unknown : -1,
});
		
/* istanbul ignore next */
// This javaScript Angular 'enum' factory is auto-generated from the original enum Verklizan.UmoX.Security.Task.
// When modification is required, please change and build original enum first then 'Run Custom Tool' on Task.tt in Utilities.CodeGeneration. 
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain.enums').constant('task', {
			Unknown : 0,
			AbsenceReason_Create : 1,
			AbsenceReason_Read : 2,
			AbsenceReason_Update : 3,
			AbsenceReason_Delete : 4,
			Any_User_Update : 5,
			AgreementType_Create : 6,
			AgreementType_Read : 7,
			AgreementType_Update : 8,
			AgreementType_Delete : 9,
			Appointment_Create : 10,
			Appointment_Read : 11,
			Appointment_Update : 12,
			Appointment_Delete : 13,
			AppointmentType_Create : 14,
			AppointmentType_Read : 15,
			AppointmentType_Update : 16,
			AppointmentType_Delete : 17,
			Aspect_Create : 18,
			Aspect_Read : 19,
			Aspect_Update : 20,
			Aspect_Delete : 21,
			AspectValue_Create : 22,
			AspectValue_Read : 23,
			AspectValue_Update : 24,
			AspectValue_Delete : 25,
			Audit_Read : 26,
			Audit_Read_AccountabilityInfo : 27,
			AutoAppointmentServiceSetting_Read : 28,
			AutoAppointmentServiceSetting_Update : 29,
			AvailableReport_Create : 30,
			AvailableReport_Read : 31,
			AvailableReport_Update : 32,
			AvailableReport_Delete : 33,
			Caregiver_Read : 34,
			CaregiverGroup_Create : 35,
			CaregiverGroup_Read : 36,
			CaregiverGroup_Update : 37,
			CaregiverGroup_Delete : 38,
			CaregiverLink_Create : 39,
			CaregiverLink_Read : 40,
			CaregiverLink_Update : 41,
			CaregiverLink_Delete : 42,
			CaregiverType_Create : 43,
			CaregiverType_Read : 44,
			CaregiverType_Update : 45,
			CaregiverType_Delete : 46,
			CareRequest_Read : 47,
			CareRequest_Update : 48,
			CareRequest_Subscription : 49,
			City_Create : 50,
			City_Read : 51,
			City_Update : 52,
			City_Delete : 53,
			ClientDocument_Create : 54,
			ClientDocument_Read : 55,
			ClientDocument_Update : 56,
			ClientDocument_Delete : 57,
			CoInhabitantType_Create : 58,
			CoInhabitantType_Read : 59,
			CoInhabitantType_Update : 60,
			CoInhabitantType_Delete : 61,
			Company_Create : 62,
			Company_Read : 63,
			Company_Update : 64,
			Company_Delete : 65,
			ConsumerGroup_Create : 66,
			ConsumerGroup_Read : 67,
			ConsumerGroup_Update : 68,
			ConsumerGroup_Delete : 69,
			ConsumerState_Create : 70,
			ConsumerState_Read : 71,
			ConsumerState_Update : 72,
			ConsumerState_Delete : 73,
			ContactItemType_Create : 74,
			ContactItemType_Read : 75,
			ContactItemType_Update : 76,
			ContactItemType_Delete : 77,
			Contract_Create : 78,
			Contract_Read : 79,
			Contract_Update : 80,
			Contract_Delete : 81,
			ContractDocument_Create : 82,
			ContractDocument_Read : 83,
			ContractDocument_Update : 84,
			ContractDocument_Delete : 85,
			ContractHash_Create : 86,
			ContractHash_Read : 87,
			ContractHash_Update : 88,
			ContractHash_Delete : 89,
			Country_Create : 90,
			Country_Read : 91,
			Country_Update : 92,
			Country_Delete : 93,
			CurrentUser_Read : 94,
			DataApi_Subscriber_Read : 95,
			DataApi_Device_Read : 96,
			DataApi_Incident_Read : 97,
			DataApi_Caregiver_Read : 98,
			Debtor_Create : 99,
			Debtor_Read : 100,
			Debtor_Update : 101,
			Debtor_Delete : 102,
			Device_Create : 103,
			Device_Read : 104,
			Device_Update : 105,
			Device_Delete : 106,
			Device_Read_CompanyZero : 107,
			DeviceControl_Create : 108,
			DeviceControl_Read : 109,
			DeviceControl_Update : 110,
			DeviceControl_Delete : 111,
			DeviceManagementSetting_Read : 112,
			DeviceManager_Create : 113,
			DeviceManager_Read : 114,
			DeviceManager_Update : 115,
			DeviceManager_Delete : 116,
			DeviceType_Create : 117,
			DeviceType_Read : 118,
			DeviceType_Update : 119,
			DeviceType_Delete : 120,
			DeviceState_Create : 121,
			DeviceState_Read : 122,
			DeviceState_Update : 123,
			DeviceState_Delete : 124,
			DebugService_ApplicationList_Read : 125,
			DebugService_CreateTraceLog : 126,
			DebugService_CreateTraceLogSL : 127,
			DebugService_ExtendSubscription : 128,
			DebugService_ReadTraceLogPage : 129,
			DebugService_ReadLoginTrailPage : 130,
			DebugService_Subscribe : 131,
			DebugService_TraceLevel_Update : 132,
			DebugService_UnSubscribe : 133,
			District_Create : 134,
			District_Read : 135,
			District_Update : 136,
			District_Delete : 137,
			DoctorReference_Create : 138,
			DoctorReference_Read : 139,
			DoctorReference_Update : 140,
			DoctorReference_Delete : 141,
			EmailService_SendMail : 142,
			EmailService_SendMailWithAttachment : 143,
			EmailService_SendMailTemplated : 144,
			Event_Create : 145,
			Event_Read : 146,
			Event_Update : 147,
			Event_Delete : 148,
			EventAspect_Create : 149,
			EventAspect_Read : 150,
			EventAspect_Update : 151,
			EventAspect_Delete : 152,
			EventAspectCategory_Create : 153,
			EventAspectCategory_Read : 154,
			EventAspectCategory_Update : 155,
			EventAspectCategory_Delete : 156,
			EventAspectValue_Create : 157,
			EventAspectValue_Read : 158,
			EventAspectValue_Update : 159,
			EventAspectValue_Delete : 160,
			EventPriority_Create : 161,
			EventPriority_Read : 162,
			EventPriority_Update : 163,
			EventPriority_Delete : 164,
			EventProcedure_Create : 165,
			EventProcedure_Read : 166,
			EventProcedure_Update : 167,
			EventProcedure_Delete : 168,
			EventType_Create : 169,
			EventType_Read : 170,
			EventType_Update : 171,
			EventType_Delete : 172,
			EventType_AlarmCalls_Read : 173,
			EventType_SystemCalls_Read : 174,
			EventType_CallCentreCalls_Read : 175,
			EventType_CrmIncidents_Read : 176,
			ExternalWebLinkType_Read : 177,
			GeneralDocument_Create : 178,
			GeneralDocument_Read : 179,
			GeneralDocument_Update : 180,
			GeneralDocument_Delete : 181,
			GeneralSetting_Read : 182,
			GeneralSetting_Update : 183,
			IncidentAndConference_Handling : 184,
			Incident_Create : 185,
			Incident_Read : 186,
			Incident_Update : 187,
			Incident_Delete : 188,
			IncidentKind_Create : 189,
			IncidentKind_Read : 190,
			IncidentKind_Update : 191,
			IncidentKind_Delete : 192,
			IncidentPriority_Create : 193,
			IncidentPriority_Read : 194,
			IncidentPriority_Update : 195,
			IncidentPriority_Delete : 196,
			Insurer_Create : 197,
			Insurer_Read : 198,
			Insurer_Update : 199,
			Insurer_Delete : 200,
			InsuranceClass_Create : 201,
			InsuranceClass_Read : 202,
			InsuranceClass_Update : 203,
			InsuranceClass_Delete : 204,
			InvoiceMethod_Create : 205,
			InvoiceMethod_Read : 206,
			InvoiceMethod_Update : 207,
			InvoiceMethod_Delete : 208,
			KeyLocation_Create : 209,
			KeyLocation_Read : 210,
			KeyLocation_Update : 211,
			KeyLocation_Delete : 212,
			Language_Create : 213,
			Language_Read : 214,
			Language_Update : 215,
			Language_Delete : 216,
			License_Read : 217,
			Manage_WcfService : 218,
			Manage_ServiceInfo_Read : 219,
			Manage_ServiceInfo_Update : 220,
			MaritalState_Create : 221,
			MaritalState_Read : 222,
			MaritalState_Update : 223,
			MaritalState_Delete : 224,
			MedicalCondition_Create : 225,
			MedicalCondition_Read : 226,
			MedicalCondition_Update : 227,
			MedicalCondition_Delete : 228,
			MedicalConditionValue_Create : 229,
			MedicalConditionValue_Read : 230,
			MedicalConditionValue_Update : 231,
			MedicalConditionValue_Delete : 232,
			MedicalInfo_Create : 233,
			MedicalInfo_Read : 234,
			MedicalInfo_Update : 235,
			MedicalInfo_Delete : 236,
			MedicalPriority_Create : 237,
			MedicalPriority_Read : 238,
			MedicalPriority_Update : 239,
			MedicalPriority_Delete : 240,
			Medication_Create : 241,
			Medication_Read : 242,
			Medication_Update : 243,
			Medication_Delete : 244,
			Medicine_Create : 245,
			Medicine_Read : 246,
			Medicine_Update : 247,
			Medicine_Delete : 248,
			Module_Read : 249,
			NonPeriodicalCost_Create : 250,
			NonPeriodicalCost_Read : 251,
			NonPeriodicalCost_Update : 252,
			NonPeriodicalCost_Delete : 253,
			Operator_Create : 254,
			Operator_Read : 255,
			Operator_Update : 256,
			Operator_Delete : 257,
			Organization_Create : 258,
			Organization_Read : 259,
			Organization_Update : 260,
			Organization_Delete : 261,
			PaymentMethod_Create : 262,
			PaymentMethod_Read : 263,
			PaymentMethod_Update : 264,
			PaymentMethod_Delete : 265,
			PeriodicalCost_Create : 266,
			PeriodicalCost_Read : 267,
			PeriodicalCost_Update : 268,
			PeriodicalCost_Delete : 269,
			Person_Create : 270,
			Person_Read : 271,
			Person_Update : 272,
			Person_Delete : 273,
			Personalization_Create : 274,
			Personalization_Read : 275,
			Personalization_Update : 276,
			Personalization_Delete : 277,
			PointOfEntry_Create : 278,
			PointOfEntry_Read : 279,
			PointOfEntry_Update : 280,
			PointOfEntry_Delete : 281,
			Pomas_Position_Read : 282,
			Pomas_Position_Write : 283,
			Pomas_Position_Delete : 284,
			ProfessionalCaregiver_Create : 285,
			ProfessionalCaregiver_Read : 286,
			ProfessionalCaregiver_Update : 287,
			ProfessionalCaregiver_Delete : 288,
			Project_Create : 289,
			Project_Read : 290,
			Project_Update : 291,
			Project_Delete : 292,
			PushNotificationSetting_Read : 293,
			ReferralStatus_Create : 294,
			ReferralStatus_Read : 295,
			ReferralStatus_Update : 296,
			ReferralStatus_Delete : 297,
			Region_Create : 298,
			Region_Read : 299,
			Region_Update : 300,
			Region_Delete : 301,
			RelationalCaregiver_Create : 302,
			RelationalCaregiver_Read : 303,
			RelationalCaregiver_Update : 304,
			RelationalCaregiver_Delete : 305,
			RelationType_Create : 306,
			RelationType_Read : 307,
			RelationType_Update : 308,
			RelationType_Delete : 309,
			Report_Create : 310,
			Report_Read : 311,
			Report_Update : 312,
			Report_Delete : 313,
			Residence_Create : 314,
			Residence_Read : 315,
			Residence_Update : 316,
			Residence_Delete : 317,
			ResidenceType_Create : 318,
			ResidenceType_Read : 319,
			ResidenceType_Update : 320,
			ResidenceType_Delete : 321,
			ResponderSetting_Read : 322,
			ResponderSetting_Update : 323,
			Resultable_ProcessResult : 324,
			Role_Create : 325,
			Role_Read : 326,
			Role_Update : 327,
			Role_Delete : 328,
			Salutation_Create : 329,
			Salutation_Read : 330,
			Salutation_Update : 331,
			Salutation_Delete : 332,
			ScheduledTaskType_Create : 333,
			ScheduledTaskType_Read : 334,
			ScheduledTaskType_Update : 335,
			ScheduledTaskType_Delete : 336,
			ScheduledTask_Create : 337,
			ScheduledTask_Read : 338,
			ScheduledTask_Update : 339,
			ScheduledTask_Delete : 340,
			ScheduledTask_Execute : 341,
			Scheme_Create : 342,
			Scheme_Read : 343,
			Scheme_Update : 344,
			Scheme_Delete : 345,
			ServiceInfo_Handling : 346,
			ServiceVersion_Read : 347,
			Setting_Read : 348,
			Setting_Update : 349,
			Skill_Create : 350,
			Skill_Read : 351,
			Skill_Update : 352,
			Skill_Delete : 353,
			SkillEventType_Create : 354,
			SkillEventType_Read : 355,
			SkillEventType_Update : 356,
			SkillEventType_Delete : 357,
			SmsService_SendSms : 358,
			Subscriber_Create : 359,
			Subscriber_Read : 360,
			Subscriber_Update : 361,
			Subscriber_Update_SubscriberState : 362,
			Subscriber_Delete : 363,
			SubscriberExternalWebLink_Create : 364,
			SubscriberExternalWebLink_Read : 365,
			SubscriberExternalWebLink_Update : 366,
			SubscriberExternalWebLink_Delete : 367,
			SubscriberHoliday_Create : 368,
			SubscriberHoliday_Read : 369,
			SubscriberHoliday_Update : 370,
			SubscriberHoliday_Delete : 371,
			SubscriberHistory_Read : 372,
			SubscriberState_Create : 373,
			SubscriberState_Read : 374,
			SubscriberState_Update : 375,
			SubscriberState_Delete : 376,
			SubscriberStateChangeReason_Create : 377,
			SubscriberStateChangeReason_Read : 378,
			SubscriberStateChangeReason_Update : 379,
			SubscriberStateChangeReason_Delete : 380,
			SupportingDataManagementSetting_Read : 381,
			Tariff_Create : 382,
			Tariff_Read : 383,
			Tariff_Update : 384,
			Tariff_Delete : 385,
			Task_Create : 386,
			Task_Read : 387,
			Task_Update : 388,
			Task_Delete : 389,
			TerminationReason_Create : 390,
			TerminationReason_Read : 391,
			TerminationReason_Update : 392,
			TerminationReason_Delete : 393,
			Title_Create : 394,
			Title_Read : 395,
			Title_Update : 396,
			Title_Delete : 397,
			UmoWebSetting_Read : 398,
			UmoWebSetting_Update : 399,
			User_Create : 400,
			User_Read : 401,
			User_Update : 402,
			User_Delete : 403,
			User_Reset : 404,
			VatTariff_Create : 405,
			VatTariff_Read : 406,
			VatTariff_Update : 407,
			VatTariff_Delete : 408,
			Warden_Create : 409,
			Warden_Read : 410,
			Warden_Update : 411,
			Warden_Delete : 412,
});
		
/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('organizationFactory',
    ['domainDefaults', function (domainDefaults) {
        'use strict';

        var model = {};

        model.createSimpleOrganizationNote = function (companyId, subject, content, fromDate, toDate) {
            return {
                CompanyId: companyId,
                Subject: subject,
                Content: content,
                ValidPeriod: {
                    FromDate: fromDate,
                    ToDate: toDate
                }
            };
        };

        return model;
    }]);

/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('residenceFactory',
    ['domainDefaults', function (domainDefaults) {
        'use strict';

        var model = {};

        model.createSimpleResidence = function (houseNr, street, city, region, postcode, phone, organization) {
            return {
                StreetAddress: {
                    HouseNumber: houseNr,
                    StreetName: street,
                    CityId: city,
                    RegionId: region,
                    PostalCode: postcode
                },

                DefaultPhoneNumber: phone,
                OrganizationId: organization,
                StreetAddressId: domainDefaults.emptyGuid
            }
        };

        return model;
    }])
/* istanbul ignore next */
angular.module('verklizan.umox.common.html5.vkz-webrequests.domain').factory('subscriberFactory',
    ['domainDefaults', function (domainDefaults) {
        'use strict';

        var model = {};

        model.createSimpleSubscriberNote = function (personId, subject, content, crmCheck, callCheck, photo) {
            var note = {
                PersonId: personId,
                Subject: subject,
                Content: content,
                IsEditDataRequired: crmCheck,
                IsPopUp: callCheck,
                ValidPeriod: domainDefaults.emptyString
            };

            if (photo) {
                note.DefaultAttachment = photo;
                note.DefaultAttachmentMimeType = domainDefaults.defaultImageMemeType;
                note.DefaultAttachmentName = domainDefaults.emptyString;
            }

            return note;
        };

        model.createSimpleSubscriber = function (subscriberProfile, birthDate, status, organization, subscriptionNumber, residence) {
            return {
                Identity: {
                    FirstName: subscriberProfile.firstName,
                    Insertion: subscriberProfile.insertion,
                    Gender: subscriberProfile.gender,
                    BirthDate: birthDate,
                    LastName: subscriberProfile.surname
                },

                CitizenServiceNumber: subscriberProfile.serviceNr,
                DefaultRemark: subscriberProfile.remark,
                SubscriberStateId: status,
                OrganizationId: organization,
                SubscriptionNumber: subscriptionNumber,
                ResidenceId: residence,
                SocialServiceNumber : {}
            }
        };

        return model;
    }])
angular.module('verklizan.umox.common.html5.vkz-webrequests.general').constant('authorizationModuleConstants', {
    ClientManagement: 'ClientManagement',
    SystemManagement: 'SystemManagement',
    Personalization: 'Personalization',
    Authorization: 'Authorization',
    AuditTrail: 'AuditTrail',
    MaintenanceInfo: 'MaintenanceInfo',
    WellBeing: 'WellBeing',
    Intaker: 'Intaker',
    Responder: 'Responder',
    DeviceInfo: 'DeviceInfo'
});

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').constant('authorizationTaskConstants', {

    none : 'NoTaskForMethod',
    unknown: 'Unknown',

    any_user_update: 'Any_User_Update',

    agreementType_create: 'AgreementType_Create',
    agreementType_read: 'AgreementType_Read',
    agreementType_update: 'AgreementType_Update',
    agreementType_delete: 'AgreementType_Delete',

    appointment_create: 'Appointment_Create',
    appointment_read: 'Appointment_Read',
    appointment_update: 'Appointment_Update',
    appointment_delete: 'Appointment_Delete',

    appointmentType_create: 'AppointmentType_Create',
    appointmentType_read: 'AppointmentType_Read',
    appointmentType_update: 'AppointmentType_Update',
    appointmentType_delete: 'AppointmentType_Delete',

    aspect_create: 'Aspect_Create',
    aspect_read: 'Aspect_Read',
    aspect_update: 'Aspect_Update',
    aspect_delete: 'Aspect_Delete',

    aspectValue_create: 'AspectValue_Create',
    aspectValue_read: 'AspectValue_Read',
    aspectValue_update: 'AspectValue_Update',
    aspectValue_delete: 'AspectValue_Delete',

    audit_read: 'Audit_Read',

    availableReport_create: 'AvailableReport_Create',
    availableReport_read: 'AvailableReport_Read',
    availableReport_update: 'AvailableReport_Update',
    availableReport_delete: 'AvailableReport_Delete',

    caregiver_read: 'Caregiver_Read',

    caregiverGroup_create: 'CaregiverGroup_Create',
    caregiverGroup_read: 'CaregiverGroup_Read',
    caregiverGroup_update: 'CaregiverGroup_Update',
    caregiverGroup_delete: 'CaregiverGroup_Delete',

    caregiverType_create: 'CaregiverType_Create',
    caregiverType_read: 'CaregiverType_Read',
    caregiverType_update: 'CaregiverType_Update',
    caregiverType_delete: 'CaregiverType_Delete',

    caregiverLink_create: 'CaregiverLink_Create',
    caregiverLink_read: 'CaregiverLink_Read',
    caregiverLink_update: 'CaregiverLink_Update',
    caregiverLink_delete: 'CaregiverLink_Delete',

    careRequest_read: 'CareRequest_Read',
    careRequest_update: 'CareRequest_Update',
    careRequest_subscription: 'CareRequest_Subscription',

    city_create: 'City_Create',
    city_read: 'City_Read',
    city_update: 'City_Update',
    city_delete: 'City_Delete',

    clientDocument_create: 'ClientDocument_Create',
    clientDocument_read: 'ClientDocument_Read',
    clientDocument_update: 'ClientDocument_Update',
    clientDocument_delete: 'ClientDocument_Delete',

    company_create: 'Company_Create',
    company_read: 'Company_Read',
    company_update: 'Company_Update',
    company_delete: 'Company_Delete',

    consumerGroup_create: 'ConsumerGroup_Create',
    consumerGroup_read: 'ConsumerGroup_Read',
    consumerGroup_update: 'ConsumerGroup_Update',
    consumerGroup_delete: 'ConsumerGroup_Delete',

    consumerState_create: 'ConsumerState_Create',
    consumerState_read: 'ConsumerState_Read',
    consumerState_update: 'ConsumerState_Update',
    consumerState_delete: 'ConsumerState_Delete ',

    contactItemType_create: 'ContactItemType_Create',
    contactItemType_read: 'ContactItemType_Read',
    contactItemType_update: 'ContactItemType_Update',
    contactItemType_delete: 'ContactItemType_Delete',

    contract_create: 'Contract_Create',
    contract_read: 'Contract_Read',
    contract_update: 'Contract_Update',
    contract_delete: 'Contract_Delete',

    contractDocument_create: 'ContractDocument_Create',
    contractDocument_read: 'ContractDocument_Read',
    contractDocument_update: 'ContractDocument_Update',
    contractDocument_delete: 'ContractDocument_Delete',

    contractHash_create: 'ContractHash_Create',
    contractHash_read: 'ContractHash_Read',
    contractHash_update: 'ContractHash_Update',
    contractHash_delete: 'ContractHash_Delete',

    country_create: 'Country_Create',
    country_read: 'Country_Read',
    country_update: 'Country_Update',
    country_delete: 'Country_Delete',

    coInhabitantType_create: "CoInhabitantType_Create",
    coInhabitantType_read: "CoInhabitantType_Read",
    coInhabitantType_update: "CoInhabitantType_Update",
    coInhabitantType_delete: "CoInhabitantType_Delete",

    currentUser_read: 'CurrentUser_Read',

    dataApi_subscriber_read: 'DataApi_Subscriber_Read',
    dataApi_incident_read: 'DataApi_Incident_Read',
    dataApi_caregiver_read: 'DataApi_Caregiver_Read',
    dataApi_device_read: 'DataApi_Device_Read',

    debtor_create: 'Debtor_Create',
    debtor_read: 'Debtor_Read',
    debtor_update: 'Debtor_Update',
    debtor_delete: 'Debtor_Delete',

    debugService_applicationList_read: 'DebugService_ApplicationList_Read',
    debugService_readLoginTrailPage : 'DebugService_ReadLoginTrailPage',
    debugService_readTraceLogPage: 'DebugService_ReadTraceLogPage',
    debugService_createTraceLog: 'DebugService_CreateTraceLog',

    device_create: 'Device_Create',
    device_read: 'Device_Read',
    device_update: 'Device_Update',
    device_delete: 'Device_Delete',

    device_read_companyzero: 'Device_Read_CompanyZero',

    deviceManager_create: 'DeviceManager_Create',
    deviceManager_read: 'DeviceManager_Read',
    deviceManager_update: 'DeviceManager_Update',
    deviceManager_delete: 'DeviceManager_Delete',

    deviceType_create: 'DeviceType_Create',
    deviceType_read: 'DeviceType_Read',
    deviceType_update: 'DeviceType_Update',
    deviceType_delete: 'DeviceType_Delete',

    deviceState_create: 'DeviceState_Create',
    deviceState_read: 'DeviceState_Read',
    deviceState_update: 'DeviceState_Update',
    deviceState_delete: 'DeviceState_Delete',

    deviceControl_create: 'DeviceControl_Create',
    deviceControl_read: 'DeviceControl_Read',
    deviceControl_update: 'DeviceControl_Update',
    deviceControl_delete: 'DeviceControl_Delete',

    //DebugService_ApplicationList_Read,
    //DebugService_CreateTraceLog,
    //DebugService_CreateTraceLogSL,
    //DebugService_ExtendSubscription,
    //DebugService_ReadTraceLogPage,
    //DebugService_ReadLoginTrailPage,
    //DebugService_Subscribe,
    //DebugService_TraceLevel_Update,
    //DebugService_UnSubscribe,

    district_create: 'District_Create',
    district_read: 'District_Read',
    district_update: 'District_Update',
    district_delete: 'District_Delete',

    doctorReference_create: 'DoctorReference_Create',
    doctorReference_read: 'DoctorReference_Read',
    doctorReference_update: 'DoctorReference_Update',
    doctorReference_delete: 'DoctorReference_Delete',

	event_create : 'Event_Create',
	event_read : 'Event_Read',
	event_update : 'Event_Update',
	event_delete : 'Event_Delete',

	eventAspect_create : 'EventAspect_Create',
	eventAspect_read: 'EventAspect_Read',
	eventAspect_update : 'EventAspect_Update',
	eventAspect_delete:'EventAspect_Delete',

	eventAspectCategory_create : 'EventAspectCategory_Create',
	eventAspectCategory_read: 'EventAspectCategory_Read',
	eventAspectCategory_update : 'EventAspectCategory_Update',
	eventAspectCategory_delete:'EventAspectCategory_Delete',

	eventAspectValue_create : 'EventAspectValue_Create',
	eventAspectValue_read : 'EventAspectValue_Read',
	eventAspectValue_update : 'EventAspectValue_Update',
	eventAspectValue_delete : 'EventAspectValue_Delete',

	eventPriority_create: 'EventPriority_Create',
	eventPriority_read: 'EventPriority_Read',
	eventPriority_update: 'EventPriority_Update',
	eventPriority_delete: 'EventPriority_Delete',

	eventType_read : 'EventType_Read',
	eventType_create : 'EventType_Create',
	eventType_update :'EventType_Update',
	eventType_delete : 'EventType_Delete',

    eventType_alarmCalls_read: 'EventType_AlarmCalls_Read',
    eventType_systemCalls_read: 'EventType_SystemCalls_Read',
    eventType_callCentreCalls_read: 'EventType_CallCentreCalls_Read',
    eventType_crmIncidents_read: 'EventType_CrmIncidents_Read',

    externalWebLinkType_read: 'ExternalWebLinkType_Read',

	incident_create : 'Incident_Create',
	incident_read : 'Incident_Read',
	incident_update : 'Incident_Update',
	incident_delete : 'Incident_Delete',

	incidentKind_create : 'IncidentKind_Create',
	incidentKind_read : 'IncidentKind_Read',
	incidentKind_update : 'IncidentKind_Update',
	incidentKind_delete : 'IncidentKind_Delete',

	incidentPriority_create : 'IncidentPriority_Create',
	incidentPriority_read : 'IncidentPriority_Read',
	incidentPriority_update : 'IncidentPriority_Update',
	incidentPriority_delete : 'IncidentPriority_Delete',

    //IncidentProcessor_Subscription,
    //IncidentProcessor_GetEventDetails,
    //IncidentProcessor_GetEventsPage,
    //IncidentProcessor_GetIncidentDetails,
    //IncidentProcessor_GetIncidentsPage,
    //IncidentProcessor_PutNewEventId,
    //IncidentProcessor_PutNewOperatorRequest,

    insurer_create: 'Insurer_Create',
    insurer_read: 'Insurer_Read',
    insurer_update: 'Insurer_Update',
    insurer_delete: 'Insurer_Delete',

    insuranceClass_create: 'InsuranceClass_Create',
    insuranceClass_read: 'InsuranceClass_Read',
    insuranceClass_update: 'InsuranceClass_Update',
    insuranceClass_delete: 'InsuranceClass_Delete',

    invoiceMethod_create: 'InvoiceMethod_Create',
    invoiceMethod_read: 'InvoiceMethod_Read',
    invoiceMethod_update: 'InvoiceMethod_Update',
    invoiceMethod_delete: 'InvoiceMethod_Delete',

    keyLocation_create: 'KeyLocation_Create',
    keyLocation_read: 'KeyLocation_Read',
    keyLocation_update: 'KeyLocation_Update',
    keyLocation_delete: 'KeyLocation_Delete',

    language_create: "Language_Create",
    language_read: "Language_Read",
    language_update: "Language_Update",
    language_delete: "Language_Delete",

    license_read: 'License_Read',

    //Manage_WcfService,
    //Manage_ServiceInfo_Read,
    //Manage_ServiceInfo_Update,

    maritalState_create: 'MaritalState_Create',
    maritalState_read: 'MaritalState_Read',
    maritalState_update: 'MaritalState_Update',
    maritalState_delete: 'MaritalState_Delete',

    medicalCondition_create: 'MedicalCondition_Create',
    medicalCondition_read: 'MedicalCondition_Read',
    medicalCondition_update: 'MedicalCondition_Update',
    medicalCondition_delete: 'MedicalCondition_Delete',

    medicalConditionValue_create: 'MedicalConditionValue_Create',
    medicalConditionValue_read: 'MedicalConditionValue_Read',
    medicalConditionValue_update: 'MedicalConditionValue_Update',
    medicalConditionValue_delete: 'MedicalConditionValue_Delete',

    medicalInfo_create: 'MedicalInfo_Create',
    medicalInfo_read: 'MedicalInfo_Read',
    medicalInfo_update: 'MedicalInfo_Update',
    medicalInfo_delete: 'MedicalInfo_Delete',

    medicalPriority_create: 'MedicalPriority_Create',
    medicalPriority_read: 'MedicalPriority_Read',
    medicalPriority_update: 'MedicalPriority_Update',
    medicalPriority_delete: 'MedicalPriority_Delete',

    medication_create: 'Medication_Create',
    medication_read: 'Medication_Read',
    medication_update: 'Medication_Update',
    medication_delete: 'Medication_Delete',

    medicine_create: 'Medicine_Create',
    medicine_read: 'Medicine_Read',
    medicine_update: 'Medicine_Update',
    medicine_delete: 'Medicine_Delete',

    module_read: 'Module_Read',

    nonPeriodicalCost_create: 'NonPeriodicalCost_Create',
    nonPeriodicalCost_read: 'NonPeriodicalCost_Read',
    nonPeriodicalCost_update: 'NonPeriodicalCost_Update',
    nonPeriodicalCost_delete: 'NonPeriodicalCost_Delete',

    operator_create: "Operator_Create",
    operator_read: "Operator_Read",
    operator_update: "Operator_Update",
    operator_delete: "Operator_Delete",

	organization_create : 'Organization_Create',
	organization_read : 'Organization_Read',
	organization_update : 'Organization_Update',
	organization_delete : 'Organization_Delete',

    paymentMethod_create: 'PaymentMethod_Create',
    paymentMethod_read: 'PaymentMethod_Read',
    paymentMethod_update: 'PaymentMethod_Update',
    paymentMethod_delete: 'PaymentMethod_Delete',

    periodicalCost_create: 'PeriodicalCost_Create',
    periodicalCost_read: 'PeriodicalCost_Read',
    periodicalCost_update: 'PeriodicalCost_Update',
    periodicalCost_delete: 'PeriodicalCost_Delete',

	person_create : 'Person_Create',
	person_read : 'Person_Read',
	person_update : 'Person_Update',
	person_delete : 'Person_Delete',

    personalization_create: 'Personalization_Create',
    personalization_read: 'Personalization_Read',
    personalization_update: 'Personalization_Update',
    personalization_delete: 'Personalization_Delete',

    pointOfEntry_create: 'PointOfEntry_Create',
    pointOfEntry_read: 'PointOfEntry_Read',
    pointOfEntry_update: 'PointOfEntry_Update',
    pointOfEntry_delete: 'PointOfEntry_Delete',

    professionalCaregiver_create: 'ProfessionalCaregiver_Create',
    professionalCaregiver_read: 'ProfessionalCaregiver_Read',
    professionalCaregiver_update: 'ProfessionalCaregiver_Update',
    professionalCaregiver_delete: 'ProfessionalCaregiver_Delete',

    referralStatus_create: 'ReferralStatus_Create',
    referralStatus_read: 'ReferralStatus_Read',
    referralStatus_update: 'ReferralStatus_Update',
    referralStatus_delete: 'ReferralStatus_Delete',

    region_create: 'Region_Create',
    region_read: 'Region_Read',
    region_update: 'Region_Update',
    region_delete: 'Region_Delete',

    relationalCaregiver_create: 'RelationalCaregiver_Create',
    relationalCaregiver_read: 'RelationalCaregiver_Read',
    relationalCaregiver_update: 'RelationalCaregiver_Update',
    relationalCaregiver_delete: 'RelationalCaregiver_Delete',

    relationType_create: 'RelationType_Create',
    relationType_read: 'RelationType_Read',
    relationType_update: 'RelationType_Update',
    relationType_delete: 'RelationType_Delete',

    report_create: 'Report_Create',
    report_read: 'Report_Read',
    report_update: 'Report_Update',
    report_delete: 'Report_Delete',

    residence_create: 'Residence_Create',
    residence_read: 'Residence_Read',
    residence_update: 'Residence_Update',
    residence_delete: 'Residence_Delete',

    residenceType_create: 'ResidenceType_Create',
    residenceType_read: 'ResidenceType_Read',
    residenceType_update: 'ResidenceType_Update',
    residenceType_delete: 'ResidenceType_Delete',

    responderSetting_read: 'ResponderSetting_Read',
    intakerSetting_read: 'IntakerSetting_Read',
    generalSetting_Read: 'GeneralSetting_Read',
    generalSetting_Update: 'GeneralSetting_Update',
    responderSetting_Read: 'ResponderSetting_Read',
    responderSetting_Update: 'ResponderSetting_Update',
    umoWebSetting_Read: 'UmoWebSetting_Read',
    umoWebSetting_Update: 'UmoWebSetting_Update',
    autoAppointmentServiceSetting_Read: 'AutoAppointmentServiceSetting_Read',
    autoAppointmentServiceSetting_Update: 'AutoAppointmentServiceSetting_Update',

	role_create : 'Role_Create',
	role_read : 'Role_Read',
	role_update : 'Role_Update',
	role_delete : 'Role_Delete',

    salutation_create: 'Salutation_Create',
    salutation_read: 'Salutation_Read',
    salutation_update: 'Salutation_Update',
    salutation_delete: 'Salutation_Delete',

    scheme_create: 'Scheme_Create',
    scheme_read: 'Scheme_Read',
    scheme_update: 'Scheme_Update',
    scheme_delete: 'Scheme_Delete',

    serviceVersion_read: 'ServiceVersion_Read',

    setting_read: 'Setting_Read',
    setting_update: 'Setting_Update',

    skill_create: 'Skill_Create',
    skill_read: 'Skill_Read',
    skill_update: 'Skill_Update',
    skill_delete: 'Skill_Delete',

	skillEventType_create : 'SkillEventType_Create',
	skillEventType_read : 'SkillEventType_Read',
	skillEventType_update : 'SkillEventType_Update',
	skillEventType_delete : 'SkillEventType_Delete',

    subscriber_create: 'Subscriber_Create',
    subscriber_read: 'Subscriber_Read',
    subscriber_update: 'Subscriber_Update',
    subscriber_delete: 'Subscriber_Delete',

    subscriber_update_subscriberState: "Subscriber_Update_SubscriberState",

    subscriberHistory_read : 'SubscriberHistory_Read',

	subscriberExternalWebLink_create: 'SubscriberExternalWebLink_Create',
	subscriberExternalWebLink_read: 'SubscriberExternalWebLink_Read',
	subscriberExternalWebLink_update: 'SubscriberExternalWebLink_Update',
	subscriberExternalWebLink_delete: 'SubscriberExternalWebLink_Delete',

    subscriberState_create: 'SubscriberState_Create',
    subscriberState_read: 'SubscriberState_Read',
    subscriberState_update: 'SubscriberState_Update',
    subscriberState_delete: 'SubscriberState_Delete',

    subscriberStateChangeReason_create: 'SubscriberStateChangeReason_Create',
    subscriberStateChangeReason_read: 'SubscriberStateChangeReason_Read',
    subscriberStateChangeReason_update: 'SubscriberStateChangeReason_Update',
    subscriberStateChangeReason_delete: 'SubscriberStateChangeReason_Delete',

    tariff_create: 'Tariff_Create',
    tariff_read: 'Tariff_Read',
    tariff_update: 'Tariff_Update',
    tariff_delete: 'Tariff_Delete',

    task_create: 'Task_Create',
    task_read: 'Task_Read',
    task_update: 'Task_Update',
    task_delete: 'Task_Delete',

    terminationReason_create: 'TerminationReason_Create',
    terminationReason_read: 'TerminationReason_Read',
    terminationReason_update: 'TerminationReason_Update',
    terminationReason_delete: 'TerminationReason_Delete',

    title_create: 'Title_Create',
    title_read: 'Title_Read',
    title_update: 'Title_Update',
    title_delete: 'Title_Delete',

    user_create: 'User_Create',
    user_read: 'User_Read',
    user_update: 'User_Update',
    user_delete: 'User_Delete',
    user_reset: 'User_Reset',

    vatTariff_create: 'VatTariff_Create',
    vatTariff_read: 'VatTariff_Read',
    vatTariff_update: 'VatTariff_Update',
    vatTariff_delete: 'VatTariff_Delete',

    warden_create: 'Warden_Create',
    warden_read: 'Warden_Read',
    warden_update: 'Warden_Update',
    warden_delete: 'Warden_Delete'

});

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').factory('CustomServiceUrl',
    function () {
        "use strict";

        function CustomServiceUrl(baseUrl, methodName) {
            this.baseUrl = baseUrl;
            this.methodName = methodName;

            this.toString = function () {
                return [this.baseUrl, this.methodName].join('/');
            };
        }


        return (CustomServiceUrl);
    });

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').config(
    ['settingsServiceProvider', function (settingsServiceProvider) {
        settingsServiceProvider.addSetting({ name: "SessionTokenString", options: { isTemporarily: true } });
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').factory('GenericHttpErrorHandler',
    ['$q', 'httpErrorCode', function ($q, httpErrorCode) {
        "use strict";

        var errorHandlers = {};

        // ============================
        // Constructor
        // ============================
        function GenericHttpErrorHandler(errorCodesToSupport) {
            var errorCodesToHandle = errorCodesToSupport;

            this.handleError = function (response, requestData) {
                var result = handleError(response.status, response);

                logHandlingErrorMessage(response, requestData);

                return result;
            };

            this.handleAuthorizationError = function (serviceUrl) {
                var result = handleError(httpErrorCode.NotAuthorized);

                logHandlingErrorMessage(null, null, serviceUrl);

                return result;
            };

            var getErrorHandlerByCode = function (errorCode) {
                if (canHandleErrorCode(errorCode)) {
                    return errorHandlers[errorCode];
                }
            };

            var handleError = function (errorCode, response) {
                var errorHandler = getErrorHandlerByCode(errorCode);
                var isHandled = false;
                if (angular.isFunction(errorHandler)) {
                    errorHandler(response);
                    isHandled = true;
                }

                return $q.reject({
                    errorIsHandled: isHandled,
                    response: response || {}
                });
            };

            var canHandleErrorCode = function (errorCode) {
                var hasErrorHandler = angular.isFunction(errorHandlers[errorCode]);
                var isSetForErrorCode = errorCodesToHandle.indexOf(errorCode) > -1;

                return hasErrorHandler && isSetForErrorCode;
            };

            var logHandlingErrorMessage = function (response, requestData, serviceUrl) {
                console.log("=============================================");
                if (response && requestData) {
                    console.log("Service error occured with error: " + response.status);
                    console.log("to " + response.config.url);
                    console.log("with data: " + JSON.stringify(response.data));
                    console.log("with request data: " + JSON.stringify(requestData));
                }

                if (serviceUrl) {
                    console.log("is not sent to the service because lack of a security token");
                    console.log("to " + serviceUrl);
                }
                console.log("---------------------------------------------");
            };
        }

        // ============================
        // Static definition
        // ============================
        // can only be set once to prevent overwrites while running the application
        GenericHttpErrorHandler.addErrorHandler = function (errorCode, errorHandler) {
            if (angular.isDefined(errorHandlers[errorCode])) {
                return;
            }

            errorHandlers[errorCode] = errorHandler;
        };

        GenericHttpErrorHandler.createWithAllErrorCodesEnabled = function () {
            var arrayOfErrors = getListOfPossibleErrorCodes();
            var handlerWithAllErrorCodesEnabled = new GenericHttpErrorHandler(arrayOfErrors);

            return handlerWithAllErrorCodesEnabled;
        };

        GenericHttpErrorHandler.createWithErrorCodesEnabled = function (errorCodes) {
            var errorCodesToHandle = [];

            if (angular.isArray(arguments[0])) {
                errorCodesToHandle = arguments[0];
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    var argument = arguments[i];
                    if (angular.isNumber(argument)) {
                        errorCodesToHandle.push(argument);
                    }
                }
            }

            return new GenericHttpErrorHandler(errorCodesToHandle);
        };

        GenericHttpErrorHandler.createWithAllErrorCodesEnabledExcept = function () {
            var errorsToHandle = getListOfPossibleErrorCodes();

            for (var i = 0; i < arguments.length; i++) {
                var currentError = arguments[i];

                var indexOfErrorInErrorCollection = collectionContainsError(currentError, errorsToHandle);

                if (indexOfErrorInErrorCollection !== -1) {
                    errorsToHandle.splice(indexOfErrorInErrorCollection, 1);
                }
            }

            return new GenericHttpErrorHandler(errorsToHandle);
        };

        function collectionContainsError(singleError, errorCollection) {
            for (var j = 0; j < errorCollection.length; j++) {
                var currentError = errorCollection[j];

                if (singleError === currentError) {
                    return j;
                }
            }
            return -1;
        }

        function getListOfPossibleErrorCodes() {
            return Object.keys(httpErrorCode).map(function (key) { return httpErrorCode[key]; });
        }

        return (GenericHttpErrorHandler);

    }]);

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').service('hashService',
    function () {
        'use strict';

        this.CreatePasswordHash = function (username, password) {
            var loweredUsername = username.toLowerCase();

            var firstHashString = SHA256(password);
            var secondHashString = SHA256(firstHashString + loweredUsername);
            var hashedPassword = SHA256(password + secondHashString);

            return hashedPassword;
        }

        function SHA256(stringInput) {

            var chrsz = 8;
            var hexcase = 0;

            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function s(X, n) { return (X >>> n) | (X << (32 - n)); }

            function r(X, n) { return (X >>> n); }

            function ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }

            function maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }

            function sigma0256(x) { return (s(x, 2) ^ s(x, 13) ^ s(x, 22)); }

            function sigma1256(x) { return (s(x, 6) ^ s(x, 11) ^ s(x, 25)); }

            function gamma0256(x) { return (s(x, 7) ^ s(x, 18) ^ r(x, 3)); }

            function gamma1256(x) { return (s(x, 17) ^ s(x, 19) ^ r(x, 10)); }

            function core_sha256(m, l) {
                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                var W = new Array(64);
                var a, b, c, d, e, f, g, h;
                var T1, T2;

                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;

                for (var i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];

                    for (var j = 0; j < 64; j++) {
                        if (j < 16) {
                            W[j] = m[j + i];
                        } else {
                            W[j] = safe_add(safe_add(safe_add(gamma1256(W[j - 2]), W[j - 7]), gamma0256(W[j - 15])), W[j - 16]);
                        }

                        T1 = safe_add(safe_add(safe_add(safe_add(h, sigma1256(e)), ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(sigma0256(a), maj(a, b, c));

                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }

                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }

            function str2binb(str) {
                var bin = [];
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }

            function utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            }

            function binb2hex(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }

            stringInput = utf8Encode(stringInput);
            return binb2hex(core_sha256(str2binb(stringInput), stringInput.length * chrsz));

        }
    }
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').constant('httpErrorCode', {
    Unknown: -1,
    NoConnection: 0,
    BadRequest: 400,
    NotAuthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    PayloadTooLarge: 415,
    InternalServerError: 500,
    ServiceUnavailable: 503   
});
//Responsible for checking modules against the authorization.
angular.module('verklizan.umox.common.html5.vkz-webrequests.general').provider('moduleAuthorizationService',
['authorizationModuleConstants', function (authorizationModuleConstants) {
    'use strict';

    var moduleAuthorizationSupported = false;

    this.supportModuleBasedAuthorization = function (isSupported) {
        moduleAuthorizationSupported = isSupported;
    };

    var supportedModules = [];

    this.setApplicationSupportedModules = function (modulesArray) {
        supportedModules = modulesArray;
    }

    this.$get = ['authorizationModuleConstants', function (authorizationModuleConstants) {

        var modules = null;

        var moduleAuthorizationService = {};

        moduleAuthorizationService.isAuthorizedForModule = function (moduleName) {

            //If app doesn't support moduleAuthorization, then it will always return true.
            if (moduleAuthorizationSupported === false) {
                return true;
            }

            //Used for testing and methods without a module.
            if (moduleName === authorizationModuleConstants.none) {
                return true;
            }

            if (modules === null) {
                return false;
            }

            if (typeof modules[moduleName] === 'undefined') {
                throw new Error('this module is not present in the authorizationModulesConstants or in this service version');
            } else {
                return modules[moduleName];
            }
        };

        moduleAuthorizationService.getModules = function () {
            return modules;
        };

        moduleAuthorizationService.setModules = function (_modules) {
            modules = _modules;
        };

        moduleAuthorizationService.clearModules = function () {
            modules = null;
        };

        moduleAuthorizationService.getApplicationSupportedModules = function () {
            return supportedModules;
        }

        moduleAuthorizationService.isModuleAuthorizationSupported = function () {
            return moduleAuthorizationSupported;
        };

        return moduleAuthorizationService;
    }];
}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').factory('OperatorGatewayControlServiceUrl',
    ['urlSettingsService', function (urlSettingsService) {
        "use strict";

        function OperatorGatewayControlServiceUrl(methodName) {
            this.serverName = "operatorGateway/operatorGatewayControlService.svc";
            this.methodName = methodName;

            this.toString = function () {
                var baseUrl = urlSettingsService.getBaseUrl();
                
                return [baseUrl, this.serverName, this.methodName].join('/');
            };
        }

        return (OperatorGatewayControlServiceUrl);
    }]);

/**
 * @ngdoc service
 * @name CordovaUTIL.pagingHelper
 *
 * @description
 * Provides a number of functions that will help make standard dataManagers easier to use.
 *
 **/
angular.module('verklizan.umox.common.html5.vkz-webrequests.general').service('pagingHelper',
    ['$window', function ($window) {
        'use strict';

        /**
         * @ngdoc method
         * @name retrieveFullResultSetFromService
         * @methodOf CordovaUTIL.pagingHelper
         * @returns a pagingDto e.g. { Rows : [], TotalCount : 1 }
         * @description
         * Calls the proxyServiceMethod with the arguments that are provided and makes sure all data is retrieved.
         * All proxy methods should use the standard filters, sort, pageDescriptor, extra arguments as parameters.
        **/
        this.retrieveFullResultSetFromService = function (proxyServiceMethod) {

            function pagingRequest(data, pageIndex) {
                console.log(JSON.stringify(arguments));
                var proxyServiceArguments = Array.prototype.splice.call(arguments, 2);
                
                proxyServiceArguments[2].PageIndex = pageIndex;

                return proxyServiceMethod.apply(null, proxyServiceArguments).then(function (result) {
                    if ($window.isNullOrUndefined(result) || window.isNullOrUndefined(result.Rows) || window.isNullOrUndefined(result.TotalCount)) {
                        return result;
                    }

                    data = Array.prototype.concat.call(data, result.Rows);

                    if (data.length < result.TotalCount) {
                        var pagingArguments = Array.prototype.concat.call([data, ++pageIndex], proxyServiceArguments);
                        return pagingRequest.apply(null,pagingArguments);
                    } else {
                        result.Rows = data;
                        return result;
                    }
                });
            }

            var pagingArguments = Array.prototype.concat.call([[], 0], Array.prototype.splice.call(arguments, 1));
           // console.log(pagingArguments);
            return pagingRequest.apply(null,pagingArguments);
        }

    }]
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').service('securityTokenService',
    ['$timeout', 'settingsService', function ($timeout, settingsService) {
        'use strict';

        // ============================
        // Private fields
        // ============================
        var that = this;
        var MILISECONDS_IN_MINUTE = 60000;

        var expirationInMinutes;
        var expirationDate = new Date();
        var expirationDeltaForTimingIssues = 5;

        var expirationCallbacks = [];
        var timerPromise;

        // ============================
        // Public methods
        // ============================
        this.setToken = function (newToken) {
            settingsService.setSessionTokenString(newToken);
        };

        this.removeToken = function () {
            settingsService.clearSessionTokenString();
            resetTokenExpiration();
        };

        this.getToken = function () {
            return settingsService.getSessionTokenString();
        };

        this.tokenIsPresent = function () {
            var savedToken = settingsService.getSessionTokenString();

            return savedToken !== null && typeof savedToken !== 'undefined';
        };

        this.setExperiationInMinutes = function (expiration) {
            if (!this.tokenIsPresent()) {
                throw new Error("There is no token, so you cannot set the expiration in minutes");
            }

            if (!Number.isFinite(expiration)) {
                throw new Error("expiration is not a number");
            }

            expirationInMinutes = expiration;
            console.log("expiration in minutes: " + expiration);
            this.renewTokenExpiration();
        };

        this.renewTokenExpiration = function () {
            if(Number.isFinite(expirationInMinutes) === false) {
                return;
            }
            setCallbackTimerAndExpirationDate();
        };

        this.registerTokenExpirationCallback = function (callback) {
            if (!angular.isFunction(callback)) {
                throw new Error("callback for token expiration is not a function");
            }

            expirationCallbacks.push(callback);
        };

        this.isTokenExpired = function () {
            return expirationDate <= new Date();
        };

        // ============================
        // Private methods
        // ============================
        var resetTokenExpiration = function () {
            expirationDate = new Date();
            cancelTimer();
        };

        var setCallbackTimerAndExpirationDate = function () {
            cancelTimer();
            var expirationInMinutesRefined = expirationInMinutes - expirationDeltaForTimingIssues;

            var expirationInMiliSeconds = expirationInMinutesRefined * MILISECONDS_IN_MINUTE;

            setExpirationDate(expirationInMiliSeconds);

            timerPromise = $timeout(tokenExpired, expirationInMiliSeconds);
        };

        var setExpirationDate = function (expirationInMiliSeconds) {
            var currentDate = new Date();
            var addedUpMiliSeconds = currentDate.getMilliseconds() + expirationInMiliSeconds;
            expirationDate = new Date(currentDate.setMilliseconds(addedUpMiliSeconds));
        };

        var tokenExpired = function () {
            that.removeToken();
            console.log("call token expired calls");
            for (var i = 0; i < expirationCallbacks.length; i++) {
                var currentCallback = expirationCallbacks[i];
                currentCallback();
            }
        };

        var cancelTimer = function () {
            if (timerPromise) {
                $timeout.cancel(timerPromise);
            }
        };
    }]
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').service('serviceRequestBodyFactory',
    ['GenericHttpErrorHandler', function (GenericHttpErrorHandler) {
        'use strict';

        // ============================
        // Public methods
        // ============================

        this.createSimplePageBody = function (filterDescriptor, sort, pageDescriptor) {
            return {
                pageDescriptor: pageDescriptor,
                filters: filterDescriptor,
                sort: sort
            };
        };

        this.createComplexPageBody = function (propertyName) {
            return function (value, filterDescriptor, sort, pageDescriptor) {
                var requestObject = {
                    pageDescriptor: pageDescriptor,
                    filters: filterDescriptor,
                    sort: sort
                };

                requestObject[propertyName] = value;

                return requestObject;
            };
        };

        //voorstel TB refactor
        //this.createPageBody = function() { 
        //    var propertyNamesArray = Array.prototype.slice.call(arguments);
        //    return function () {
        //        var valueArray = Array.prototype.slice.call(arguments);
        //        var requestObject = {
        //            pageDescriptor: valueArray[valueArray.length -3],
        //            filters: valueArray[valueArray.length - 2],
        //            sort: valueArray[valueArray.length -1]
        //        };

        //        for (var propertyNameIndex = 0; propertyNameIndex < propertyNamesArray.length; propertyNameIndex++) {
        //            var propertyName = propertyNamesArray[propertyNameIndex]
        //            requestObject[propertyName] = arguments[propertyNameIndex];
        //        }

        //        return requestObject;
        //    };
        //};

        this.createSearchPageBody = function (searchText, filterDescriptor, sort, pageDescriptor) {
            return {
                searchText: searchText,
                pageDescriptor: pageDescriptor,
                filters: filterDescriptor,
                sort: sort
            };
        };

        this.createParameteredBody = function () {
            var propertyNames = arguments;

            return function () {
                var propertyValues = arguments;
                var requestObject = {};

                for (var i = 0; i < propertyValues.length; i++) {
                    var propertyValue = propertyValues[i];
                    var propertyName = propertyNames[i];
                    requestObject[propertyName] = propertyValue;
                }

                return requestObject;
            };
        };

        this.createParameterlessBody = function () {
            return null;
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').factory('StandardUmoxServiceUrl',
    ['urlSettingsService', function (urlSettingsService) {
        "use strict";

        function StandardUmoxServiceUrl(serverName, methodName) {
            var urlInsertion = "clientGateway/WebHttpGatewayService.svc";
            var urlPostFix = "json";

            this.serverName = serverName;
            this.methodName = methodName;

            this.toString = function () {
                var baseUrl = urlSettingsService.getBaseUrl();
                return [baseUrl, urlInsertion, this.serverName, urlPostFix, this.methodName].join('/');
            };
        }


        return (StandardUmoxServiceUrl);
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').factory('StandardUmoXWebSocketUrl',
    ['urlSettingsService', function (urlSettingsService) {
        "use strict";

        return function () {
            //a possible url would be:  https://sv-devtest-an.main.verklizan.com/umo/OperatorGateway/OperatorGatewayService.svc
            var urlInsertion = "OperatorGateway/OperatorGatewayService.svc";
            var prefix = "";

            var baseUrl = urlSettingsService.getBaseUrl();

            if (baseUrl.search("http://") !== -1) {
                prefix = "ws://";
                baseUrl = baseUrl.replace("http://", '');
            }
            else if (baseUrl.search("https://") !== -1) {
                prefix = "wss://";
                baseUrl = baseUrl.replace("https://", '');
            }
            else {
                prefix = "wss://";
            }

            baseUrl = [prefix, baseUrl].join('');

            return [baseUrl, urlInsertion].join('/');
        }
}]);

//Responsible for checking tasks against the authorization.
angular.module('verklizan.umox.common.html5.vkz-webrequests.general').provider('taskAuthorizationService',
    ['authorizationTaskConstants', function (authorizationTaskConstants) {
        'use strict';

        var taskAuthorizationSupported = false;

        this.supportTaskBasedAuthorization = function (isSupported) {
            taskAuthorizationSupported = isSupported;
        };

        this.$get = ['authorizationTaskConstants', function (authorizationTaskConstants) {

            var tasks = null;

            var taskAuthorizationService = {};

            taskAuthorizationService.isAuthorizedForTask = function (taskString) {

                //If app doesn't support taskAuthorization, then it will always return true.
                if (taskAuthorizationSupported === false) {
                    return true;
                }
                //Used for testing and methods without a task.
                if (taskString === authorizationTaskConstants.none) {
                    return true;
                }
                if (tasks === null || angular.isDefined(taskString) === false) {
                    return false;
                }

                var taskNames = taskString.split(/[,;]/);
                var isAuthorized = false;

                for(var i in taskNames) {
                    var taskName = taskNames[i].trim();

                    if (typeof tasks[taskName] === 'undefined') {
                        throw new Error('this task is not present in the authorizationTasksConstants or in this service version');
                    } else if (tasks[taskName]) {
                        isAuthorized = true;
                    }
                }
                return isAuthorized;
            };

            taskAuthorizationService.getTasks = function () {
                return tasks;
            };

            taskAuthorizationService.setTasks = function (_tasks) {
                tasks = _tasks;
            };

            taskAuthorizationService.clearTasks = function () {
                tasks = null;
            };

            taskAuthorizationService.isTaskAuthorizationSupported = function () {
                return taskAuthorizationSupported;
            };

            return taskAuthorizationService;
        }];
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').service('umoOperationFactory',
    ['$q', '$window', 'webRequestService', 'GenericHttpErrorHandler', 'taskAuthorizationService', 'cachedSessionStorageService', function ($q, $window, webRequestService, GenericHttpErrorHandler, taskAuthorizationService, cachedSessionStorageService) {
        "use strict";

        this.createSecureProxyOperation = function (serviceUrl, requestDataResolver, taskName) {
            checkIfDataResolverIsValid(requestDataResolver);
            checkIfTaskExist(taskName, serviceUrl);
            checkIfUrlIsValid(serviceUrl, taskName);

            return function () {
                var url = serviceUrl.toString();
                var errorHandler = getErrorHandlerFromArguments(arguments);
                var requestData = getRequestDataIfExists(arguments, requestDataResolver, errorHandler);

                var isAuthorized = taskAuthorizationService.isAuthorizedForTask(taskName);
                if (isAuthorized) {
                    return webRequestService.authenticatedPost(url, requestData, errorHandler);
                } else {
                    return $q.reject('unauthorized exception');
                }
            };
        };

        this.createSecureProxyDownloadOperation = function (serviceUrl, requestDataResolver, taskName) {
            checkIfDataResolverIsValid(requestDataResolver);
            checkIfUrlIsValid(serviceUrl, taskName);
            checkIfTaskExist(taskName, serviceUrl);

            return function () {
                var url = serviceUrl.toString();
                var errorHandler = getErrorHandlerFromArguments(arguments);
                var requestData = getRequestDataIfExists(arguments, requestDataResolver, errorHandler);

                var isAuthorized = taskAuthorizationService.isAuthorizedForTask(taskName);
                if (isAuthorized) {
                    return webRequestService.authenticatedDownloadPost(url, requestData, errorHandler);
                } else {
                    return $q.reject('unauthorized exception');
                }
            };
        };

        this.createProxyOperation = function (serviceUrl, requestDataResolver) {
            checkIfDataResolverIsValid(requestDataResolver);
            checkIfUrlIsValid(serviceUrl);

            return function () {
                var url = serviceUrl.toString();
                var errorHandler = getErrorHandlerFromArguments(arguments);
                var requestData = getRequestDataIfExists(arguments, requestDataResolver, errorHandler);

                return webRequestService.post(url, requestData, errorHandler);
            };
        };

        this.createProxyOperationWithPassageIDHeader = function (serviceUrl, requestDataResolver) {
            checkIfDataResolverIsValid(requestDataResolver);
            checkIfUrlIsValid(serviceUrl);

            return function () {
                var url = serviceUrl.toString();
                var errorHandler = getErrorHandlerFromArguments(arguments);
                var requestData = getRequestDataIfExists(arguments, requestDataResolver, errorHandler);

                var headerObj = {};
                var tkn = cachedSessionStorageService.getSessionStorageItem("tkn");
                if (tkn !== null) {
                    headerObj.PassageIDToken = tkn;
                }

                var ott = cachedSessionStorageService.getSessionStorageItem("ott");
                if (ott !== null) {
                    headerObj.PidToken = ott;
                }

                return webRequestService.post(url, requestData, errorHandler, headerObj);
            };
        };


        var getRequestDataIfExists = function (args, requestDataResolver, errorHandler) {
            if ($window.isNullOrUndefined(errorHandler) === false) {
                Array.prototype.pop.apply(args);
            }

            return requestDataResolver.apply(null, args);

        };

        var checkIfDataResolverIsValid = function (dataResolver) {
            if (!angular.isFunction(dataResolver)) {
                throw "data resolver is something other than error or no resolver at all";
            }
        };

        var checkIfTaskExist = function (taskName, serviceUrl) {
            if (!angular.isDefined(taskName)) {
                throw "task name is not present in authorization task constants mapping for service url : " + serviceUrl;
            }
        }

        var checkIfUrlIsValid = function (url, taskName) {
            if (typeof url === "undefined") {
                throw "url of proxy method is not defined of the method with task " + taskName;
            }
        }

        var getErrorHandlerFromArguments = function (args) {
            var errorHandler = args[args.length - 1];
            return errorHandler instanceof GenericHttpErrorHandler ? errorHandler : null;
        };

        var isFunctionOrNothing = function (value) {
            return (angular.isFunction(value) || $window.isNullOrUndefined(value))
        }
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').provider('umoxServiceUrls',
    function () {
        'use strict';

        var umoxServiceUrls = {};
        var operatorGatewayControlServiceUrls = {};
        var alternativeUrls = {};

        this.setUmoxServiceUrls = function (newUmoxServiceUrls) {
            umoxServiceUrls = newUmoxServiceUrls || umoxServiceUrls;
        };

        this.setOperatorGatewayControlServiceUrls = function (newOperatorGatewayControlServiceUrls) {
            operatorGatewayControlServiceUrls = newOperatorGatewayControlServiceUrls || operatorGatewayControlServiceUrls;
        };

        this.setAlternativeServiceUrls = function (newAlternativeServiceUrls) {
            alternativeUrls = newAlternativeServiceUrls || alternativeUrls;
        };

        this.$get = ['StandardUmoxServiceUrl', 'OperatorGatewayControlServiceUrl', 'CustomServiceUrl', function (StandardUmoxServiceUrl, OperatorGatewayControlServiceUrl, CustomServiceUrl) {
            var umoxService = {};

            createServiceUrls(umoxServiceUrls);
            createServiceUrls(operatorGatewayControlServiceUrls);
            
            function createServiceUrls(serviceUrls) {
                for (var service in serviceUrls) {
                    umoxService[service] = {};
                    var serviceMethods = serviceUrls[service];
    
                    for (var i = 0; i < serviceMethods.length; i++) {
                        var method = serviceMethods[i];
                        umoxService[service][method] = createServiceUrl(service, method);
                    }
                }
    
                function createServiceUrl(service, method) {
                    if (alternativeUrls[service]) {
                        return new CustomServiceUrl(alternativeUrls[service], method);
                    }
                    else if (operatorGatewayControlServiceUrls[service]) {
                        return new OperatorGatewayControlServiceUrl(method);
                    }
                    else {
                        return new StandardUmoxServiceUrl(service, method);
                    }
                }
            }

            return umoxService;
        }];
    });

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').constant('USER_ROLES', {
    all: '*',
    empty: 'empty',
    installer: 'installer',
    intaker: 'intaker',
    subscriber : 'subscriber',
    operator : 'operator',
    caregiver : 'caregiver' 
});

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').constant('USER_TYPES', {
    subscriber : 'UT_Subscriber',
    operator : 'UT_Operator',
    intaker : 'UT_Intaker'
});

angular.module('verklizan.umox.common.html5.vkz-webrequests.general').provider('webRequestService',
    function () {
        'use strict';

        var secondsInMs = 1000;
        var defaultTimeoutInMs = 20 * secondsInMs;

        this.setTimeoutInMs = function (timeoutInMs) {
            defaultTimeoutInMs = timeoutInMs * secondsInMs;
        };

        this.$get = ['$http', '$q', '$window', 'securityTokenService', 'GenericHttpErrorHandler', function ($http, $q, $window, securityTokenService, GenericHttpErrorHandler) {
            var webRequestService = {};
            var genericErrorHandler = GenericHttpErrorHandler.createWithAllErrorCodesEnabled();

            // ============================
            // Public methods
            // ============================
            webRequestService.get = function (url, searchParameters, errorHandler, customHeaders) {
                var headerMap = {};
                FillCustomHeaders(headerMap, customHeaders);

                return $http.get(url, {
                    params: searchParameters,
                    timeout: defaultTimeoutInMs,
                    headers: headerMap
                }).catch(function (response) {
                    return handleError(response, errorHandler);
                });
            };

            webRequestService.authenticatedGet = function (url, searchParameters, errorHandler, customHeaders) {
                if (!securityTokenService.tokenIsPresent()) {
                    return getAuthorizationError(errorHandler, url);
                }

                //TODO - the loginHeader object needs to be investigated
                // The object structure doesn't match the usage
                var loginHeader = createIdentityHeader();
                FillCustomHeaders(loginHeader.headers, customHeaders);

                return $http.get(url, createGetOptions(searchParameters, loginHeader))
                    .then(renewTokenExpiration).catch(function (response) {
                        return handleError(response, errorHandler);
                    });
            };

            webRequestService.post = function (url, data, errorHandler, customHeaders) {
                var header = {};
                addTimeoutHeader(header);

                // Add other custom headers if needed
                FillCustomHeaders(header, customHeaders);

                return $http.post(url, data, { headers: header }).catch(function (response) {
                    return handleError(response, errorHandler, data);
                });
            };

            webRequestService.authenticatedPost = function (url, data, errorHandler, customHeaders) {
                if (!securityTokenService.tokenIsPresent()) {
                    return getAuthorizationError(errorHandler, url);
                }

                var loginHeader = createIdentityHeader();
                addTimeoutHeader(loginHeader);

                FillCustomHeaders(loginHeader.headers, customHeaders);

                return $http.post(url, data, loginHeader).then(function (response) {
                    renewTokenExpiration();
                    return getResultOfResponse(response);
                }).catch(function (response) {
                    return handleError(response, errorHandler, data);
                });
            };

            webRequestService.authenticatedDownloadPost = function (url, data, errorHandler, customHeaders) {
                if (!securityTokenService.tokenIsPresent()) {
                    return getAuthorizationError(errorHandler, url);
                }

                var loginHeader = createIdentityHeader();
                addTimeoutHeader(loginHeader);
                addDownloadHeader(loginHeader);
                FillCustomHeaders(loginHeader.headers, customHeaders);

                return $http.post(url, data, loginHeader).then(function (response) {
                    renewTokenExpiration();
                    return getResultOfResponse(response);
                }).catch(function (response) {
                    return handleError(response, errorHandler, data);
                });
            };

            // ============================
            // Private methods
            // ============================
            function FillCustomHeaders(headerMap, customHeaders) {
                if (customHeaders) {
                    for (var header in customHeaders) {
                        headerMap[header] = customHeaders[header];
                    }
                }

                return headerMap;
            }

            function createGetOptions(searchParams, headers) {
                var options = {
                    params: searchParams, timeout: defaultTimeoutInMs
                };

                if (headers) {
                    options.headers = headers;
                }

                return options;
            }

            function createIdentityHeader() {
                var securityToken = securityTokenService.getToken();

                return {
                    headers: {
                        Identity: securityToken
                    }
                };
            }

            function addTimeoutHeader(header) {
                header.timeout = defaultTimeoutInMs;
                return header;
            }

            function addDownloadHeader(header) {
                header.responseType = 'arraybuffer'
                return header;
            }

            function handleError(response, errorHandler, data) {
                errorHandler = useAlternativeErrorHandlerWhenNotPresent(errorHandler);

                return errorHandler.handleError(response, data);
            }

            var renewTokenExpiration = function (response) {
                securityTokenService.renewTokenExpiration();
                return response;
            };

            var getResultOfResponse = function (response) {
                var result = null;

                if (!$window.isNullOrUndefined(response.data)) {
                    for (var propertyName in response.data) {
                        if (propertyName.endsWith("Result")) {
                            result = response.data[propertyName];
                        }
                    }
                }

                if (window.isNullOrUndefined(result)) {
                    result = response;
                }

                return result;
            };

            function getAuthorizationError(errorHandler, serviceUrl) {
                errorHandler = useAlternativeErrorHandlerWhenNotPresent(errorHandler);

                return errorHandler.handleAuthorizationError(serviceUrl);
            }

            function useAlternativeErrorHandlerWhenNotPresent(errorHandler) {
                return errorHandler || genericErrorHandler;
            }

            return webRequestService;
        }];
    }
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('appointmentManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";
        return {
            readCurrentBlockingAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readCurrentBlockingAppointment,
                serviceRequestBodyFactory.createParameteredBody('calendarOwnerType', 'calendarOwnerId'),
                authorizationTaskConstants.appointment_read
            ),
            createRecurringAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.createRecurringAppointment,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointment', 'singleAppointmentId'),
                authorizationTaskConstants.appointment_create
            ),
            createSingleAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.createSingleAppointment,
                serviceRequestBodyFactory.createParameteredBody('singleAppointment'),
                authorizationTaskConstants.appointment_create
            ),
            readAppointmentPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readAppointmentPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointment_read
            ),
            readAppointmentTypePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readAppointmentTypePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointmentType_read
            ),
            readRecurringAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readRecurringAppointment,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointmentId'),
                authorizationTaskConstants.appointment_read
            ),
            readRecurringAppointmentOccurrence: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readRecurringAppointmentOccurrence,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointmentId', 'recurrenceIndex'),
                authorizationTaskConstants.appointment_read
            ),
            readSingleAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readSingleAppointment,
                serviceRequestBodyFactory.createParameteredBody('singleAppointmentId'),
                authorizationTaskConstants.appointment_read
            ),
            updateRecurringAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.updateRecurringAppointment,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointment'),
                authorizationTaskConstants.appointment_update
            ),
            updateRecurringAppointmentOccurrence: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.updateRecurringAppointmentOccurrence,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointmentOccurrence'),
                authorizationTaskConstants.appointment_update
            ),
            updateSingleAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.updateSingleAppointment,
                serviceRequestBodyFactory.createParameteredBody('singleAppointment'),
                authorizationTaskConstants.appointment_update
            ),
            deleteRecurringAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.deleteRecurringAppointment,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointment'),
                authorizationTaskConstants.appointment_delete
            ),
            deleteRecurringAppointmentOccurrence: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.deleteRecurringAppointmentOccurrence,
                serviceRequestBodyFactory.createParameteredBody('recurringAppointmentId', 'recurrenceIndex'),
                authorizationTaskConstants.appointment_delete
            ),
            deleteSingleAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.deleteSingleAppointment,
                serviceRequestBodyFactory.createParameteredBody('singleAppointment'),
                authorizationTaskConstants.appointment_delete
            ),
            readCallBackAppointmentPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.appointmentManagementService.readCallBackAppointmentPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointment_read
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('auditTrailServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";
        return {
            readAuditPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.auditTrailService.readAuditPage,
                serviceRequestBodyFactory.createSimplePageBody, //Sort should be empty
                authorizationTaskConstants.audit_read
            ),
			readEntityAuditPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.auditTrailService.readEntityAuditPage,
				serviceRequestBodyFactory.createParameteredBody('entityTypeName', 'entityId', 'filters', 'sort', 'pageDescriptor'), //Sort should be empty
				authorizationTaskConstants.audit_read
			),
			readAuditChangePage : umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.auditTrailService.readAuditChangePage,
				serviceRequestBodyFactory.createParameteredBody('entityTypeName', 'entityId', 'auditLogIds', 'filters', 'sort', 'pageDescriptor'), //Note filters and sort should be empty.
				authorizationTaskConstants.audit_read
			),            
            readAccountabilityInfo: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.auditTrailService.readAccountabilityInfo,
                serviceRequestBodyFactory.createParameteredBody('entityTypeName', 'entityId'),
                authorizationTaskConstants.audit_read
            )

        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('careProviderManagementServiceProxy',
	['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function(umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
		"use strict";

		return {
			//CaregiverGroup
			createCaregiverGroupWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverGroupWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiverGroup'),
				authorizationTaskConstants.caregiverGroup_create
			),
			searchCaregiverGroups: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.searchCaregiverGroups,
				serviceRequestBodyFactory.createSearchPageBody,
				authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupPage,
				serviceRequestBodyFactory.createSimplePageBody,
				authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupVisualViewInformation,
				serviceRequestBodyFactory.createParameteredBody('caregiverGroupId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupDto,
				serviceRequestBodyFactory.createParameteredBody('caregiverGroupId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			updateCaregiverGroupWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateCaregiverGroupWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiverGroupDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			readCaregiverGroupMembersPage: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.readCaregiverGroupMembersPage,
			    serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
			    authorizationTaskConstants.caregiver_read
			),
			createCaregiverGroupMemberLink: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createCaregiverGroupMemberLink,
			    serviceRequestBodyFactory.createParameteredBody('caregiverGroupId', 'caregiverId'),
			    authorizationTaskConstants.caregiverGroup_update
			),
			deleteCaregiverGroupsWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.deleteCaregiverGroupsWithDto,
                serviceRequestBodyFactory.createParameteredBody('caregiverGroupsToDelete'),
                authorizationTaskConstants.caregiverGroup_delete
            ),
			deleteCaregiverGroupMemberLink: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.deleteCaregiverGroupMemberLink,
			    serviceRequestBodyFactory.createParameteredBody('caregiverGroupId', 'caregiverId'),
			    authorizationTaskConstants.caregiverGroup_update
			),
	
			readCaregiverGroupHolidayPage: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.readCaregiverGroupHolidayPage,
			    serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
			    authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.readCaregiverGroupHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holidayId'),
			    authorizationTaskConstants.caregiverGroup_read
			),
			createCaregiverGroupHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createCaregiverGroupHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.caregiverGroup_update
			),
			updateCaregiverGroupHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.updateCaregiverGroupHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.caregiverGroup_update
			),
			deleteCaregiverGroupHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.deleteCaregiverGroupHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.caregiverGroup_update
			),
			createCaregiverGroupHolidayList: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createCaregiverGroupHolidayList,
			    serviceRequestBodyFactory.createParameteredBody('holidayList'),
			    authorizationTaskConstants.caregiverGroup_update
			),

			createCaregiverGroupPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverGroupPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			createCaregiverGroupPhoneNumberListWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverGroupPhoneNumberListWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberListDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			readCaregiverGroupPhoneNumberDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupPhoneNumberDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupPhoneNumberDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupPhoneNumberDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			updateCaregiverGroupPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateCaregiverGroupPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			deleteCaregiverGroupPhoneNumber: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteCaregiverGroupPhoneNumber,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.caregiverGroup_update
			),

			createCaregiverGroupNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverGroupNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			createCaregiverGroupNoteListWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverGroupNoteListWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteListDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			readCaregiverGroupNoteDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupNoteDto,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			readCaregiverGroupNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverGroupNoteDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
				authorizationTaskConstants.caregiverGroup_read
			),
			updateCaregiverGroupNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateCaregiverGroupNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteDto'),
				authorizationTaskConstants.caregiverGroup_update
			),
			deleteCaregiverGroupNote: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteCaregiverGroupNote,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.caregiverGroup_update
			),
			
			//CaregiverType
			readCaregiverTypePage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverTypePage,
				serviceRequestBodyFactory.createSimplePageBody,
				authorizationTaskConstants.caregiverType_read
			),
			readCaregiverType: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverType,
				serviceRequestBodyFactory.createParameteredBody('caregiverTypeId'),
				authorizationTaskConstants.caregiverType_read
			),
			createCaregiverType: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCaregiverType,
				serviceRequestBodyFactory.createParameteredBody('caregiverType'),
				authorizationTaskConstants.caregiverType_create
			),
			updateCaregiverType: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateCaregiverType,
				serviceRequestBodyFactory.createParameteredBody('caregiverType'),
				authorizationTaskConstants.caregiverType_update
			),
			deleteCaregiverType: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteCaregiverType,
				serviceRequestBodyFactory.createParameteredBody('caregiverType'),
				authorizationTaskConstants.caregiverType_delete
			),

			//Caregiver
			readCaregiversForSubscriberPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForSubscriberPage,
				serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiversForSubscriberTemplatePage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForSubscriberTemplatePage,
				serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiversForResidencePage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForResidencePage,
				serviceRequestBodyFactory.createComplexPageBody('residenceId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiversForSchemePage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForSchemePage,
				serviceRequestBodyFactory.createComplexPageBody('schemeId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiversForSchemeResidencesPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForSchemeResidencesPage,
				serviceRequestBodyFactory.createComplexPageBody('schemeId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiversForSubscriberResidenceSchemePage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiversForSubscriberResidenceSchemePage,
				serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
				authorizationTaskConstants.caregiver_read
			),
			readCaregiverVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCaregiverVisualViewInformation,
				serviceRequestBodyFactory.createParameteredBody('caregiverId'),
				authorizationTaskConstants.caregiver_read
			),


			//ProfessionalCaregiver 
			searchProfessionalCaregivers: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.searchProfessionalCaregivers,
				serviceRequestBodyFactory.createSearchPageBody,
				authorizationTaskConstants.caregiver_read
			),
			readProfessionalCaregiverPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverPage,
				serviceRequestBodyFactory.createSimplePageBody,
				authorizationTaskConstants.caregiver_read
			),
			readProfessionalCaregiverContactItemPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverContactItemPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			createProfessionalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiver'),
				authorizationTaskConstants.professionalCaregiver_create
			),
			readProfessionalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiverId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			updateProfessionalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateProfessionalCaregiverWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiver'),
				authorizationTaskConstants.professionalCaregiver_update
			),
            deleteProfessionalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.deleteProfessionalCaregiverWithDto,
                serviceRequestBodyFactory.createParameteredBody('caregiverId'),
                authorizationTaskConstants.professionalCaregiver_delete
            ),
			deleteAndReplaceProfessionalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.deleteAndReplaceProfessionalCaregiverWithDto,
                serviceRequestBodyFactory.createParameteredBody('caregiversToDelete', 'replaceProfessionalCaregiverId'),
                authorizationTaskConstants.professionalCaregiver_delete
			),
			
			createProfessionalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('note'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			createProfessionalCaregiverNoteList: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverNoteList,
				serviceRequestBodyFactory.createParameteredBody('noteList'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			readProfessionalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			readProfessionalCaregiverNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverNoteDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			updateProfessionalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateProfessionalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('note'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			deleteProfessionalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteProfessionalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.professionalCaregiver_update
			),

			createProfessionalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumber'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			readProfessionalCaregiverPhoneNumberDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverPhoneNumberDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			readProfessionalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.professionalCaregiver_read
			),
			updateProfessionalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateProfessionalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumber'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			deleteProfessionalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteProfessionalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.professionalCaregiver_update
			),
			createProfessionalCaregiverPhoneNumberList: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverPhoneNumberList,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberList'),
				authorizationTaskConstants.professionalCaregiver_update
			),

			createProfessionalCaregiverAvailability: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverAvailability,
                serviceRequestBodyFactory.createParameteredBody('caregiverId', 'availability'),
                authorizationTaskConstants.professionalCaregiver_create
            ),
			readProfessionalCaregiverAvailability: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverAvailability,
				serviceRequestBodyFactory.createParameteredBody('caregiverId'),
				authorizationTaskConstants.professionalCaregiver_read
			),

			readProfessionalCaregiverHolidayPage: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverHolidayPage,
			    serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
			    authorizationTaskConstants.professionalCaregiver_read
			),
			readProfessionalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.readProfessionalCaregiverHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holidayId'),
			    authorizationTaskConstants.professionalCaregiver_read
			),
			createProfessionalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.professionalCaregiver_update
			),
			updateProfessionalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.updateProfessionalCaregiverHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.professionalCaregiver_update
			),
			deleteProfessionalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.deleteProfessionalCaregiverHoliday,
			    serviceRequestBodyFactory.createParameteredBody('holiday'),
			    authorizationTaskConstants.professionalCaregiver_delete
			),
			createProfessionalCaregiverHolidayList: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createProfessionalCaregiverHolidayList,
			    serviceRequestBodyFactory.createParameteredBody('holidayList'),
			    authorizationTaskConstants.professionalCaregiver_update
			),


			//RelationalCaregiver
			readRelationalCaregiverContactItemPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverContactItemPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			createRelationalCaregiverForSubscriberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createRelationalCaregiverForSubscriberWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiver', 'subscriberId', 'order', 'isNextOfKin'),
				authorizationTaskConstants.relationalCaregiver_create
			),
			readRelationalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiverId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			updateRelationalCaregiverWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateRelationalCaregiverWithDto,
				serviceRequestBodyFactory.createParameteredBody('caregiver'),
				authorizationTaskConstants.relationalCaregiver_update
			),

			createRelationalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createRelationalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('note'),
				authorizationTaskConstants.relationalCaregiver_update
			),
			createRelationalCaregiverNoteList: umoOperationFactory.createSecureProxyOperation(
			    umoxServiceUrls.careProviderManagementService.createRelationalCaregiverNoteList,
			    serviceRequestBodyFactory.createParameteredBody('noteList'),
			    authorizationTaskConstants.relationalCaregiver_update
			),
			readRelationalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			readRelationalCaregiverNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverNoteDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			updateRelationalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateRelationalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('note'),
				authorizationTaskConstants.relationalCaregiver_update
			),
			deleteRelationalCaregiverNoteWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteRelationalCaregiverNoteWithDto,
				serviceRequestBodyFactory.createParameteredBody('noteId'),
				authorizationTaskConstants.relationalCaregiver_update
			),

			createRelationalCaregiverPhoneNumberList: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createRelationalCaregiverPhoneNumberList,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberList'),
				authorizationTaskConstants.relationalCaregiver_update
			),
			createRelationalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createRelationalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumber'),
				authorizationTaskConstants.relationalCaregiver_update
			),
			readRelationalCaregiverPhoneNumberDtoPage: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverPhoneNumberDtoPage,
				serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			readRelationalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.relationalCaregiver_read
			),
			updateRelationalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.updateRelationalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumber'),
				authorizationTaskConstants.relationalCaregiver_update
			),
			deleteRelationalCaregiverPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.deleteRelationalCaregiverPhoneNumberWithDto,
				serviceRequestBodyFactory.createParameteredBody('phoneNumberId'),
				authorizationTaskConstants.relationalCaregiver_update
			),

			createRelationalCaregiverAvailability: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createRelationalCaregiverAvailability,
				serviceRequestBodyFactory.createParameteredBody('caregiverId', 'availability'),
				authorizationTaskConstants.relationalCaregiver_create
			),
			readRelationalCaregiverAvailability: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readRelationalCaregiverAvailability,
				serviceRequestBodyFactory.createParameteredBody('caregiverId'),
				authorizationTaskConstants.relationalCaregiver_read
			),

		    readRelationalCaregiverHolidayPage: umoOperationFactory.createSecureProxyOperation(
		        umoxServiceUrls.careProviderManagementService.readRelationalCaregiverHolidayPage,
		        serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
		        authorizationTaskConstants.relationalCaregiver_read
		    ),
		    readRelationalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
		        umoxServiceUrls.careProviderManagementService.readRelationalCaregiverHoliday,
		        serviceRequestBodyFactory.createParameteredBody('holidayId'),
		        authorizationTaskConstants.relationalCaregiver_read
		    ),
		    createRelationalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
		        umoxServiceUrls.careProviderManagementService.createRelationalCaregiverHoliday,
		        serviceRequestBodyFactory.createParameteredBody('holiday'),
		        authorizationTaskConstants.relationalCaregiver_update
		    ),
		    updateRelationalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
		        umoxServiceUrls.careProviderManagementService.updateRelationalCaregiverHoliday,
		        serviceRequestBodyFactory.createParameteredBody('holiday'),
		        authorizationTaskConstants.relationalCaregiver_update
		    ),
		    deleteRelationalCaregiverHoliday: umoOperationFactory.createSecureProxyOperation(
		        umoxServiceUrls.careProviderManagementService.deleteRelationalCaregiverHoliday,
		        serviceRequestBodyFactory.createParameteredBody('holiday'),
		        authorizationTaskConstants.relationalCaregiver_delete
		    ),
            createRelationalCaregiverHolidayList: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.createRelationalCaregiverHolidayList,
                serviceRequestBodyFactory.createParameteredBody('holidayList'),
                authorizationTaskConstants.relationalCaregiver_update
            ),

			//CareProvider
			isPinIdUnique: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.careProviderManagementService.isPinIdUnique,
                serviceRequestBodyFactory.createParameteredBody('pinId', 'ignoreId'),
                authorizationTaskConstants.caregiver_read
            ),
			createCareProviderAvailability: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.createCareProviderAvailability,
				serviceRequestBodyFactory.createParameteredBody('careProviderId', 'availability'),
				authorizationTaskConstants.relationalCaregiver_create + ',' +
				authorizationTaskConstants.professionalCaregiver_create + ',' +
				authorizationTaskConstants.caregiverGroup_create
			),
			readCareProviderAvailability: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.careProviderManagementService.readCareProviderAvailability,
				serviceRequestBodyFactory.createParameteredBody('careProviderId'),
				authorizationTaskConstants.relationalCaregiver_read + ',' +
				authorizationTaskConstants.professionalCaregiver_read + ',' +
				authorizationTaskConstants.caregiverGroup_read + ',' +
				authorizationTaskConstants.caregiver_read
			)

		};
	}]);
angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('contractManagementServiceProxy',
['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
    "use strict";

    return {

        createTerminationReason: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createTerminationReason,
            serviceRequestBodyFactory.createParameteredBody('terminationReason'),
            authorizationTaskConstants.terminationReason_create
        ),
        readTerminationReason: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readTerminationReason,
            serviceRequestBodyFactory.createParameteredBody('terminationReasonId'),
            authorizationTaskConstants.terminationReason_read
        ),
        updateTerminationReason: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateTerminationReason,
            serviceRequestBodyFactory.createParameteredBody('terminationReason'),
            authorizationTaskConstants.terminationReason_update
        ),
        deleteTerminationReason: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteTerminationReason,
            serviceRequestBodyFactory.createParameteredBody('terminationReason'),
            authorizationTaskConstants.terminationReason_delete
        ),
        readTerminationReasonPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readTerminationReasonPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.terminationReason_read
        ),
        createPaymentMethod: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createPaymentMethod,
            serviceRequestBodyFactory.createParameteredBody('paymentMethod'),
            authorizationTaskConstants.paymentMethod_create
        ),
        readPaymentMethod: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readPaymentMethod,
            serviceRequestBodyFactory.createParameteredBody('paymentMethodId'),
            authorizationTaskConstants.paymentMethod_read
        ),
        updatePaymentMethod: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updatePaymentMethod,
            serviceRequestBodyFactory.createParameteredBody('paymentMethod'),
            authorizationTaskConstants.paymentMethod_update
        ),
        deletePaymentMethod: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deletePaymentMethod,
            serviceRequestBodyFactory.createParameteredBody('paymentMethod'),
            authorizationTaskConstants.paymentMethod_delete
        ),
        readPaymentMethodPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readPaymentMethodPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.paymentMethod_read
        ),

        readSubscriberPeriodicalCostPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberPeriodicalCostPage,
            serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
            authorizationTaskConstants.subscriber_read
        ),
        readSubscriberNonPeriodicalCostPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberNonPeriodicalCostPage,
            serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
            authorizationTaskConstants.subscriber_read
        ),

        createVATTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createVATTariff,
            serviceRequestBodyFactory.createParameteredBody('vatTariff'),
            authorizationTaskConstants.vatTariff_create
        ),
        readVATTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readVATTariff,
            serviceRequestBodyFactory.createParameteredBody('vatTariffId'),
            authorizationTaskConstants.vatTariff_read
        ),
        updateVATTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateVATTariff,
            serviceRequestBodyFactory.createParameteredBody('vatTariff'),
            authorizationTaskConstants.vatTariff_update
        ),
        deleteVATTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteVATTariff,
            serviceRequestBodyFactory.createParameteredBody('vatTariff'),
            authorizationTaskConstants.vatTariff_delete
        ),
        readVATTariffPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readVATTariffPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.vatTariff_read
        ),

        createTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createTariff,
            serviceRequestBodyFactory.createParameteredBody('tariff'),
            authorizationTaskConstants.tariff_create
        ),
        readTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readTariff,
            serviceRequestBodyFactory.createParameteredBody('tariffId'),
            authorizationTaskConstants.tariff_read
        ),
        updateTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateTariff,
            serviceRequestBodyFactory.createParameteredBody('tariff'),
            authorizationTaskConstants.tariff_update
        ),
        deleteTariff: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteTariff,
            serviceRequestBodyFactory.createParameteredBody('tariff'),
            authorizationTaskConstants.tariff_delete
        ),
        readTariffPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readTariffPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.tariff_read
        ),

        createPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('periodicalCost'),
            authorizationTaskConstants.periodicalCost_create
        ),
        readPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('periodicalCostId'),
            authorizationTaskConstants.periodicalCost_read
        ),
        updatePeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updatePeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('periodicalCost'),
            authorizationTaskConstants.periodicalCost_update
        ),
        deletePeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deletePeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('periodicalCost'),
            authorizationTaskConstants.periodicalCost_delete
        ),
        readPeriodicalCostPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readPeriodicalCostPage,
            serviceRequestBodyFactory.createComplexPageBody('tariffId'),
            authorizationTaskConstants.periodicalCost_read
        ),

        createNonPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createNonPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('nonPeriodicalCost'),
            authorizationTaskConstants.nonPeriodicalCost_create
        ),
        readNonPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readNonPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('nonPeriodicalCostId'),
            authorizationTaskConstants.nonPeriodicalCost_read
        ),
        updateNonPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateNonPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('nonPeriodicalCost'),
            authorizationTaskConstants.nonPeriodicalCost_update
        ),
        deleteNonPeriodicalCost: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteNonPeriodicalCost,
            serviceRequestBodyFactory.createParameteredBody('nonPeriodicalCost'),
            authorizationTaskConstants.nonPeriodicalCost_delete
        ),
        readNonPeriodicalCostPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readNonPeriodicalCostPage,
            serviceRequestBodyFactory.createComplexPageBody('tariffId'),
            authorizationTaskConstants.nonPeriodicalCost_read
        ),

        createSubscriberDeviceLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createSubscriberDeviceLink,
            serviceRequestBodyFactory.createParameteredBody('subscriberId', 'deviceId', 'newDeviceStateId', 'isDirect'),
            authorizationTaskConstants.contract_update
        ),
        createSubscriberDeviceDtoLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createSubscriberDeviceDtoLink,
            serviceRequestBodyFactory.createParameteredBody('subscriberId', 'updatedDevice', 'isDirect'),
            authorizationTaskConstants.contract_update
        ),
        deleteSubscriberDeviceLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteSubscriberDeviceLink,
            serviceRequestBodyFactory.createParameteredBody('subscriberId', 'deviceId', 'newDeviceStateId'),
            authorizationTaskConstants.contract_update
        ),
        deleteSubscriberDeviceDtoLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteSubscriberDeviceDtoLink,
            serviceRequestBodyFactory.createParameteredBody('subscriberId', 'updatedDevice'),
            authorizationTaskConstants.contract_update
        ),
        createResidenceDeviceLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createResidenceDeviceLink,
            serviceRequestBodyFactory.createParameteredBody('residenceId', 'deviceId', 'newDeviceStateId', 'isDirect'),
            authorizationTaskConstants.contract_update
        ),
        createResidenceDeviceDtoLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createResidenceDeviceDtoLink,
            serviceRequestBodyFactory.createParameteredBody('residenceId', 'updatedDevice', 'isDirect'),
            authorizationTaskConstants.contract_update
        ),
        deleteResidenceDeviceLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteResidenceDeviceLink,
            serviceRequestBodyFactory.createParameteredBody('residenceId', 'deviceId', 'newDeviceStateId'),
            authorizationTaskConstants.contract_update
        ),
        deleteResidenceDeviceDtoLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteResidenceDeviceDtoLink,
            serviceRequestBodyFactory.createParameteredBody('residenceId', 'updatedDevice'),
            authorizationTaskConstants.contract_update
        ),
        getSubscriberCostInfo: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.getSubscriberCostInfo,
            serviceRequestBodyFactory.createParameteredBody('subscriberId'),
            authorizationTaskConstants.subscriber_read
        ),

        //periodicalCostDto
        readPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.contractManagementService.readPeriodicalCostDto,
                serviceRequestBodyFactory.createParameteredBody('periodicalCostId'),
                authorizationTaskConstants.periodicalCost_read
        ),
        readPeriodicalCostDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.contractManagementService.readPeriodicalCostDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('tariffId'),
                authorizationTaskConstants.periodicalCost_read
        ),

        //nonPeriodicalCostDto
        readNonPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.contractManagementService.readNonPeriodicalCostDto,
                serviceRequestBodyFactory.createParameteredBody('nonPeriodicalCostId'),
                authorizationTaskConstants.nonPeriodicalCost_read
        ),
        readNonPeriodicalCostDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.contractManagementService.readNonPeriodicalCostDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('tariffId'),
                authorizationTaskConstants.nonPeriodicalCost_read
        ),



        //consumerPeriodicalCostDto
        readSubscriberPeriodicalCostDtoPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberPeriodicalCostDtoPage,
            serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
            authorizationTaskConstants.subscriber_read
        ),
        readSubscriberPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberPeriodicalCostDto,
            serviceRequestBodyFactory.createComplexPageBody('subscriberPeriodicalCostId'),
            authorizationTaskConstants.subscriber_read
        ),
        updateSubscriberPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateSubscriberPeriodicalCostDto,
            serviceRequestBodyFactory.createParameteredBody('subscriberPeriodicalCostDto'),
            authorizationTaskConstants.subscriber_update
        ),


        //consumerNonPeriodicalCostDto
        createSubscriberNonPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.createSubscriberNonPeriodicalCostDto,
            serviceRequestBodyFactory.createParameteredBody("subscriberId", 'subscriberNonPeriodicalCostDto'),
            authorizationTaskConstants.subscriber_update
        ),
        readSubscriberNonPeriodicalCostDtoPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberNonPeriodicalCostDtoPage,
            serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
            authorizationTaskConstants.subscriber_read
        ),
        readSubscriberNonPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.readSubscriberNonPeriodicalCostDto,
            serviceRequestBodyFactory.createComplexPageBody('subscriberNonPeriodicalCostId'),
            authorizationTaskConstants.subscriber_read
        ),
        updateSubscriberNonPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.updateSubscriberNonPeriodicalCostDto,
            serviceRequestBodyFactory.createParameteredBody('subscriberNonPeriodicalCostDto'),
            authorizationTaskConstants.subscriber_update
        ),
        deleteSubscriberNonPeriodicalCostDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.contractManagementService.deleteSubscriberNonPeriodicalCostDto,
            serviceRequestBodyFactory.createParameteredBody('subscriberNonPeriodicalCostDtoId'),
            authorizationTaskConstants.subscriber_update
        ),
    };
}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('debugServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            createTrace: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.debugService.createClientDataTraces,
                serviceRequestBodyFactory.createParameteredBody('traceDataList'),
                authorizationTaskConstants.debugService_createTraceLog
            ),
            readLoginTrailPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.debugService.readLoginTrailPageDto,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.debugService_readLoginTrailPage
            ),
            readTraceLogPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.debugService.readTraceLogPageDto,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.debugService_readTraceLogPage
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('deviceManagementServiceProxy',
['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
    "use strict";

    return {
        readDevice : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDevice,
            serviceRequestBodyFactory.createParameteredBody('homeUnitId'),
            authorizationTaskConstants.device_read
        ),
        readSimpleDevicePage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readSimpleDevicePage,
            serviceRequestBodyFactory.createComplexPageBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readSimpleDevicesForDevicePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readSimpleDevicesForDevicePage,
            serviceRequestBodyFactory.createComplexPageBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readDeviceServiceTaskPage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceServiceTaskPage,
            serviceRequestBodyFactory.createComplexPageBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readDeviceRepairPage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceRepairPage,
            serviceRequestBodyFactory.createComplexPageBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readDeviceInfoVisualView : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceInfoVisualView,
            serviceRequestBodyFactory.createParameteredBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readDeviceRowDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceRowDto,
            serviceRequestBodyFactory.createParameteredBody('deviceId'),
            authorizationTaskConstants.device_read
        ),
        readDevicePage : umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDevicePage,
			serviceRequestBodyFactory.createSimplePageBody,
			authorizationTaskConstants.device_read
		),
		searchDevice : umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.searchDevice,
			serviceRequestBodyFactory.createSearchPageBody,
			authorizationTaskConstants.device_create
		),
		readDevicePageForSchemeResidences: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDevicePageForSchemeResidences,
			serviceRequestBodyFactory.createComplexPageBody('schemeId'),
			authorizationTaskConstants.device_read
		),
		readDevicesForSubscriberResidencePage: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDevicesForSubscriberResidencePage,
			serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
			authorizationTaskConstants.device_read
		),
		readDeviceStatePage : umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDeviceStatePage,
			serviceRequestBodyFactory.createSimplePageBody,
			authorizationTaskConstants.deviceState_read
		),
		createDeviceState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createDeviceState,
            serviceRequestBodyFactory.createParameteredBody('deviceState'),
            authorizationTaskConstants.deviceState_create
        ),
		readDeviceState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceState,
            serviceRequestBodyFactory.createParameteredBody('deviceStateId'),
            authorizationTaskConstants.deviceState_read
        ),
		updateDeviceState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.updateDeviceState,
            serviceRequestBodyFactory.createParameteredBody('deviceState'),
            authorizationTaskConstants.deviceState_update
        ),
		deleteDeviceState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.deleteDeviceState,
            serviceRequestBodyFactory.createParameteredBody('deviceState'),
            authorizationTaskConstants.deviceState_delete
        ),
		readSubscriberDevices: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readSubscriberDevices,
			serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
			authorizationTaskConstants.device_read
		),
        createDeviceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createDeviceType,
            serviceRequestBodyFactory.createParameteredBody('deviceType'),
            authorizationTaskConstants.deviceType_create
        ),
        readDeviceType : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceType,
            serviceRequestBodyFactory.createParameteredBody('deviceTypeId'),
            authorizationTaskConstants.deviceType_read
        ),
        updateDeviceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.updateDeviceType,
            serviceRequestBodyFactory.createParameteredBody('deviceType'),
            authorizationTaskConstants.deviceType_update
        ),
        deleteDeviceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.deleteDeviceType,
            serviceRequestBodyFactory.createParameteredBody('deviceType'),
            authorizationTaskConstants.deviceType_delete
        ),
        readDeviceTypePage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.deviceType_read
        ),
        readDeviceManagerPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceManagerPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.deviceManager_read
        ),
        validateHomeUnitPropertiesForUI: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.validateHomeUnitPropertiesForUI,
            serviceRequestBodyFactory.createParameteredBody('homeUnit'),
            authorizationTaskConstants.device_read
        ),
        readDevicesForResidencePage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDevicesForResidencePage,
            serviceRequestBodyFactory.createComplexPageBody('residenceId'),
            authorizationTaskConstants.device_read
        ),
        readDevicesForSubscriberPage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDevicesForSubscriberPage,
            serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
            authorizationTaskConstants.device_read
        ),
        readTechniciansForDevicePage : umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readTechniciansForDevicePage,
            serviceRequestBodyFactory.createComplexPageBody('deviceId'),
            authorizationTaskConstants.device_read //TODO replace with maybe technicians_read ??
        ),
        readDeviceCharacteristicRowDtoPage: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDeviceCharacteristicRowDtoPage,
			serviceRequestBodyFactory.createComplexPageBody('deviceId'),
			authorizationTaskConstants.device_read
        ),
        readDeviceStateHistoryPage: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.deviceManagementService.readDeviceStateHistoryPage,
			serviceRequestBodyFactory.createComplexPageBody('deviceId'),
			authorizationTaskConstants.device_read //trying to force another build
        ),
        readHomeUnitWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readHomeUnitWithDto,
            serviceRequestBodyFactory.createParameteredBody('homeUnitId'),
            authorizationTaskConstants.device_read
        ),
        createHomeUnitWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createHomeUnitWithDto,
            serviceRequestBodyFactory.createParameteredBody('homeUnitDto'),
            authorizationTaskConstants.device_create
        ),
        updateHomeUnitWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.updateHomeUnitWithDto,
            serviceRequestBodyFactory.createParameteredBody('homeUnitDto'),
            authorizationTaskConstants.device_update
        ),
        deleteHomeUnitWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.deleteHomeUnitWithDto,
            serviceRequestBodyFactory.createParameteredBody('homeUnitId'),
            authorizationTaskConstants.device_delete
        ),
        getCodeOfHomeUnitWithPhoneNumber: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.getCodeOfHomeUnitWithPhoneNumber,
            serviceRequestBodyFactory.createParameteredBody('phoneNumber', 'ignoreDeviceId'),
            authorizationTaskConstants.device_update
        ),

        createDeviceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createDeviceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristic'),
            authorizationTaskConstants.device_update
        ),
        createDeviceCharacteristicList: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createDeviceCharacteristicList,
            serviceRequestBodyFactory.createParameteredBody('characteristicList'),
            authorizationTaskConstants.device_update
        ),
        readDeviceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristicId'),
            authorizationTaskConstants.device_read
        ),
        updateDeviceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.updateDeviceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristic'),
            authorizationTaskConstants.device_update
        ),
        deleteDeviceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.deleteDeviceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristicId'),
            authorizationTaskConstants.device_delete
        ),
        readClientInfoDeviceVisualView: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readClientInfoDeviceVisualView,
            serviceRequestBodyFactory.createParameteredBody('deviceId'),
            authorizationTaskConstants.device_read
        ),

        createDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.createDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('deviceControl'),
            authorizationTaskConstants.deviceControl_create
        ),
        readDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('deviceControlId'),
            authorizationTaskConstants.deviceControl_read
        ),
        updateDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.updateDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('deviceControl'),
            authorizationTaskConstants.deviceControl_update
        ),
        deleteDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.deleteDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('deviceControlId'),
            authorizationTaskConstants.deviceControl_delete
        ),
        readDeviceControlPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.deviceManagementService.readDeviceControlPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.deviceControl_read
        )
    };
}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('incidentManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            countIncidentRows: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.countIncidentRows,
                serviceRequestBodyFactory.createParameteredBody('filters'),
                authorizationTaskConstants.incident_read
            ),
            createEventType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.createEventType,
                serviceRequestBodyFactory.createParameteredBody('eventType'),
                authorizationTaskConstants.eventType_create
            ),
            readEventType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readEventType,
                serviceRequestBodyFactory.createParameteredBody('eventTypeId'),
                authorizationTaskConstants.eventType_read
            ),
            updateEventType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.updateEventType,
                serviceRequestBodyFactory.createParameteredBody('eventType'),
                authorizationTaskConstants.eventType_update
            ),
            deleteEventType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.deleteEventType,
                serviceRequestBodyFactory.createParameteredBody('eventType'),
                authorizationTaskConstants.eventType_delete
            ),
            readEventTypePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readEventTypePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.eventType_read
            ),
            readIncidentPageForSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentPageForSubscriber,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentPageForResidenceSubscribers: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentPageForResidenceSubscribers,
                serviceRequestBodyFactory.createComplexPageBody('residenceId'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentPageForSchemeSubscribers: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentPageForSchemeSubscribers,
                serviceRequestBodyFactory.createComplexPageBody('schemeId'),
                authorizationTaskConstants.incident_read
            ),
            readIncident: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncident,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentDto,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentWithDto,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentPage,
                serviceRequestBodyFactory.createComplexPageBody('includeCount'),
                authorizationTaskConstants.incident_read
            ),
            readIncidentKindPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentKindPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.incidentKind_read
            ),
            createIncidentKind: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.createIncidentKind,
                serviceRequestBodyFactory.createParameteredBody('incidentKind'),
                authorizationTaskConstants.incidentKind_create
            ),
            readIncidentKind: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentKind,
                serviceRequestBodyFactory.createParameteredBody('incidentKindId'),
                authorizationTaskConstants.incidentKind_read
            ),
            updateIncidentKind: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.updateIncidentKind,
                serviceRequestBodyFactory.createParameteredBody('incidentKind'),
                authorizationTaskConstants.incidentKind_update
            ),
            deleteIncidentKind: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.deleteIncidentKind,
                serviceRequestBodyFactory.createParameteredBody('incidentKind'),
                authorizationTaskConstants.incidentKind_delete
            ),
            readIncidentVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentVisualViewInformation,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.incident_read
            ),
            searchIncident: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.searchIncident,
                serviceRequestBodyFactory.createSearchPageBody,
                authorizationTaskConstants.incident_read
            ),
            readIncidentNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentNoteDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.incident_read
            ),
            readEventCharacteristicDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readEventCharacteristicDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.event_read
            ),

            readEventPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readEventPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.event_read
            ),

            readCarerEventPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readCarerEventPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.event_read
            ),

            readOperatorEventPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readOperatorEventPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.event_read
            ),

            readTraceEventPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readTraceEventPage,
                serviceRequestBodyFactory.createComplexPageBody('incidentId'),
                authorizationTaskConstants.event_read
            ),

            readIncidentPriorityPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.incidentManagementService.readIncidentPriorityPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.incidentPriority_read
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('loginServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            login: umoOperationFactory.createProxyOperationWithPassageIDHeader(
                umoxServiceUrls.loginService.login,
                serviceRequestBodyFactory.createParameteredBody('username', 'password', 'desiredModules')
            ),

            validate2FA: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.loginService.validate2FA,
                serviceRequestBodyFactory.createParameteredBody('requestSignature', 'desiredModules')
            ),

            logout: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.loginService.logout,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.none
            ),

            readCurrentUserInfo : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.loginService.readCurrentUserInfo,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.none
            ),

            buildPassageIdRedirectUri: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.loginService.buildPassageIdRedirectUri,
                serviceRequestBodyFactory.createParameteredBody('clientId', 'clientState'),
                authorizationTaskConstants.none
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('operatorGatewayControlServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            operatorPhonenumberChanged: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.operatorGatewayControlService.operatorPhonenumberChanged,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.none
            ),

            openIncident: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.operatorGatewayControlService.openIncident,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.none
            ),

            closeIncidentToHistory: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.operatorGatewayControlService.closeIncidentToHistory,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.none
            ),

            closeIncidentToFollowUp: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.operatorGatewayControlService.closeIncidentToFollowUp,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.none
            ),

            FreeIncident: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.operatorGatewayControlService.freeIncident,
                serviceRequestBodyFactory.createParameteredBody('incidentId'),
                authorizationTaskConstants.none
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('personalizationServiceProxy',
	['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function(umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
		"use strict";

		return {
			readPersonalizationSettingsForContext: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.personalizationService.readPersonalizationSettingsForContext,
				serviceRequestBodyFactory.createParameteredBody('context', 'organizationId'),
				authorizationTaskConstants.personalization_read
			),
			deletePersonalizationContext: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.personalizationService.deletePersonalizationContext,
				serviceRequestBodyFactory.createParameteredBody('personalizationContextDto'),
				authorizationTaskConstants.personalization_delete
			),
			updatePersonalizationContext: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.personalizationService.updatePersonalizationContext,
				serviceRequestBodyFactory.createParameteredBody('personalizationContextDto'),
				authorizationTaskConstants.personalization_update
			),
			readPersonalizationContexts: umoOperationFactory.createSecureProxyOperation(
				umoxServiceUrls.personalizationService.readPersonalizationContexts,
				serviceRequestBodyFactory.createParameterlessBody,
				authorizationTaskConstants.personalization_read
            ),
            readPersonalizationGridContexts: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.personalizationService.readPersonalizationGridContexts,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.personalization_read
            ),
            readPersonalizationSettingsForGridContext: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.personalizationService.readPersonalizationSettingsForGridContext,
                serviceRequestBodyFactory.createParameteredBody('context', 'organizationId'),
                authorizationTaskConstants.personalization_read
            ), 
            deletePersonalizationGridContext: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.personalizationService.deletePersonalizationGridContext,
                serviceRequestBodyFactory.createParameteredBody('personalizationGridContextDto'),
                authorizationTaskConstants.personalization_delete
            ),
            updatePersonalizationGridContext: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.personalizationService.updatePersonalizationGridContext,
                serviceRequestBodyFactory.createParameteredBody('personalizationGridContextDto'),
                authorizationTaskConstants.personalization_update
            ),

		};
	}]);
angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('pomasServiceProxy',
    ['$http', 'pomasUrlSettingsService', function ($http, pomasUrlSettingsService) {
        "use strict";

        var pomasServiceProxy = {};

        var getServiceMethodUrl = function (methodPath) {
            var baseUrlObject = pomasUrlSettingsService.getBaseUrlObject();
                var baseUrl = baseUrlObject.host + (baseUrlObject.port ? ":" + baseUrlObject.port : "");
                
                return [baseUrl, "pomas", methodPath].join('/');
        }

        var getHttpOptions = function (credentialsInBase64) {
            return {
                headers : {
                    "Authorization": "Basic " + credentialsInBase64
                }
            };
        }

        pomasServiceProxy.getPositionById = function (credentialsInBase64, positionId) {
            return $http.get(
                getServiceMethodUrl("api/Positions/ById/" + positionId), 
                getHttpOptions(credentialsInBase64));
        }
        pomasServiceProxy.getPositionByIncidentId = function (credentialsInBase64, incidentId) {
            return $http.get(
                getServiceMethodUrl("api/Positions/ByIncidentId/" + incidentId), 
                getHttpOptions(credentialsInBase64));
        }
        pomasServiceProxy.getPositionByDeviceId = function (credentialsInBase64, deviceId) {
            return $http.get(
                getServiceMethodUrl("api/Positions/ByDeviceId/" + deviceId),
                getHttpOptions(credentialsInBase64));
        }
        pomasServiceProxy.getPositionByPhoneNumber = function (credentialsInBase64, e164PhoneNumber) {
            return $http.post(
                getServiceMethodUrl("api/Positions/ByPhoneNumber"), 
                { "phoneNumber": e164PhoneNumber },
                getHttpOptions(credentialsInBase64));
        }
        pomasServiceProxy.addPosition = function (credentialsInBase64, positionObject) {
            return $http.post(
                getServiceMethodUrl("api/Positions/Add"), 
                positionObject,
                getHttpOptions(credentialsInBase64));
        }
        pomasServiceProxy.deletePosition = function (credentialsInBase64, positionId) {
            return $http.delete(
                getServiceMethodUrl("api/Positions/" + positionId),
                getHttpOptions(credentialsInBase64));
        }

        return pomasServiceProxy;
    }]);

angular.module("verklizan.umox.common.html5.vkz-webrequests.proxy").constant("urlConstants", {
    auditTrailService: [
		"readAuditPage",
		"readEntityAuditPage",
		"readAuditChangePage",
		"readAccountabilityInfo"
    ],
    loginService: [
        "login",
        "validate2FA",
        "logout",
        "readCurrentUserInfo",
        "buildPassageIdRedirectUri"
    ],
    settingsService: [
        "getResponderSettings",
        "getIntakerSettings",
        "getUmoWebSettings",
        "getUmoWebSettingsForOrganization"
    ],
    settingsManagementService: [
        "readGeneralSettings",
        "updateGeneralSettings",
        "readResponderSettings",
        "updateResponderSettings",
        "readUmoWebSettings",
        "updateUmoWebSettings",
        "readWellBeingAutoAppointmentServiceSettings",
        "updateWellBeingAutoAppointmentServiceSettings"
    ],
    userManagementService: [
        "updateOperator",
        "readCurrentOperator",
        "readOperatorPhoneNumberPage",
        "registerSubscriber",
        "requestPasswordReset",
        "resetPassword",
        "changeUserPassword",
        "selfChangeUserPassword",
        "registerSubscriber",
        "activateUserAccount",
        "checkTaskAuthorization",
        "checkModuleAuthorization",
        "changePassword",
        "createSubscriberUserAccount",
        "createProfessionalCaregiverUserAccount",
        "readLoginInfo",
        "searchLoginInfo",
        "readLoginInfoPage",
        "getAllRoles",
        "getRolesForUser",
        "readPersonIdForLogin",
        "readPerson",
        "updatePerson",
        "readOperatorPage",
        "searchOperators",
        "deleteLogin",
        "readPersonIdForOperator",
        "readOperator",
        "deleteOperator",
        "createOperator",
        "createOperatorWithDto",
        "searchOperators",
        "enableUser",
        "disableUser",
        "unlockUser",
        "removeRolesFromUser",
        "addRolesToUser",
        "readRolePage",
        "readRoleDto",
        "deleteRoleDto",
        "updateRoleDto",
        "createRoleDto",
        "validForDeletion",
        "readModulePage",
        "readRoleDtoPage",
        "readUserRoleDtoPage",
        "readModuleWithApplicableTasksPage"
    ],
    subscriberManagementService: [
        "createSubscriberWithDto",
        "readSubscriberWithDto",
        "updateSubscriberWithDto",
        "deleteSubscriberWithDto",
        "readSubscriberVisualViewInformation",

        "searchSubscribers",
        "readSubscriber",
        "readSubscriberPage",
        "readSubscribersForResidencePage",
        "createSubscriber",
        "readMedicalInfoPage",
        "readMedicationPage",
        "createSubscriberNote",
        "readSubscriberHtmlNote",
        "readSubscriberHtmlNotePage",
        "readSubscriberNote",
        "readSubscriberNotePage",

        "createSubscriberNoteWithDto",
        "readSubscriberNoteWithDto",
        "readSubscriberNoteDtoPage",
        "updateSubscriberNoteWithDto",
        "deleteSubscriberNoteWithDto",

        "readCurrentSubscriber",
        "readReferralStatusPage",
        "readSubscriberContactItemPage",
        "readSubscriberTemplatePage",
        "readInsurerPage",

        "readMedicalPriorityPage",
        "readMedicalPriority",
        "createMedicalPriority",
        "updateMedicalPriority",
        "deleteMedicalPriority",

        "readReferralStatusPage",
        "readReferralStatus",
        "createReferralStatus",
        "updateReferralStatus",
        "deleteReferralStatus",

        "readMedicalConditionValuePage",
        "readMedicalConditionValue",
        "createMedicalConditionValue",
        "updateMedicalConditionValue",
        "deleteMedicalConditionValue",

        "readMedicalConditionPage",
        "readMedicalCondition",
        "createMedicalCondition",
        "deleteMedicalCondition",
        "updateMedicalCondition",

        "readMedicinePage",
        "readMedicine",
        "createMedicine",
        "updateMedicine",
        "deleteMedicine",

        "readSubscriberMedicationPage",
        "readSubscriberMedicationWithDto",
        "updateSubscriberMedicationWithDto",
        "deleteSubscriberMedicationWithDto",
        "createSubscriberMedicationWithDto",

        "readSubscriberMedicalInfoPage",
        "readSubscriberMedicalInfoWithDto",
        "updateSubscriberMedicalInfoWithDto",
        "deleteSubscriberMedicalInfoWithDto",
        "createSubscriberMedicalInfoWithDto",

        "readSubscriberStatePage",
        "readSubscriberState",

        "readSubscriberStateHistoryDtoPage",
        "deleteSubscriberStateHistory",

        "createSubscriberCaregiverLink",
        "updateSubscriberCaregiverLink",
        "deleteSubscriberCaregiverLink",

        "createSubscriberState",
        "updateSubscriberState",
        "deleteSubscriberState",

        "readSubscriberCharacteristicPage",

        "readSubscriberCharacteristicRowDtoPage",
        "readSubscriberCharacteristicWithDto",
        "createSubscriberCharacteristicWithDto",
        "updateSubscriberCharacteristicWithDto",
        "deleteSubscriberCharacteristicWithDto",

        "createSubscriberPhoneNumberWithDto",
        "readSubscriberPhoneNumberWithDto",
        "updateSubscriberPhoneNumberWithDto",
        "deleteSubscriberPhoneNumberWithDto",
        "readSubscriberPhoneNumberDtoPage",

        "readSubscriberNotes",
        "readTemplatePage",

        "readSubscriberHolidayPage",
        "createSubscriberHoliday",
        "readSubscriberHoliday",
        "updateSubscriberHoliday",
        "deleteSubscriberHoliday",

        "readAbsenceReasonPage",
        "createAbsenceReason",
        "readAbsenceReason",
        "updateAbsenceReason",
        "deleteAbsenceReason",

        "readSubscriberCaregiverLink",

        "readProjectPage",
        "readProjectDetailPage",
        "readProjectTreePage",
        "readProjectDetailTreePage",

        "readExternalWebLinksForSubscriberPage",
        "createSubscriberExternalWebLink",
        "readSubscriberExternalWebLink",
        "updateSubscriberExternalWebLink",
        "deleteSubscriberExternalWebLink",

        "readExternalWebLinkTypePage",

        "readSubscribersForCaregiverPage",
        "readSubscribersForCaregiverGroupPage",

        "updateStateOfSubscriberWithSpecificTask",

        "readSubscriberStateChangeReasonPage",
        "createSubscriberStateChangeReason",
        "readSubscriberStateChangeReason",
        "updateSubscriberStateChangeReason",
        "deleteSubscriberStateChangeReason"
    ],
    residenceManagementService: [
        "readResidence",
        "readResidenceRowDto",
        "readResidenceVisualViewInformation",
        "createResidence",
        "readResidenceTypePage",
        "readResidenceType",
        "createResidenceType",
        "updateResidenceType",
        "deleteResidenceType",
        "readKeyLocationPage",
        "createKeyLocation",
        "readKeyLocation",
        "readPointOfEntrancePage",
        "createPointOfEntry",
        "readPointOfEntry",
        "updatePointOfEntry",
        "deletePointOfEntry",
        "readResidenceCharacteristicPage",
        "createResidenceCharacteristicWithDto",
        "readResidenceCharacteristicRowDtoPage",
        "readResidenceCharacteristicWithDto",
        "updateResidenceCharacteristicWithDto",
        "deleteResidenceCharacteristicWithDto",
        "readResidenceNotePage",
        "readResidencePage",
        "readResidencesForSchemePage",
        "validateResidence",
        "readSchemeRowDto",
        "readSchemePage",
        "searchScheme",
        "searchResidence",
        "readWarden",
        "createResidenceWithDto",
        "deleteResidenceWithDto",
        "updateResidenceWithDto",
        "readSchemeVisualViewInformation",

        "readResidenceNoteDtoPage",
        "readResidenceNoteWithDto",
        "createResidenceNoteWithDto",
        "updateResidenceNoteWithDto",
        "deleteResidenceNoteWithDto",

        "createSchemeWithDto",
        "readSchemeWithDto",
        "updateSchemeWithDto",
        "deleteSchemeWithDto",

        "createSchemeNoteWithDto",
        "readSchemeNoteWithDto",
        "readSchemeNoteDtoPage",
        "updateSchemeNoteWithDto",
        "deleteSchemeNoteWithDto",

        "readResidenceCaregiverLink",
        "updateResidenceCaregiverLink",

        "updateSchemeCaregiverLink",
        "readSchemeCaregiverLink",
        "createSchemeCaregiverLink",
        "deleteSchemeCaregiverLink",

        "readStreetAddressByZipCode",
        "validateSpanishPostalCode",
        "validateUKPostalCode",

        "readSchemesForCaregiverPage",
        "readSchemesForCaregiverGroupPage",

        "createSchemeDeviceControl",
        "readSchemeDeviceControl",
        "updateSchemeDeviceControl",
        "deleteSchemeDeviceControl",
        "readSchemeDeviceControlPage",

        "setUseSchemeAddressForResidences",

        "batchAddResidencesToScheme",

        "setSchemeAutoAnswerDeviceByResidence"
    ],
    careProviderManagementService: [
        "readCaregiversForSubscriberResidenceSchemePage",
        "readCurrentProfessionalCaregiver",
        "readProfessionalCaregiverContactItemPage",
        "readRelationalCaregiverContactItemPage",
        "readProfessionalCaregiverPage",
        "searchProfessionalCaregivers",
        "readCaregiverTypePage",
        "readCaregiverType",
        "createCaregiverType",
        "updateCaregiverType",
        "deleteCaregiverType",
        "readCaregiversForSubscriberPage",
        "searchProfessionalCaregivers",
        "readProfessionalCaregiverPage",
        "readCaregiversForSubscriberPage",
        "readCaregiversForResidencePage",
        "readCaregiversForSchemePage",
        "readCaregiversForSchemeResidencesPage",
        "readCaregiversForSubscriberTemplatePage",
        "readCaregiverVisualViewInformation",

        "createProfessionalCaregiverWithDto",
        "readProfessionalCaregiverWithDto",
        "updateProfessionalCaregiverWithDto",
        "deleteProfessionalCaregiverWithDto",
        "deleteAndReplaceProfessionalCaregiverWithDto",

        "createProfessionalCaregiverPhoneNumberWithDto",
        "createProfessionalCaregiverPhoneNumberList",
        "readProfessionalCaregiverPhoneNumberWithDto",
        "readProfessionalCaregiverPhoneNumberDtoPage",
        "updateProfessionalCaregiverPhoneNumberWithDto",
        "deleteProfessionalCaregiverPhoneNumberWithDto",

        "createRelationalCaregiverForSubscriberWithDto",
        "readRelationalCaregiverWithDto",
        "updateRelationalCaregiverWithDto",

        "createRelationalCaregiverPhoneNumberList",
        "createRelationalCaregiverPhoneNumberWithDto",
        "readRelationalCaregiverPhoneNumberWithDto",
        "readRelationalCaregiverPhoneNumberDtoPage",
        "updateRelationalCaregiverPhoneNumberWithDto",
        "deleteRelationalCaregiverPhoneNumberWithDto",

        "readProfessionalCaregiverNoteDtoPage",
        "readProfessionalCaregiverNoteWithDto",
        "createProfessionalCaregiverNoteWithDto",
        "createProfessionalCaregiverNoteList",
        "updateProfessionalCaregiverNoteWithDto",
        "deleteProfessionalCaregiverNoteWithDto",

        "readRelationalCaregiverNoteDtoPage",
        "readRelationalCaregiverNoteWithDto",
        "createRelationalCaregiverNoteWithDto",
        "createRelationalCaregiverNoteList",
        "updateRelationalCaregiverNoteWithDto",
        "deleteRelationalCaregiverNoteWithDto",

        "createRelationalCaregiverAvailability",
        "readRelationalCaregiverAvailability",

        "createProfessionalCaregiverAvailability",
        "readProfessionalCaregiverAvailability",

        "readProfessionalCaregiverHolidayPage",
        "createProfessionalCaregiverHoliday",
        "readProfessionalCaregiverHoliday",
        "updateProfessionalCaregiverHoliday",
        "deleteProfessionalCaregiverHoliday",
        "createProfessionalCaregiverHolidayList",

        "readRelationalCaregiverHolidayPage",
        "createRelationalCaregiverHoliday",
        "readRelationalCaregiverHoliday",
        "updateRelationalCaregiverHoliday",
        "deleteRelationalCaregiverHoliday",
        "createRelationalCaregiverHolidayList",

        "isPinIdUnique",

        "createCaregiverGroupWithDto",
        "readCaregiverGroupPage",
        "searchCaregiverGroups",
        "readCaregiverGroupVisualViewInformation",
        "readCaregiverGroupDto",
        "updateCaregiverGroupWithDto",
        "deleteCaregiverGroupsWithDto",
        "readCaregiverGroupMembersPage",
        "createCaregiverGroupMemberLink",
        "deleteCaregiverGroupMemberLink",

        "createCareProviderAvailability",
        "readCareProviderAvailability",
        "readCaregiverGroupHolidayPage",
        "createCaregiverGroupHoliday",
        "readCaregiverGroupHoliday",
        "updateCaregiverGroupHoliday",
        "deleteCaregiverGroupHoliday",
        "createCaregiverGroupHolidayList",

        "createCaregiverGroupPhoneNumberWithDto",
        "createCaregiverGroupPhoneNumberListWithDto",
        "readCaregiverGroupPhoneNumberDto",
        "readCaregiverGroupPhoneNumberDtoPage",
        "updateCaregiverGroupPhoneNumberWithDto",
        "deleteCaregiverGroupPhoneNumber",

        "readCaregiverGroupNoteDtoPage",
        "readCaregiverGroupNoteDto",
        "createCaregiverGroupNoteWithDto",
        "createCaregiverGroupNoteListWithDto",
        "updateCaregiverGroupNoteWithDto",
        "deleteCaregiverGroupNote",

    ],
    deviceManagementService: [
        "readDevicesForSubscriberResidencePage",
        "readDevicesForResidencePage",
        "readDevicesForSubscriberPage",
        "readDevice",
        "searchDevice",
        "readDeviceStatePage",
        "createDeviceState",
        "readDeviceState",
        "updateDeviceState",
        "deleteDeviceState",
        "readDeviceManagerPage",
        "readDeviceRowDto",
        "createDeviceType",
        "readDeviceType",
        "updateDeviceType",
        "deleteDeviceType",
        "readDeviceTypePage",
        "readSubscriberDevices",
        "validateHomeUnitPropertiesForUI",
        "readDevicePage",
        "readDevicePageForSchemeResidences",
        "readDeviceInfoVisualView",
        "readSimpleDevicePage",
        "readSimpleDevicesForDevicePage",
        "readDeviceServiceTaskPage",
        "readDeviceRepairPage",
        "readDeviceServiceTaskPage",
        "readTechniciansForDevicePage",
        "readDeviceCharacteristicRowDtoPage",
        "readDeviceStateHistoryPage",
        "createHomeUnitWithDto",
        "readHomeUnitWithDto",
        "updateHomeUnitWithDto",
        "deleteHomeUnitWithDto",
        "getCodeOfHomeUnitWithPhoneNumber",

        "createDeviceCharacteristicWithDto",
        "createDeviceCharacteristicList",
        "readDeviceCharacteristicWithDto",
        "updateDeviceCharacteristicWithDto",
        "deleteDeviceCharacteristicWithDto",

        "readClientInfoDeviceVisualView",

        "createDeviceControl",
        "readDeviceControl",
        "updateDeviceControl",
        "deleteDeviceControl",
        "readDeviceControlPage"
    ],
    incidentManagementService: [
        "countIncidentRows",
        "createEventType",
        "readEventType",
        "updateEventType",
        "deleteEventType",
        "readEventTypePage",
        "readIncident",
        "readIncidentDto",
        "readIncidentWithDto",
        "readIncidentPage",
        "readIncidentKindPage",

        "readIncidentPriorityPage",

        "createIncidentKind",
        "readIncidentKind",
        "updateIncidentKind",
        "deleteIncidentKind",
        "readIncidentVisualViewInformation",

        "searchIncident",
        "readIncidentNoteDtoPage",

        "readIncidentPageForSubscriber",
        "readIncidentPageForResidenceSubscribers",
        "readIncidentPageForSchemeSubscribers",

        "readEventCharacteristicDtoPage",

        "readEventPage",
        "readCarerEventPage",
        "readOperatorEventPage",
        "readTraceEventPage"
    ],
    supportingDataManagementService: [
        "readOrganization",
        "readOrganizationPage",
        "readFullOrganizationPage",
        "readLevel1OrganizationPage",
        "readRootOrganizationAndUserOrganizationsAtLevel1InTree",
        "readNewOrganizationMessageCount",
        "createOrganizationNote",
        "readOrganizationNotePage",
        "readContractVersion",
        "readPersonalization_Panelsettings",
        "readPersonalization_Fieldsettings",

        "readSalutationPage",
        "readSalutation",
        "createSalutation",
        "deleteSalutation",
        "updateSalutation",

        "createTitle",
        "readTitle",
        "updateTitle",
        "deleteTitle",
        "readTitlePage",

        "readLanguagePage",
        "readMaritalStatePage",
        "createMaritalState",
        "readMaritalState",
        "updateMaritalState",
        "deleteMaritalState",
        "createContactItemType",
        "readContactItemType",
        "updateContactItemType",
        "deleteContactItemType",
        "readContactItemTypePage",
        "readCountryPage",
        "createCountry",
        "readCountry",
        "updateCountry",
        "deleteCountry",
        "readDistrictPage",
        "createDistrict",
        "readDistrict",
        "updateDistrict",
        "deleteDistrict",
        "readRegionPage",
        "createRegion",
        "readRegion",
        "updateRegion",
        "deleteRegion",
        "readCityPage",
        "createCity",
        "readCity",
        "updateCity",
        "deleteCity",
        "readConsumerState",
        "createConsumerState",
        "updateConsumerState",
        "deleteConsumerState",
        "readConsumerStatePage",

        "createAspect",
        "readAspect",
        "readAspectForCharacteristicPage",
        "updateAspect",
        "deleteAspect",
        "readAspectPage",

        "createAspectValue",
        "readAspectValue",
        "updateAspectValue",
        "deleteAspectValue",
        "readAspectValuePage",

        "readAvailableOrganizationReportPage",
        "readAvailableReportPage",
        "readAvailableReport",
        "createAvailableReport",
        "updateAvailableReport",
        "deleteAvailableReport",
        "searchAvailableReports",

        "readOrganizationReportPage",
        "createOrganizationReport",
        "readOrganizationReport",
        "updateOrganizationReport",
        "deleteOrganizationReportWithId",

        "readRelationTypePage",
        "createRelationType",
        "readRelationType",
        "updateRelationType",
        "deleteRelationType",
        "readSkillPage",
        "readCoInhabitantTypePage",
        "createCoInhabitantType",
        "readCoInhabitantType",
        "updateCoInhabitantType",
        "deleteCoInhabitantType",
        "readAgreementTypePage",
        "createAgreementType",
        "readAgreementType",
        "updateAgreementType",
        "deleteAgreementType",
        "readDoctorReferencePage",
        "createDoctorReference",
        "readDoctorReference",
        "updateDoctorReference",
        "deleteDoctorReference",

        "readInsuranceClass",
        "readInsuranceClassPage",
        "createInsuranceClass",
        "updateInsuranceClass",
        "deleteInsuranceClass",

        "readInsurer",
        "readInsurerPage",
        "createInsurer",
        "updateInsurer",
        "deleteInsurer",

        "downloadClientDocument",

        "readConsumerGroupPage",

        "createOrganizationOperatorPhoneNumber",

        "readConsumerGroupForDevicePage",
        "getDefaultConsumerGroupForDeviceLinkedToSubscriberInOrganization"
    ],
    contractManagementService: [
        "createSubscriberDeviceLink",
        "createSubscriberDeviceDtoLink",
        "deleteSubscriberDeviceLink",
        "deleteSubscriberDeviceDtoLink",
        "createResidenceDeviceLink",
        "createResidenceDeviceDtoLink",
        "deleteResidenceDeviceLink",
        "deleteResidenceDeviceDtoLink",

        "createTerminationReason",
        "readTerminationReason",
        "updateTerminationReason",
        "deleteTerminationReason",
        "readTerminationReasonPage",

        "createPaymentMethod",
        "readPaymentMethod",
        "updatePaymentMethod",
        "deletePaymentMethod",
        "readPaymentMethodPage",

        "createTariff",
        "readTariff",
        "updateTariff",
        "deleteTariff",
        "readTariffPage",

        "createPeriodicalCost",
        "readPeriodicalCost",
        "updatePeriodicalCost",
        "deletePeriodicalCost",
        "readPeriodicalCostPage",

        "createNonPeriodicalCost",
        "readNonPeriodicalCost",
        "updateNonPeriodicalCost",
        "deleteNonPeriodicalCost",
        "readNonPeriodicalCostPage",

        "readSubscriberPeriodicalCostPage",
        "readSubscriberNonPeriodicalCostPage",

        "createVATTariff",
        "readVATTariff",
        "updateVATTariff",
        "deleteVATTariff",
        "readVATTariffPage",

        "getSubscriberCostInfo",

        "readPeriodicalCostDto",
        "readPeriodicalCostDtoPage",

        "readNonPeriodicalCostDto",
        "readNonPeriodicalCostDtoPage",

        "readSubscriberPeriodicalCostDto",
        "readSubscriberPeriodicalCostDtoPage",
        "updateSubscriberPeriodicalCostDto",

        "createSubscriberNonPeriodicalCostDto",
        "readSubscriberNonPeriodicalCostDto",
        "readSubscriberNonPeriodicalCostDtoPage",
        "updateSubscriberNonPeriodicalCostDto",
        "deleteSubscriberNonPeriodicalCostDto"
    ],
    pushNotificationService: [
        "registerDevice",
        "unregisterDevice",
        "readCareRequestPage",
        "updateCareRequestStatus",
        "acceptCareRequestWithSpeak",
        "getCareRequest",
        "declineSpeechRequest"
    ],
    appointmentManagementService: [
        "createRecurringAppointment",
        "createSingleAppointment",
        "readAppointmentPage",
        "readAppointmentTypePage",
        "readSingleAppointment",
        "readRecurringAppointment",
        "readRecurringAppointmentOccurrence",
        "readRecurringAppointment",
        "readCurrentBlockingAppointment",
        "updateRecurringAppointment",
        "updateRecurringAppointmentOccurrence",
        "updateSingleAppointment",
        "deleteRecurringAppointment",
        "deleteRecurringAppointmentOccurrence",
        "deleteSingleAppointment",
        "readCallBackAppointmentPage"
    ],
    wizardService: [
        "createSubscriber",
        "updateSubscriber"
    ],
    reportService: [
        "renderAndCache",
        "renderAndCacheHtml",
        "renderAndCachePdf",
        "getDocumentPage",
        "exportReport",
        "listRenderingExtensions",
        "resources/getrenderstream?"
    ],
    reportExtensionsService: [
        "signContract",
        "mailReports",
        "readContractPage",
        "readContract",
        "readManagementReportFilterItemPage",
        "mailManagementReport"
    ],
    debugService: [
        "createClientDataTraces",
        "readLoginTrailPageDto",
        "readTraceLogPageDto"
    ],
    wellBeingDataManagementService: [
        "readCallBackAppointmentPage",
        "readCallBackAppointmentTypePage",
        "createCallBackAppointment",
        "createCallBackAppointmentBatch",
        "readCallBackAppointment",
        "updateCallBackAppointment",
        "deleteCallBackAppointment",
        "deactivateWellBeing",
        "readSubscriberInfo",
        "createCallBackAppointmentType",
        "readCallBackAppointmentType",
        "updateCallBackAppointmentType",
        "deleteCallBackAppointmentType",
        "readPlannedCallBackAppointmentNumberAtTimeOfDayPage",
        "postponeCallBackAppointments",
        "updateCallBackAppointmentDetails",
        "unlockAppointmentLockedByCurrentUser",
        "unlockAllAppointmentsLockedByCurrentUser",
        "readHistoricEventPage"
    ],
    scheduledTaskService: [
        "getScheduledTaskSystemTimeZone"
    ],
    personalizationService: [
        "readPersonalizationSettingsForContext",
        "deletePersonalizationContext",
        "updatePersonalizationContext",
        "readPersonalizationContexts",
        "readPersonalizationGridContexts",
        "readPersonalizationSettingsForGridContext",
        "deletePersonalizationGridContext",
        "updatePersonalizationGridContext"
    ]
});

angular.module("verklizan.umox.common.html5.vkz-webrequests.proxy").constant("operatorGatewayUrlConstants", {
    operatorGatewayControlService: [
		"operatorPhonenumberChanged",
		"openIncident",
		"closeIncidentToHistory",
		"closeIncidentToFollowUp",
		"freeIncident"
    ]
});

angular.module("verklizan.umox.common.html5.vkz-webrequests.proxy").config(
	["umoxServiceUrlsProvider", "urlConstants", "operatorGatewayUrlConstants",
		function (umoxServiceUrlsProvider, urlConstants, operatorGatewayUrlConstants) {
		    umoxServiceUrlsProvider.setUmoxServiceUrls(urlConstants);
		    umoxServiceUrlsProvider.setOperatorGatewayControlServiceUrls(operatorGatewayUrlConstants);
		}
	]);
angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('pushNotificationServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            registerDevice: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.registerDevice,
                serviceRequestBodyFactory.createParameteredBody("device", "subscriptionType"),
                authorizationTaskConstants.careRequest_subscription
            ),
            unregisterDevice: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.unregisterDevice,
                serviceRequestBodyFactory.createParameteredBody("phoneNumber", "subscriptionType"),
                authorizationTaskConstants.careRequest_subscription
            ),
            readCareRequestPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.readCareRequestPage,
                serviceRequestBodyFactory.createComplexPageBody("phoneNumber"),
                authorizationTaskConstants.careRequest_read
            ),
            updateCareRequestStatus: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.updateCareRequestStatus,
                serviceRequestBodyFactory.createParameteredBody("requestMessage"),
                authorizationTaskConstants.careRequest_update
            ),
            acceptCareRequestWithSpeak: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.acceptCareRequestWithSpeak,
                serviceRequestBodyFactory.createParameteredBody("sessionId"),
                authorizationTaskConstants.careRequest_update
            ),
            getCareRequest: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.getCareRequest,
                serviceRequestBodyFactory.createParameteredBody("sessionId"),
                authorizationTaskConstants.careRequest_read
            ),
            declineSpeechRequest: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.pushNotificationService.declineSpeechRequest,
                serviceRequestBodyFactory.createParameteredBody("sessionId"),
                authorizationTaskConstants.careRequest_update
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('reportExtensionsServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            signContract: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.signContract,
                serviceRequestBodyFactory.createParameteredBody('instanceId', 'signature', 'referralStateId', 'subscriberId'),
				authorizationTaskConstants.contractDocument_create
            ),
            mailReports: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.mailReports,
                serviceRequestBodyFactory.createParameteredBody('instanceIds', 'emailAddress', 'subject', 'body', 'deviceInfo'),
                authorizationTaskConstants.report_read
            ),
            readContractPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.readContractPage,
                serviceRequestBodyFactory.createParameteredBody('organizationId', 'subscriberId'),
                authorizationTaskConstants.contractDocument_read
            ),
            readContract: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.readContract,
                serviceRequestBodyFactory.createParameteredBody('fullFileName'),
                authorizationTaskConstants.contractDocument_read
            ),
            readManagementReportFilterItemPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.readManagementReportFilterItemPage,
                serviceRequestBodyFactory.createParameteredBody('filterName', 'selectedOrganizationId', 'pageDescriptor'),
                authorizationTaskConstants.report_read
            ),
            mailManagementReport: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportExtensionsService.mailManagementReport,
                serviceRequestBodyFactory.createParameteredBody('taskTypeValue', 'filters', 'filterPropertyPathsDisplayText', 'settings', 'cultureId', 'toEmailAddress', 'title'),
                authorizationTaskConstants.report_read
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('reportServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            renderAndCache: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportService.renderAndCacheHtml,
                serviceRequestBodyFactory.createParameteredBody('format', 'report', 'deviceInfo', 'parameters'),
                authorizationTaskConstants.report_read
            ),
            getDocumentPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportService.getDocumentPage,
                serviceRequestBodyFactory.createParameteredBody('instanceID', 'pageNumber'),
				authorizationTaskConstants.report_read
            ),
            listRenderingExtensions: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.reportService.listRenderingExtensions,
                serviceRequestBodyFactory.createParameteredBody(),
                authorizationTaskConstants.none
            ),
            exportReport: umoOperationFactory.createSecureProxyDownloadOperation(
                umoxServiceUrls.reportService.exportReport,
                serviceRequestBodyFactory.createParameteredBody('format', 'report', 'deviceInfo'),
                authorizationTaskConstants.report_read
            )
        }; 
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('residenceManagementServiceProxy',
['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
    "use strict";

    return {
        readKeyLocationPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readKeyLocationPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.keyLocation_read
        ),
        createKeyLocation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createKeyLocation,
            serviceRequestBodyFactory.createParameteredBody('keyLocation'),
            authorizationTaskConstants.keyLocation_create
        ),
        readKeyLocation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readKeyLocation,
            serviceRequestBodyFactory.createParameteredBody('keyLocationId'),
            authorizationTaskConstants.keyLocation_read
        ),
        readPointOfEntrancePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readPointOfEntrancePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.pointOfEntry_read
        ),
        createPointOfEntry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createPointOfEntry,
            serviceRequestBodyFactory.createParameteredBody('pointOfEntry'),
            authorizationTaskConstants.pointOfEntry_create
        ),
        readPointOfEntry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readPointOfEntry,
            serviceRequestBodyFactory.createParameteredBody('pointOfEntryId'),
            authorizationTaskConstants.pointOfEntry_read
        ),
        updatePointOfEntry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updatePointOfEntry,
            serviceRequestBodyFactory.createParameteredBody('pointOfEntry'),
            authorizationTaskConstants.pointOfEntry_update
        ),
        deletePointOfEntry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deletePointOfEntry,
            serviceRequestBodyFactory.createParameteredBody('pointOfEntry'),
            authorizationTaskConstants.pointOfEntry_delete
        ),
        readResidenceTypePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.residenceType_read
        ),
        readResidenceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceType,
            serviceRequestBodyFactory.createParameteredBody('residenceTypeId'),
            authorizationTaskConstants.residenceType_read
        ),
        createResidenceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createResidenceType,
            serviceRequestBodyFactory.createParameteredBody('residenceType'),
            authorizationTaskConstants.residenceType_create
        ),
        updateResidenceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateResidenceType,
            serviceRequestBodyFactory.createParameteredBody('residenceType'),
            authorizationTaskConstants.residenceType_update
        ),
        deleteResidenceType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteResidenceType,
            serviceRequestBodyFactory.createParameteredBody('residenceType'),
            authorizationTaskConstants.residenceType_delete
        ),
        readResidenceCharacteristicPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceCharacteristicPage,
            serviceRequestBodyFactory.createComplexPageBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        readResidenceCharacteristicRowDtoPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceCharacteristicRowDtoPage,
            serviceRequestBodyFactory.createComplexPageBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        createResidenceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createResidenceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristic'),
            authorizationTaskConstants.residence_update
        ),
        readResidenceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristicId'),
            authorizationTaskConstants.residence_read
        ),
        updateResidenceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateResidenceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristic'),
            authorizationTaskConstants.residence_update
        ),

        deleteResidenceCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteResidenceCharacteristicWithDto,
            serviceRequestBodyFactory.createParameteredBody('characteristicId'),
            authorizationTaskConstants.residence_delete
        ),
        readResidenceNotePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceNotePage,
            serviceRequestBodyFactory.createComplexPageBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        readResidence: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidence,
            serviceRequestBodyFactory.createParameteredBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        readResidenceVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceVisualViewInformation,
            serviceRequestBodyFactory.createParameteredBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        readResidencePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidencePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.residence_read
        ),
        readResidencesForSchemePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidencesForSchemePage,
			serviceRequestBodyFactory.createComplexPageBody('schemeId'),
            authorizationTaskConstants.residence_read
        ),
        createResidence: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createResidence,
            serviceRequestBodyFactory.createParameteredBody('residence'),
            authorizationTaskConstants.scheme_read
        ),
        readSchemeRowDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeRowDto,
            serviceRequestBodyFactory.createParameteredBody('schemeId'),
            authorizationTaskConstants.scheme_read
        ),
        readSchemePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.scheme_read
        ),
        searchScheme: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.searchScheme,
            serviceRequestBodyFactory.createSearchPageBody,
            authorizationTaskConstants.scheme_read
        ),
        readSchemeVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeVisualViewInformation,
            serviceRequestBodyFactory.createParameteredBody("schemeId"),
            authorizationTaskConstants.scheme_read
        ),
        searchResidence: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.searchResidence,
            serviceRequestBodyFactory.createSearchPageBody,
            authorizationTaskConstants.residence_read
        ),
        readWarden: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readWarden,
            serviceRequestBodyFactory.createParameteredBody('wardenId'),
            authorizationTaskConstants.residence_read
        ),
        createResidenceWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createResidenceWithDto,
            serviceRequestBodyFactory.createParameteredBody('residenceDto'),
            authorizationTaskConstants.residence_create
        ),
        readResidenceRowDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceRowDto,
            serviceRequestBodyFactory.createParameteredBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),
        updateResidenceWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateResidenceWithDto,
            serviceRequestBodyFactory.createParameteredBody('residenceDto'),
            authorizationTaskConstants.residence_update
        ),
        deleteResidenceWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteResidenceWithDto,
            serviceRequestBodyFactory.createParameteredBody('residenceId'),
            authorizationTaskConstants.residence_delete
        ),

        // html 5 sheme

        createSchemeWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createSchemeWithDto,
            serviceRequestBodyFactory.createParameteredBody('schemeDto'),
            authorizationTaskConstants.scheme_create
        ),
        readSchemeWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeWithDto,
            serviceRequestBodyFactory.createParameteredBody('schemeId'),
            authorizationTaskConstants.scheme_read
        ),
        updateSchemeWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateSchemeWithDto,
            serviceRequestBodyFactory.createParameteredBody('schemeDto'),
            authorizationTaskConstants.scheme_update
        ),
        deleteSchemeWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteSchemeWithDto,
            serviceRequestBodyFactory.createParameteredBody('schemeId'),
            authorizationTaskConstants.scheme_delete
        ),


        // notes
        createResidenceNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createResidenceNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('note'),
            authorizationTaskConstants.residence_update
        ),

        readResidenceNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('noteId'),
            authorizationTaskConstants.residence_read
        ),

        readResidenceNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceNoteDtoPage,
            serviceRequestBodyFactory.createComplexPageBody('residenceId'),
            authorizationTaskConstants.residence_read
        ),

        updateResidenceNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateResidenceNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('note'),
            authorizationTaskConstants.residence_update
        ),

        deleteResidenceNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteResidenceNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('noteId'),
            authorizationTaskConstants.residence_update
        ),

        createSchemeNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createSchemeNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('note'),
            authorizationTaskConstants.scheme_update
        ),

        readSchemeNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('noteId'),
            authorizationTaskConstants.scheme_read
        ),

        readSchemeNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeNoteDtoPage,
            serviceRequestBodyFactory.createComplexPageBody('schemeId'),
            authorizationTaskConstants.scheme_read
        ),

        updateSchemeNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateSchemeNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('note'),
            authorizationTaskConstants.scheme_update
        ),

        deleteSchemeNoteWithDto: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteSchemeNoteWithDto,
            serviceRequestBodyFactory.createParameteredBody('noteId'),
            authorizationTaskConstants.scheme_update
        ),

        readSchemeCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('caregiverLinkId'),
            authorizationTaskConstants.caregiverLink_read
        ),

        updateSchemeCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateSchemeCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('caregiverLink'),
            authorizationTaskConstants.caregiverLink_update
        ),

        createSchemeCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createSchemeCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('schemeId', 'careProviderId', 'order', 'autoCare', 'autoCallSkillId', 'autoEmail', 'autoSms', 'alarmtypeDependent', 'autoMessageSkillId'),
            authorizationTaskConstants.caregiverLink_create
        ),

        deleteSchemeCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteSchemeCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('schemeId', 'careProviderId'),
            authorizationTaskConstants.caregiverLink_delete
        ),

        readResidenceCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readResidenceCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('caregiverLinkId'),
            authorizationTaskConstants.caregiverLink_read
        ),

        updateResidenceCaregiverLink: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateResidenceCaregiverLink,
            serviceRequestBodyFactory.createParameteredBody('caregiverLink'),
            authorizationTaskConstants.caregiverLink_update
        ),

        readStreetAddressByZipCode: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readStreetAddressByZipCode,
            serviceRequestBodyFactory.createParameteredBody('zipCode', 'houseNumber'),
            authorizationTaskConstants.residence_read
        ),
        validateSpanishPostalCode: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.validateSpanishPostalCode,
            serviceRequestBodyFactory.createParameteredBody('region', 'city', 'postalCode'),
            authorizationTaskConstants.residence_read
        ),
        validateUKPostalCode: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.validateUKPostalCode,
            serviceRequestBodyFactory.createParameteredBody('postalCode'),
            authorizationTaskConstants.residence_read
        ),

        readSchemesForCaregiverPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemesForCaregiverPage,
            serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
            authorizationTaskConstants.scheme_read
        ),
        readSchemesForCaregiverGroupPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemesForCaregiverGroupPage,
            serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
            authorizationTaskConstants.scheme_read
        ),

        createSchemeDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.createSchemeDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('schemeDeviceControl'),
            authorizationTaskConstants.scheme_create
        ),
        readSchemeDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('schemeDeviceControlId'),
            authorizationTaskConstants.scheme_read
        ),
        updateSchemeDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.updateSchemeDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('schemeDeviceControl'),
            authorizationTaskConstants.scheme_update
        ),
        deleteSchemeDeviceControl: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.deleteSchemeDeviceControl,
            serviceRequestBodyFactory.createParameteredBody('schemeDeviceControlId'),
            authorizationTaskConstants.scheme_update
        ),
        readSchemeDeviceControlPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.readSchemeDeviceControlPage,
            serviceRequestBodyFactory.createComplexPageBody('schemeId'),
            authorizationTaskConstants.scheme_read
        ),

        setUseSchemeAddressForResidences: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.setUseSchemeAddressForResidences,
            serviceRequestBodyFactory.createParameteredBody('filters'),
            authorizationTaskConstants.scheme_update
        ),

        batchAddResidencesToScheme: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.batchAddResidencesToScheme,
            serviceRequestBodyFactory.createParameteredBody('settings'),
            authorizationTaskConstants.residence_create
        ),

        setSchemeAutoAnswerDeviceByResidence: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.residenceManagementService.setSchemeAutoAnswerDeviceByResidence,
            serviceRequestBodyFactory.createParameteredBody('residenceId', 'setOff'),
            authorizationTaskConstants.scheme_update
        ),
    };
}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('scheduledTaskServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            getScheduledTaskSystemTimeZone: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.scheduledTaskService.getScheduledTaskSystemTimeZone,
                serviceRequestBodyFactory.createParameterlessBody,
				authorizationTaskConstants.report_create
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('settingsManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            readGeneralSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.readGeneralSettings,
                serviceRequestBodyFactory.createParameteredBody("organizationId"),
                authorizationTaskConstants.generalSetting_Read
            ),
            updateGeneralSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.updateGeneralSettings,
                serviceRequestBodyFactory.createParameteredBody("newSettings", "organizationId"),
                authorizationTaskConstants.generalSetting_Update
            ),
            readResponderSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.readResponderSettings,
                serviceRequestBodyFactory.createParameteredBody("organizationId"),
                authorizationTaskConstants.responderSetting_Read
            ),
            updateResponderSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.updateResponderSettings,
                serviceRequestBodyFactory.createParameteredBody("newSettings", "organizationId"),
                authorizationTaskConstants.responderSetting_Update
            ),
            readUmoWebSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.readUmoWebSettings,
                serviceRequestBodyFactory.createParameteredBody("organizationId"),
                authorizationTaskConstants.umoWebSetting_Read
            ),
            updateUmoWebSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.updateUmoWebSettings,
                serviceRequestBodyFactory.createParameteredBody("newSettings", "organizationId"),
                authorizationTaskConstants.umoWebSetting_Update
            ),
            readWellBeingAutoAppointmentServiceSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.readWellBeingAutoAppointmentServiceSettings,
                serviceRequestBodyFactory.createParameteredBody("organizationId"),
                authorizationTaskConstants.autoAppointmentServiceSetting_Read
            ),
            updateWellBeingAutoAppointmentServiceSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsManagementService.updateWellBeingAutoAppointmentServiceSettings,
                serviceRequestBodyFactory.createParameteredBody("newSettings", "organizationId"),
                authorizationTaskConstants.autoAppointmentServiceSetting_Update
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('settingsServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            getResponderSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsService.getResponderSettings,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.none 
            ),
            getUmoWebSettings: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsService.getUmoWebSettings,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.none
            ),
            getUmoWebSettingsForOrganization: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.settingsService.getUmoWebSettingsForOrganization,
                serviceRequestBodyFactory.createParameteredBody('organizationId'),
                authorizationTaskConstants.none
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('subscriberManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            createSubscriberWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberDto'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            updateSubscriberWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberDto'),
                authorizationTaskConstants.subscriber_read
            ),
            deleteSubscriberWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberVisualViewInformation: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberVisualViewInformation,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            searchSubscribers: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.searchSubscribers,
                serviceRequestBodyFactory.createSearchPageBody,
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriber,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            createSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriber,
                serviceRequestBodyFactory.createParameteredBody('subscriber'),
                authorizationTaskConstants.subscriber_create
            ),
            readMedicalInfoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalInfoPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.medicalInfo_read
            ),
            readMedicationPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicationPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.medication_read
            ),
            readSubscriberMedicationPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberMedicationPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.medication_read
            ),
            createSubscriberMedicationWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberMedicationWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'medication'),
                authorizationTaskConstants.medication_create
            ),
            readSubscriberMedicationWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberMedicationWithDto,
                serviceRequestBodyFactory.createParameteredBody('medicationId'),
                authorizationTaskConstants.medication_read
            ),
            updateSubscriberMedicationWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberMedicationWithDto,
                serviceRequestBodyFactory.createParameteredBody('medication'),
                authorizationTaskConstants.medication_update
            ),
            deleteSubscriberMedicationWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberMedicationWithDto,
                serviceRequestBodyFactory.createParameteredBody('medicationId'),
                authorizationTaskConstants.medication_delete
            ),
            readSubscriberMedicalInfoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberMedicalInfoPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.medicalInfo_read
            ),
            createSubscriberMedicalInfoWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberMedicalInfoWithDto,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'medicalInfo'),
                authorizationTaskConstants.medicalInfo_create
            ),
            readSubscriberMedicalInfoWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberMedicalInfoWithDto,
                serviceRequestBodyFactory.createParameteredBody('medicalInfoId'),
                authorizationTaskConstants.medicalInfo_read
            ),
            updateSubscriberMedicalInfoWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberMedicalInfoWithDto,
                serviceRequestBodyFactory.createParameteredBody('medicalInfo'),
                authorizationTaskConstants.medicalInfo_update
            ),
            deleteSubscriberMedicalInfoWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberMedicalInfoWithDto,
                serviceRequestBodyFactory.createParameteredBody('medicalInfoId'),
                authorizationTaskConstants.medicalInfo_delete
            ),
            createSubscriberNote: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberNote,
                serviceRequestBodyFactory.createParameteredBody('note'),
                authorizationTaskConstants.subscriber_update
            ),
            readCurrentSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readCurrentSubscriber,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberHtmlNote: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberHtmlNote,
                serviceRequestBodyFactory.createParameteredBody('noteId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberHtmlNotePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberHtmlNotePage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),




            createSubscriberNoteWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberNoteWithDto,
                serviceRequestBodyFactory.createParameteredBody('note'),
                authorizationTaskConstants.subscriber_update
            ),
            readSubscriberNoteWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberNoteWithDto,
                serviceRequestBodyFactory.createParameteredBody('noteId'),
                authorizationTaskConstants.subscriber_read
            ),

            readSubscriberNoteDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberNoteDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),

            updateSubscriberNoteWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberNoteWithDto,
                serviceRequestBodyFactory.createParameteredBody('note'),
                authorizationTaskConstants.subscriber_update
            ),

            deleteSubscriberNoteWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberNoteWithDto,
                serviceRequestBodyFactory.createParameteredBody('noteId'),
                authorizationTaskConstants.subscriber_update
            ),



            readSubscriberSoapNotePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberNotePage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readMedicalConditionPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalConditionPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.medicalCondition_read
            ),
            readMedicalCondition: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalCondition,
                serviceRequestBodyFactory.createParameteredBody('medicalConditionId'),
                authorizationTaskConstants.medicalCondition_read
            ),
            createMedicalCondition : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createMedicalCondition,
                serviceRequestBodyFactory.createParameteredBody('medicalCondition'),
                authorizationTaskConstants.medicalCondition_create
            ),
            updateMedicalCondition: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateMedicalCondition,
                serviceRequestBodyFactory.createParameteredBody('medicalCondition'),
                authorizationTaskConstants.medicalCondition_update
            ),
            deleteMedicalCondition: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteMedicalCondition,
                serviceRequestBodyFactory.createParameteredBody('medicalCondition'),
                authorizationTaskConstants.medicalCondition_delete
            ),
            readMedicalConditionValuePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalConditionValuePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.medicalConditionValue_read
            ),
            readMedicalConditionValue: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalConditionValue,
                serviceRequestBodyFactory.createParameteredBody('medicalConditionValueId'),
                authorizationTaskConstants.medicalConditionValue_read
            ),
            createMedicalConditionValue: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createMedicalConditionValue,
                serviceRequestBodyFactory.createParameteredBody('medicalConditionValue'),
                authorizationTaskConstants.medicalConditionValue_create
            ),
            updateMedicalConditionValue: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateMedicalConditionValue,
                serviceRequestBodyFactory.createParameteredBody('medicalConditionValue'),
                authorizationTaskConstants.medicalConditionValue_update
            ),
            deleteMedicalConditionValue: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteMedicalConditionValue,
                serviceRequestBodyFactory.createParameteredBody('medicalConditionValue'),
                authorizationTaskConstants.medicalConditionValue_delete
            ),
            readSubscriberPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),
            readSubscribersForResidencePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscribersForResidencePage,
                serviceRequestBodyFactory.createComplexPageBody('residenceId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberCharacteristicPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberCharacteristicPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberCharacteristicRowDtoPage: umoOperationFactory.createSecureProxyOperation(
               umoxServiceUrls.subscriberManagementService.readSubscriberCharacteristicRowDtoPage,
               serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
               authorizationTaskConstants.subscriber_read
            ),
            readSubscriberCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberCharacteristicWithDto,
                serviceRequestBodyFactory.createParameteredBody('characteristicId'),
                authorizationTaskConstants.subscriber_read
            ),
            createSubscriberCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberCharacteristicWithDto,
                serviceRequestBodyFactory.createParameteredBody('characteristic'),
                authorizationTaskConstants.subscriber_update
            ),
            updateSubscriberCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberCharacteristicWithDto,
                serviceRequestBodyFactory.createParameteredBody('characteristic'),
                authorizationTaskConstants.subscriber_update
            ),
            deleteSubscriberCharacteristicWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberCharacteristicWithDto,
                serviceRequestBodyFactory.createParameteredBody('characteristicId'),
                authorizationTaskConstants.subscriber_update
            ),

            readSubscriberPhoneNumberDtoPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberPhoneNumberDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),

            readSubscriberPhoneNumberWithDto : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberPhoneNumberWithDto,
                serviceRequestBodyFactory.createParameteredBody('contactItemId'),
                authorizationTaskConstants.subscriber_read
            ),

            createSubscriberPhoneNumberWithDto : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberPhoneNumberWithDto,
                serviceRequestBodyFactory.createParameteredBody('contactItem'),
                authorizationTaskConstants.subscriber_update
            ),

            updateSubscriberPhoneNumberWithDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberPhoneNumberWithDto,
                serviceRequestBodyFactory.createParameteredBody('contactItem'),
                authorizationTaskConstants.subscriber_update
            ),

            deleteSubscriberPhoneNumberWithDto : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberPhoneNumberWithDto,
                serviceRequestBodyFactory.createParameteredBody('contactItemId'),
                authorizationTaskConstants.subscriber_delete
            ),


            readSubscriberContactItemPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberContactItemPage,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readInsurerPage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readInsurerPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.insurer_read
            ),
            readMedicalPriorityPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalPriorityPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.medicalPriority_read
            ),
            readMedicalPriority: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicalPriority,
                serviceRequestBodyFactory.createParameteredBody('medicalPriorityId'),
                authorizationTaskConstants.medicalPriority_read
            ),
            createMedicalPriority: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createMedicalPriority,
                serviceRequestBodyFactory.createParameteredBody('medicalPriority'),
                authorizationTaskConstants.medicalPriority_create
            ),
            updateMedicalPriority: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateMedicalPriority,
                serviceRequestBodyFactory.createParameteredBody('medicalPriority'),
                authorizationTaskConstants.medicalPriority_update
            ),
            deleteMedicalPriority: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteMedicalPriority,
                serviceRequestBodyFactory.createParameteredBody('medicalPriority'),
                authorizationTaskConstants.medicalPriority_delete
            ),
            readMedicinePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicinePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.medicine_read
            ),
            readMedicine: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readMedicine,
                serviceRequestBodyFactory.createParameteredBody('medicineId'),
                authorizationTaskConstants.medicine_read
            ),
            createMedicine: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createMedicine,
                serviceRequestBodyFactory.createParameteredBody('medicine'),
                authorizationTaskConstants.medicine_create
            ),
            updateMedicine: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateMedicine,
                serviceRequestBodyFactory.createParameteredBody('medicine'),
                authorizationTaskConstants.medicine_update
            ),
            deleteMedicine: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteMedicine,
                serviceRequestBodyFactory.createParameteredBody('medicine'),
                authorizationTaskConstants.medicine_delete
            ),
            readSubscriberNotes: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberNotes,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readtemplatepage : umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readTemplatePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),
            readReferralStatusPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readReferralStatusPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.referralStatus_read
            ),
            readReferralStatus: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readReferralStatus,
                serviceRequestBodyFactory.createParameteredBody('referralStatusId'),
                authorizationTaskConstants.referralStatus_read
            ),
            createReferralStatus: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createReferralStatus,
                serviceRequestBodyFactory.createParameteredBody('referralStatus'),
                authorizationTaskConstants.referralStatus_create
            ),
            updateReferralStatus: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateReferralStatus,
                serviceRequestBodyFactory.createParameteredBody('referralStatus'),
                authorizationTaskConstants.referralStatus_update
            ),
            deleteReferralStatus: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteReferralStatus,
                serviceRequestBodyFactory.createParameteredBody('referralStatus'),
                authorizationTaskConstants.referralStatus_delete
            ),
            readSubscriberStatePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberStatePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriberState_read
            ),
            readSubscriberState: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberState,
                serviceRequestBodyFactory.createParameteredBody('subscriberStateId'),
                authorizationTaskConstants.subscriberState_read
            ),
            createSubscriberState: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberState,
                serviceRequestBodyFactory.createParameteredBody('subscriberState'),
                authorizationTaskConstants.subscriberState_create
            ),
            updateSubscriberState: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberState,
                serviceRequestBodyFactory.createParameteredBody('subscriberState'),
                authorizationTaskConstants.subscriberState_update
            ),
            deleteSubscriberState: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberState,
                serviceRequestBodyFactory.createParameteredBody('subscriberState'),
                authorizationTaskConstants.subscriberState_delete
            ),

            readSubscriberStateHistoryDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberStateHistoryDtoPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),

            deleteSubscriberStateHistory: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberStateHistory,
                serviceRequestBodyFactory.createComplexPageBody('subscriberStateHistoryId'),
                authorizationTaskConstants.subscriber_update
            ),

            readSubscriberCaregiverLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberCaregiverLink,
                serviceRequestBodyFactory.createParameteredBody('caregiverLinkId'),
                authorizationTaskConstants.caregiverLink_read),

            createSubscriberCaregiverLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberCaregiverLink,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'careProviderId', 'linkProfessionalAsRelational', 'isAutoLinked', 'order', 'caregiverHasKey', 'careAreaLink', 'linkRemark', 'caregiverIsNextOfKin', 'travelMinutes', 'autoCare', 'autoCallSkillId', 'autoEmail', 'autoSms', 'alarmtypeDependent', 'autoMessageSkillId', 'relationTypeId'),
                authorizationTaskConstants.caregiverLink_create
            ),

            deleteSubscriberCaregiverLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberCaregiverLink,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'careProviderId'),
                authorizationTaskConstants.caregiverLink_delete
            ),

            updateSubscriberCaregiverLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberCaregiverLink,
                serviceRequestBodyFactory.createParameteredBody('caregiverLink'),
                authorizationTaskConstants.caregiverLink_update
            ),

            readSubscriberHolidayPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberHolidayPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscriberHoliday: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberHoliday,
                serviceRequestBodyFactory.createParameteredBody('holidayId'),
                authorizationTaskConstants.subscriber_read
            ),
            createSubscriberHoliday: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberHoliday,
                serviceRequestBodyFactory.createParameteredBody('holiday'),
                authorizationTaskConstants.subscriber_update
            ),
            updateSubscriberHoliday: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberHoliday,
                serviceRequestBodyFactory.createParameteredBody('holiday'),
                authorizationTaskConstants.subscriber_update
            ),
            deleteSubscriberHoliday: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberHoliday,
                serviceRequestBodyFactory.createParameteredBody('holidayId'),
                authorizationTaskConstants.subscriber_delete
            ),

            readAbsenceReasonPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readAbsenceReasonPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),
            readAbsenceReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readAbsenceReason,
                serviceRequestBodyFactory.createParameteredBody('absenceReasonId'),
                authorizationTaskConstants.subscriber_read
            ),
            createAbsenceReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createAbsenceReason,
                serviceRequestBodyFactory.createParameteredBody('absenceReason'),
                authorizationTaskConstants.subscriber_create
            ),
            updateAbsenceReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateAbsenceReason,
                serviceRequestBodyFactory.createParameteredBody('absenceReason'),
                authorizationTaskConstants.subscriber_update
            ),
            deleteAbsenceReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteAbsenceReason,
                serviceRequestBodyFactory.createParameteredBody('absenceReasonId'),
                authorizationTaskConstants.subscriber_delete
            ),

            readSubscriberTemplatePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberTemplatePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),

            readProjectPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readProjectPage,
                serviceRequestBodyFactory.createComplexPageBody('organizationId'),
                authorizationTaskConstants.subscriber_read
            ),
            readProjectDetailPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readProjectDetailPage,
                serviceRequestBodyFactory.createComplexPageBody('projectId'),
                authorizationTaskConstants.subscriber_read
            ),
            readProjectTreePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readProjectTreePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),
            readProjectDetailTreePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readProjectDetailTreePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriber_read
            ),

            readExternalWebLinksForSubscriberPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readExternalWebLinksForSubscriberPage,
                serviceRequestBodyFactory.createComplexPageBody('subscriberId'),
                authorizationTaskConstants.subscriberExternalWebLink_read
            ),
            createSubscriberExternalWebLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberExternalWebLink,
                serviceRequestBodyFactory.createParameteredBody('externalWebLink'),
                authorizationTaskConstants.subscriberExternalWebLink_create
            ),
            readSubscriberExternalWebLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberExternalWebLink,
                serviceRequestBodyFactory.createParameteredBody('externalWebLinkId'),
                authorizationTaskConstants.subscriberExternalWebLink_read
            ),
            updateSubscriberExternalWebLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberExternalWebLink,
                serviceRequestBodyFactory.createParameteredBody('externalWebLink'),
                authorizationTaskConstants.subscriberExternalWebLink_update
            ),
            deleteSubscriberExternalWebLink: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberExternalWebLink,
                serviceRequestBodyFactory.createParameteredBody('externalWebLinkId'),
                authorizationTaskConstants.subscriberExternalWebLink_delete
            ),

            readExternalWebLinkTypePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readExternalWebLinkTypePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.externalWebLinkType_read
            ),

            readSubscribersForCaregiverPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscribersForCaregiverPage,
                serviceRequestBodyFactory.createComplexPageBody('caregiverId'),
                authorizationTaskConstants.subscriber_read
            ),
            readSubscribersForCaregiverGroupPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscribersForCaregiverGroupPage,
                serviceRequestBodyFactory.createComplexPageBody('caregiverGroupId'),
                authorizationTaskConstants.subscriber_read
            ),

            updateStateOfSubscriberWithSpecificTask: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateStateOfSubscriberWithSpecificTask,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'subscriberStateId', 'subscriberStateChangeData'),
                authorizationTaskConstants.subscriber_update_subscriberState
            ),

            readSubscriberStateChangeReasonPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberStateChangeReasonPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.subscriberStateChangeReason_read
            ),
            readSubscriberStateChangeReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.readSubscriberStateChangeReason,
                serviceRequestBodyFactory.createParameteredBody('subscriberStateChangeReasonId'),
                authorizationTaskConstants.subscriberStateChangeReason_read
            ),
            updateSubscriberStateChangeReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.updateSubscriberStateChangeReason,
                serviceRequestBodyFactory.createParameteredBody("subscriberStateChangeReason"),
                authorizationTaskConstants.subscriberStateChangeReason_update
            ),
            deleteSubscriberStateChangeReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.deleteSubscriberStateChangeReason,
                serviceRequestBodyFactory.createParameteredBody('subscriberStateChangeReason'),
                authorizationTaskConstants.subscriberStateChangeReason_delete
            ),
            createSubscriberStateChangeReason: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.subscriberManagementService.createSubscriberStateChangeReason,
                serviceRequestBodyFactory.createParameteredBody('subscriberStateChangeReason'),
                authorizationTaskConstants.subscriberStateChangeReason_create
            )
           
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('supportingDataManagementServiceProxy',
['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
    "use strict";

    return {
        readContractVersion: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readContractVersion,
            serviceRequestBodyFactory.createParameteredBody('client'),
            authorizationTaskConstants.serviceVersion_read
        ),
        readRegionPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readRegionPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.region_read
        ),
        createRegion: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createRegion,
            serviceRequestBodyFactory.createParameteredBody('region'),
            authorizationTaskConstants.region_create
        ),
        readRegion: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readRegion,
            serviceRequestBodyFactory.createParameteredBody('regionId'),
            authorizationTaskConstants.region_read
        ),
        updateRegion: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateRegion,
            serviceRequestBodyFactory.createParameteredBody('region'),
            authorizationTaskConstants.region_update
        ),
        deleteRegion: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteRegion,
            serviceRequestBodyFactory.createParameteredBody('region'),
            authorizationTaskConstants.region_delete
        ),
        readOrganization: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readOrganization,
            serviceRequestBodyFactory.createParameteredBody('organizationId'),
            authorizationTaskConstants.organization_read
        ),
        readOrganizationPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readOrganizationPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.organization_read
        ),
        readFullOrganizationPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readFullOrganizationPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.organization_read
        ),

        readLevel1OrganizationPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readLevel1OrganizationPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.organization_read
        ),

        readAvailableOrganizationReportPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAvailableOrganizationReportPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.report_read
        ),
        readAvailableReportPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAvailableReportPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.report_read
        ),
        readAvailableReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAvailableReport,
            serviceRequestBodyFactory.createParameteredBody("availableReportId"),
            authorizationTaskConstants.report_read
        ),
        createAvailableReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createAvailableReport,
            serviceRequestBodyFactory.createParameteredBody("availableReport"),
            authorizationTaskConstants.report_create
        ),
        updateAvailableReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateAvailableReport,
            serviceRequestBodyFactory.createParameteredBody("availableReport"),
            authorizationTaskConstants.report_update
        ),
        deleteAvailableReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteAvailableReport,
            serviceRequestBodyFactory.createParameteredBody("availableReport"),
            authorizationTaskConstants.report_delete
        ),
        searchAvailableReports: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.searchAvailableReports,
            serviceRequestBodyFactory.createSearchPageBody,
            authorizationTaskConstants.report_read
        ),

        readOrganizationReportPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readOrganizationReportPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.report_read
        ),
        createOrganizationReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createOrganizationReport,
            serviceRequestBodyFactory.createParameteredBody("organizationReport"),
            authorizationTaskConstants.report_create
        ),
        readOrganizationReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readOrganizationReport,
            serviceRequestBodyFactory.createParameteredBody("organizationReportId"),
            authorizationTaskConstants.report_read
        ),
        updateOrganizationReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateOrganizationReport,
            serviceRequestBodyFactory.createParameteredBody("organizationReport"),
            authorizationTaskConstants.report_update
        ),
        deleteOrganizationReport: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteOrganizationReportWithId,
            serviceRequestBodyFactory.createParameteredBody("organizationReportId"),
            authorizationTaskConstants.report_delete
        ),

        readCoInhabitantTypePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCoInhabitantTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.coInhabitantType_read
        ),
        createCoInhabitantType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createCoInhabitantType,
            serviceRequestBodyFactory.createParameteredBody('coInhabitantType'),
            authorizationTaskConstants.coInhabitantType_create
        ),
        readCoInhabitantType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCoInhabitantType,
            serviceRequestBodyFactory.createParameteredBody('coInhabitantTypeId'),
            authorizationTaskConstants.coInhabitantType_read
        ),
        updateCoInhabitantType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateCoInhabitantType,
            serviceRequestBodyFactory.createParameteredBody('coInhabitantType'),
            authorizationTaskConstants.coInhabitantType_update
        ),
        deleteCoInhabitantType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteCoInhabitantType,
            serviceRequestBodyFactory.createParameteredBody('coInhabitantType'),
            authorizationTaskConstants.coInhabitantType_delete
        ),
        readDistrictPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readDistrictPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.district_read
        ),
        createDistrict: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createDistrict,
            serviceRequestBodyFactory.createParameteredBody('district'),
            authorizationTaskConstants.district_create
        ),
        readDistrict: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readDistrict,
            serviceRequestBodyFactory.createParameteredBody('districtId'),
            authorizationTaskConstants.district_read
        ),
        updateDistrict: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateDistrict,
            serviceRequestBodyFactory.createParameteredBody('district'),
            authorizationTaskConstants.district_update
        ),
        deleteDistrict: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteDistrict,
            serviceRequestBodyFactory.createParameteredBody('district'),
            authorizationTaskConstants.district_delete
        ),
        readRelationTypePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readRelationTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.relationType_read
        ),
        createRelationType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createRelationType,
            serviceRequestBodyFactory.createParameteredBody('relationType'),
            authorizationTaskConstants.relationType_create
        ),
        readRelationType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readRelationType,
            serviceRequestBodyFactory.createParameteredBody('relationTypeId'),
            authorizationTaskConstants.relationType_read
        ),
        updateRelationType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateRelationType,
            serviceRequestBodyFactory.createParameteredBody('relationType'),
            authorizationTaskConstants.relationType_update
        ),
        deleteRelationType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteRelationType,
            serviceRequestBodyFactory.createParameteredBody('relationType'),
            authorizationTaskConstants.relationType_delete
        ),
        readSkillPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readSkillPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.skill_read
        ),
        createAspect: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createAspect,
            serviceRequestBodyFactory.createParameteredBody('aspect'),
            authorizationTaskConstants.aspect_create
        ),
        readAspect: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAspect,
            serviceRequestBodyFactory.createParameteredBody('aspectId'),
            authorizationTaskConstants.aspect_read
        ),
        readAspectForCharacteristicPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAspectForCharacteristicPage,
            serviceRequestBodyFactory.createComplexPageBody("level1OrganizationId"),
            authorizationTaskConstants.aspect_read
        ),
        updateAspect: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateAspect,
            serviceRequestBodyFactory.createParameteredBody('aspect'),
            authorizationTaskConstants.aspect_update
        ),
        deleteAspect: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteAspect,
            serviceRequestBodyFactory.createParameteredBody('aspect'),
            authorizationTaskConstants.aspect_delete
        ),
        readAspectPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAspectPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.aspect_read
        ),
        createAspectValue: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createAspectValue,
            serviceRequestBodyFactory.createParameteredBody('aspectValue'),
            authorizationTaskConstants.aspectValue_create
        ),
        readAspectValue: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAspectValue,
            serviceRequestBodyFactory.createParameteredBody('aspectValueId'),
            authorizationTaskConstants.aspectValue_read
        ),
        updateAspectValue: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateAspectValue,
            serviceRequestBodyFactory.createParameteredBody('aspectValue'),
            authorizationTaskConstants.aspectValue_update
        ),
        deleteAspectValue: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteAspectValue,
            serviceRequestBodyFactory.createParameteredBody('aspectValue'),
            authorizationTaskConstants.aspectValue_delete
        ),
        readAspectValuePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAspectValuePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.aspectValue_read
        ),
        readContactItemType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readContactItemType,
            serviceRequestBodyFactory.createParameteredBody('contactItemTypeId'),
            authorizationTaskConstants.contactItemType_read
        ),
        createContactItemType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createContactItemType,
            serviceRequestBodyFactory.createParameteredBody('contactItemType'),
            authorizationTaskConstants.contactItemType_create
        ),
        updateContactItemType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateContactItemType,
            serviceRequestBodyFactory.createParameteredBody('contactItemType'),
            authorizationTaskConstants.contactItemType_update
        ),
        deleteContactItemType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteContactItemType,
            serviceRequestBodyFactory.createParameteredBody('contactItemType'),
            authorizationTaskConstants.contactItemType_delete
        ),
        readContactItemTypePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readContactItemTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.contactItemType_read
        ),
        readConsumerState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readConsumerState,
            serviceRequestBodyFactory.createParameteredBody('consumerStateId'),
            authorizationTaskConstants.consumerState_read
        ),
        createConsumerState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createConsumerState,
            serviceRequestBodyFactory.createParameteredBody('consumerState'),
            authorizationTaskConstants.consumerState_create
        ),
        updateConsumerState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateConsumerState,
            serviceRequestBodyFactory.createParameteredBody('consumerState'),
            authorizationTaskConstants.consumerState_update
        ),
        deleteConsumerState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteConsumerState,
            serviceRequestBodyFactory.createParameteredBody('consumerState'),
            authorizationTaskConstants.consumerState_delete
        ),
        readConsumerStatePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readConsumerStatePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.consumerState_read
        ),
        readPersonalizationPanelSettings: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readPersonalization_Panelsettings,
            serviceRequestBodyFactory.createParameteredBody('organizationId'),
            authorizationTaskConstants.personalization_read
        ),
        readPersonalizationFieldSettings: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readPersonalization_Fieldsettings,
            serviceRequestBodyFactory.createParameteredBody('organizationId'),
            authorizationTaskConstants.personalization_read
        ),
        readCountryPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCountryPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.country_read
        ),
        createCountry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createCountry,
            serviceRequestBodyFactory.createParameteredBody('country'),
            authorizationTaskConstants.country_create
        ),
        readCountry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCountry,
            serviceRequestBodyFactory.createParameteredBody('countryId'),
            authorizationTaskConstants.country_read
        ),
        updateCountry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateCountry,
            serviceRequestBodyFactory.createParameteredBody('country'),
            authorizationTaskConstants.country_update
        ),
        deleteCountry: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteCountry,
            serviceRequestBodyFactory.createParameteredBody('country'),
            authorizationTaskConstants.country_delete
        ),

        readSalutationPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readSalutationPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.salutation_read
        ),
        readSalutation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readSalutation,
            serviceRequestBodyFactory.createParameteredBody('salutationId'),
            authorizationTaskConstants.salutation_read
        ),
        createSalutation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createSalutation,
            serviceRequestBodyFactory.createParameteredBody('salutation'),
            authorizationTaskConstants.salutation_create
        ),
        updateSalutation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateSalutation,
            serviceRequestBodyFactory.createParameteredBody('salutation'),
            authorizationTaskConstants.salutation_update
        ),
        deleteSalutation: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteSalutation,
            serviceRequestBodyFactory.createParameteredBody('salutation'),
            authorizationTaskConstants.salutation_delete
        ),

        createTitle: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createTitle,
            serviceRequestBodyFactory.createParameteredBody('title'),
            authorizationTaskConstants.title_create
        ),
        readTitle: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readTitle,
            serviceRequestBodyFactory.createParameteredBody('titleId'),
            authorizationTaskConstants.title_read
        ),
        updateTitle: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateTitle,
            serviceRequestBodyFactory.createParameteredBody('title'),
            authorizationTaskConstants.title_update
        ),
        deleteTitle: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteTitle,
            serviceRequestBodyFactory.createParameteredBody('title'),
            authorizationTaskConstants.title_delete
        ),
        readTitlePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readTitlePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.title_read
        ),
        readLanguagePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readLanguagePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.language_read
        ),
        readMaritalStatePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readMaritalStatePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.maritalState_read
        ),
        createMaritalState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createMaritalState,
            serviceRequestBodyFactory.createParameteredBody('maritalState'),
            authorizationTaskConstants.maritalState_create
        ),
        readMaritalState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readMaritalState,
            serviceRequestBodyFactory.createParameteredBody('maritalStateId'),
            authorizationTaskConstants.maritalState_read
        ),
        updateMaritalState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateMaritalState,
            serviceRequestBodyFactory.createParameteredBody('maritalState'),
            authorizationTaskConstants.maritalState_update
        ),
        deleteMaritalState: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteMaritalState,
            serviceRequestBodyFactory.createParameteredBody('maritalState'),
            authorizationTaskConstants.maritalState_delete
        ),

        readNewOrganizationMessageCount: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readNewOrganizationMessageCount,
            serviceRequestBodyFactory.createParameteredBody('currentSortIndex'),
            authorizationTaskConstants.none
        ),
        readOrganizationNotePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readOrganizationNotePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.organization_read
        ),
        createOrganizationNote: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createOrganizationNote,
            serviceRequestBodyFactory.createParameteredBody('note'),
            authorizationTaskConstants.organization_create
        ),
        readCityPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCityPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.city_read
        ),
        createCity: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createCity,
            serviceRequestBodyFactory.createParameteredBody('city'),
            authorizationTaskConstants.city_create
        ),
        readCity: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readCity,
            serviceRequestBodyFactory.createParameteredBody('cityId'),
            authorizationTaskConstants.city_read
        ),
        updateCity: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateCity,
            serviceRequestBodyFactory.createParameteredBody('city'),
            authorizationTaskConstants.city_update
        ),
        deleteCity: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteCity,
            serviceRequestBodyFactory.createParameteredBody('city'),
            authorizationTaskConstants.city_delete
        ),
        readAgreementTypePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAgreementTypePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.agreementType_read
        ),
        createAgreementType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createAgreementType,
            serviceRequestBodyFactory.createParameteredBody('agreementType'),
            authorizationTaskConstants.agreementType_create
        ),
        readAgreementType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readAgreementType,
            serviceRequestBodyFactory.createParameteredBody('agreementTypeId'),
            authorizationTaskConstants.agreementType_read
        ),
        updateAgreementType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateAgreementType,
            serviceRequestBodyFactory.createParameteredBody('agreementType'),
            authorizationTaskConstants.agreementType_update
        ),
        deleteAgreementType: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteAgreementType,
            serviceRequestBodyFactory.createParameteredBody('agreementType'),
            authorizationTaskConstants.agreementType_delete
        ),


        readDoctorReferencePage: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.supportingDataManagementService.readDoctorReferencePage,
			serviceRequestBodyFactory.createSimplePageBody,
			authorizationTaskConstants.doctorReference_read
		),
        readDoctorReference: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.supportingDataManagementService.readDoctorReference,
			serviceRequestBodyFactory.createParameteredBody('doctorReferenceId'),
			authorizationTaskConstants.doctorReference_read
        ),
        createDoctorReference: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createDoctorReference,
            serviceRequestBodyFactory.createParameteredBody('doctorReference'),
            authorizationTaskConstants.doctorReference_create
        ),
        updateDoctorReference: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateDoctorReference,
            serviceRequestBodyFactory.createParameteredBody('doctorReference'),
            authorizationTaskConstants.doctorReference_update
        ),
        deleteDoctorReference: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteDoctorReference,
            serviceRequestBodyFactory.createParameteredBody('doctorReference'),
            authorizationTaskConstants.doctorReference_delete
        ),

        readInsuranceClassPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readInsuranceClassPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.insuranceClass_read
        ),
        readInsuranceClass: umoOperationFactory.createSecureProxyOperation(
			umoxServiceUrls.supportingDataManagementService.readInsuranceClass,
			serviceRequestBodyFactory.createParameteredBody('insuranceClassId'),
			authorizationTaskConstants.insuranceClass_read
        ),
        createInsuranceClass: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createInsuranceClass,
            serviceRequestBodyFactory.createParameteredBody('insuranceClass'),
            authorizationTaskConstants.insuranceClass_create
        ),
        updateInsuranceClass: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateInsuranceClass,
            serviceRequestBodyFactory.createParameteredBody('insuranceClass'),
            authorizationTaskConstants.insuranceClass_update
        ),
        deleteInsuranceClass: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteInsuranceClass,
            serviceRequestBodyFactory.createParameteredBody('insuranceClass'),
            authorizationTaskConstants.insuranceClass_delete
        ),
        downloadClientDocument: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.downloadClientDocument,
            serviceRequestBodyFactory.createParameteredBody('subscriptionNumber', 'documentPath'),
            authorizationTaskConstants.clientDocument_read
        ),

        readInsurerPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readInsurerPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.insurer_read
        ),
        createInsurer: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createInsurer,
            serviceRequestBodyFactory.createParameteredBody('insurer'),
            authorizationTaskConstants.insurer_create
        ),
        readInsurer: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readInsurer,
            serviceRequestBodyFactory.createParameteredBody('insurerId'),
            authorizationTaskConstants.insurer_read
        ),
        updateInsurer: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.updateInsurer,
            serviceRequestBodyFactory.createParameteredBody('insurer'),
            authorizationTaskConstants.insurer_update
        ),
        deleteInsurer: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.deleteInsurer,
            serviceRequestBodyFactory.createParameteredBody('insurer'),
            authorizationTaskConstants.insurer_delete
        ),

        readRootOrganizationAndUserOrganizationsAtLevel1InTree: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readRootOrganizationAndUserOrganizationsAtLevel1InTree,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.organization_read
        ),

        readConsumerGroupPage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readConsumerGroupPage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.consumerGroup_read
        ),

        createOrganizationOperatorPhoneNumber: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.createOrganizationOperatorPhoneNumber,
            serviceRequestBodyFactory.createParameteredBody('phoneNumber'),
            authorizationTaskConstants.organization_create
        ),

        readConsumerGroupForDevicePage: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.readConsumerGroupForDevicePage,
            serviceRequestBodyFactory.createSimplePageBody,
            authorizationTaskConstants.consumerGroup_read
        ),
        getDefaultConsumerGroupForDeviceLinkedToSubscriberInOrganization: umoOperationFactory.createSecureProxyOperation(
            umoxServiceUrls.supportingDataManagementService.getDefaultConsumerGroupForDeviceLinkedToSubscriberInOrganization,
            serviceRequestBodyFactory.createParameteredBody('subscriberOrganizationId'),
            authorizationTaskConstants.consumerGroup_read
        )                        
    };
}]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('userManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            registerSubscriber: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.userManagementService.registerSubscriber,
                serviceRequestBodyFactory.createParameteredBody('email', 'password')
            ),
            activateUserAccount: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.userManagementService.activateUserAccount,
                serviceRequestBodyFactory.createParameteredBody('email', 'activationCode')
            ),
            requestPasswordReset: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.userManagementService.requestPasswordReset,
                serviceRequestBodyFactory.createParameteredBody('email')
            ),
            resetPassword: umoOperationFactory.createProxyOperation(
                umoxServiceUrls.userManagementService.resetPassword,
                serviceRequestBodyFactory.createParameteredBody('email', 'password', 'resetCode')
            ),
            changeUserPassword: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.changeUserPassword,
                serviceRequestBodyFactory.createParameteredBody('username', 'newPassword'),
                authorizationTaskConstants.any_user_update
            ),
            selfChangeUserPassword: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.selfChangeUserPassword,
                serviceRequestBodyFactory.createParameteredBody('username', 'oldPassword', 'newPassword'),
                authorizationTaskConstants.none
            ),
            changePassword: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.changePassword,
                serviceRequestBodyFactory.createParameteredBody('oldPassword', 'newPassword'),
                authorizationTaskConstants.user_update
            ),
            checkTaskAuthorization: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.checkTaskAuthorization,
                serviceRequestBodyFactory.createParameteredBody('taskNames'),
                authorizationTaskConstants.none
            ),
            checkModuleAuthorization: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.checkModuleAuthorization,
                serviceRequestBodyFactory.createParameteredBody('moduleNames'),
                authorizationTaskConstants.none
            ),
            readCurrentOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readCurrentOperator,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.operator_read
            ),
            readOperatorPhoneNumberPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readOperatorPhoneNumberPage,
                serviceRequestBodyFactory.createComplexPageBody('operatorId'),
                authorizationTaskConstants.operator_read
            ),
            createSubscriberUserAccount: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.createSubscriberUserAccount,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'newPassword', 'passwordQuestion', 'passwordAnswer'),
                authorizationTaskConstants.subscriber_update
            ),
            createProfessionalCaregiverUserAccount: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.createProfessionalCaregiverUserAccount,
                serviceRequestBodyFactory.createParameteredBody('professionalCaregiverId', 'newPassword', 'passwordQuestion', 'passwordAnswer'),
                authorizationTaskConstants.professionalCaregiver_update
            ),
            readLoginInfoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readLoginInfoPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.user_read
            ),
            readLoginInfo: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readLoginInfo,
                serviceRequestBodyFactory.createParameteredBody("loginId"),
                authorizationTaskConstants.user_read
            ),
            searchLoginInfo: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.searchLoginInfo,
                serviceRequestBodyFactory.createSearchPageBody,
                authorizationTaskConstants.user_read
            ),
            getAllRoles: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.getAllRoles,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.role_read
            ),
            readRolePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readRolePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.role_read
            ),
            readRoleDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readRoleDto,
                serviceRequestBodyFactory.createParameteredBody("roleId"),
                authorizationTaskConstants.role_read
            ),
            readRoleDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readRoleDtoPage,
                serviceRequestBodyFactory.createParameterlessBody,
                authorizationTaskConstants.role_read
            ),
            readUserRoleDtoPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readUserRoleDtoPage,
                serviceRequestBodyFactory.createParameteredBody("username"),
                authorizationTaskConstants.role_read
            ),
            deleteRoleDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.deleteRoleDto,
                serviceRequestBodyFactory.createParameteredBody("roleId"),
                authorizationTaskConstants.role_delete
            ),
            updateRoleDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.updateRoleDto,
                serviceRequestBodyFactory.createParameteredBody("roleInformationDto"),
                authorizationTaskConstants.role_update
            ),
            createRoleDto: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.createRoleDto,
                serviceRequestBodyFactory.createParameteredBody("roleInformationDto"),
                authorizationTaskConstants.role_create
            ),
            validForDeletion: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.validForDeletion,
                serviceRequestBodyFactory.createParameteredBody("roleId"),
                authorizationTaskConstants.role_read
            ),
            getRolesForUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.getRolesForUser,
                serviceRequestBodyFactory.createParameteredBody("username"),
                authorizationTaskConstants.role_read
            ),
            readPersonIdForLogin: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readPersonIdForLogin,
                serviceRequestBodyFactory.createParameteredBody("loginId"),
                authorizationTaskConstants.operator_read
            ),
            readPerson: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readPerson,
                serviceRequestBodyFactory.createParameteredBody("personId"),
                authorizationTaskConstants.person_read
            ),
            updatePerson: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.updatePerson,
                serviceRequestBodyFactory.createParameteredBody("person"),
                authorizationTaskConstants.person_update
            ),
            readOperatorPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readOperatorPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.operator_read
            ),
            searchOperators: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.searchOperators,
                serviceRequestBodyFactory.createSearchPageBody,
                authorizationTaskConstants.operator_read
            ),
            deleteLogin: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.deleteLogin,
                serviceRequestBodyFactory.createParameteredBody("loginId"),
                authorizationTaskConstants.user_delete
            ),
            readPersonIdForOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readPersonIdForOperator,
                serviceRequestBodyFactory.createParameteredBody("operatorId"),
                authorizationTaskConstants.person_read
            ),
            readOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readOperator,
                serviceRequestBodyFactory.createParameteredBody("operatorId"),
                authorizationTaskConstants.operator_read
            ),
            createOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.createOperator,
                serviceRequestBodyFactory.createParameteredBody("newOperator", "password", "emailAddress", "passwordQuestion", "passwordAnswer"),
                authorizationTaskConstants.operator_create
            ),
            createOperatorWithDto:  umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.createOperatorWithDto,
                serviceRequestBodyFactory.createParameteredBody("operatorDto"),
                authorizationTaskConstants.operator_create
            ),
            updateOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.updateOperator,
                serviceRequestBodyFactory.createParameteredBody("domainOperator"),
                authorizationTaskConstants.operator_update
            ),
            deleteOperator: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.deleteOperator,
                serviceRequestBodyFactory.createParameteredBody("domainOperator"),
                authorizationTaskConstants.operator_delete
            ),
            enableUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.enableUser,
                serviceRequestBodyFactory.createParameteredBody('username'),
                authorizationTaskConstants.user_update
            ),
            disableUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.disableUser,
                serviceRequestBodyFactory.createParameteredBody('username'),
                authorizationTaskConstants.user_update
            ),
            unlockUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.unlockUser,
                serviceRequestBodyFactory.createParameteredBody('username'),
                authorizationTaskConstants.user_update
            ),
            removeRolesFromUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.removeRolesFromUser,
                serviceRequestBodyFactory.createParameteredBody('username', 'roleNames'),
                authorizationTaskConstants.user_update
            ),
            addRolesToUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.addRolesToUser,
                serviceRequestBodyFactory.createParameteredBody('username', 'roleNames'),
                authorizationTaskConstants.user_update
            ),
            readModulePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readModulePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.none
            ),
            readModuleWithApplicableTasksPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.userManagementService.readModuleWithApplicableTasksPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.none
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('wellBeingManagementServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";
        return {
            readCallBackAppointmentPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readCallBackAppointmentPage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointment_read
            ),
            readCallBackAppointmentTypePage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readCallBackAppointmentTypePage,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointmentType_read
            ),
            createCallBackAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.createCallBackAppointment,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'plannedTime', 'appointmentTypeId', 'preferredCaller', 'rangeStartDate', 'rangeEndDate', 'remarks', 'recurrenceType', 'recurrenceFrequency'),
                authorizationTaskConstants.appointment_create
            ),
            createCallBackAppointmentBatch: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.createCallBackAppointmentBatch,
                serviceRequestBodyFactory.createParameteredBody('subscriberFilter', 'callBackAppointment'),
                authorizationTaskConstants.appointment_create
            ),
            readCallBackAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readCallBackAppointment,
                serviceRequestBodyFactory.createParameteredBody('appointmentId', 'noLock'),
                authorizationTaskConstants.appointment_read
            ),
            updateCallBackAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.updateCallBackAppointment,
                serviceRequestBodyFactory.createParameteredBody('appointmentId', 'escalate', 'message', 'nextAppointmentInitialState', 'nextAppointmentPlannedTime', 'nextAppointmentPreferredCaller', 'postpone', 'cancel'),
                authorizationTaskConstants.appointment_update
            ),
            deleteCallBackAppointment: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.deleteCallBackAppointment,
                serviceRequestBodyFactory.createParameteredBody('appointmentId'),
                authorizationTaskConstants.appointment_delete
            ),
            deactivateWellBeing: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.deactivateWellBeing,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.appointment_delete
            ),
            readSubscriberInfo: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readSubscriberInfo,
                serviceRequestBodyFactory.createParameteredBody('subscriberId'),
                authorizationTaskConstants.appointment_read
            ),
            createCallBackAppointmentType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.createCallBackAppointmentType,
                serviceRequestBodyFactory.createParameteredBody('callBackAppointmentType'),
                authorizationTaskConstants.appointmentType_create
            ),
            readCallBackAppointmentType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readCallBackAppointmentType,
                serviceRequestBodyFactory.createParameteredBody('callBackAppointmentTypeId'),
                authorizationTaskConstants.appointmentType_read
            ),
            updateCallBackAppointmentType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.updateCallBackAppointmentType,
                serviceRequestBodyFactory.createParameteredBody('callBackAppointmentType'),
                authorizationTaskConstants.appointmentType_update
            ),
            deleteCallBackAppointmentType: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.deleteCallBackAppointmentType,
                serviceRequestBodyFactory.createParameteredBody('callBackAppointmentType'),
                authorizationTaskConstants.appointmentType_delete
            ),
            readPlannedCallBackAppointmentNumberAtTimeOfDayPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readPlannedCallBackAppointmentNumberAtTimeOfDayPage,
                serviceRequestBodyFactory.createParameteredBody('startDate', 'endDate', 'topOrganizationId', 'preferredCaller'),
                authorizationTaskConstants.appointment_read
            ),
            postponeCallBackAppointments: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.postponeCallBackAppointments,
                serviceRequestBodyFactory.createParameteredBody('filters', 'postponeMinutes', 'postponeToMoment', 'message'),
                authorizationTaskConstants.appointment_update
            ),
            updateCallBackAppointmentDetails: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.updateCallBackAppointmentDetails,
                serviceRequestBodyFactory.createParameteredBody('appointmentId', 'rangeStartDate', 'rangeEndDate', 'remarks'),
                authorizationTaskConstants.appointmentType_update
            ),
            unlockAppointmentLockedByCurrentUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.unlockAppointmentLockedByCurrentUser,
                serviceRequestBodyFactory.createParameteredBody('appointmentId'),
                authorizationTaskConstants.appointment_read
            ),
            unlockAllAppointmentsLockedByCurrentUser: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.unlockAllAppointmentsLockedByCurrentUser,
                serviceRequestBodyFactory.createSimplePageBody,
                authorizationTaskConstants.appointment_read
            ),
            readHistoricEventPage: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wellBeingDataManagementService.readHistoricEventPage,
                serviceRequestBodyFactory.createParameteredBody('subscriberId', 'pageDescriptor'),
                authorizationTaskConstants.appointment_read
            )
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.proxy').factory('wizardServiceProxy',
    ['umoOperationFactory', 'umoxServiceUrls', 'serviceRequestBodyFactory', 'authorizationTaskConstants', function (umoOperationFactory, umoxServiceUrls, serviceRequestBodyFactory, authorizationTaskConstants) {
        "use strict";

        return {
            createSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wizardService.createSubscriber,
                serviceRequestBodyFactory.createParameteredBody('subscriber'),
				authorizationTaskConstants.none
            ),
            updateSubscriber: umoOperationFactory.createSecureProxyOperation(
                umoxServiceUrls.wizardService.updateSubscriber,
                serviceRequestBodyFactory.createParameteredBody('subscriber'),
				authorizationTaskConstants.none
            ),
        };
    }]);

angular.module('verklizan.umox.common.html5.vkz-webrequests.service').provider('debugService',
    function () {
        'use strict';

        var traceLogging = false;
        var traceCaching = false;

        this.appImplementsTraceLogging = function (value) {
            traceLogging = value;
        }

        this.appImplementsTraceCaching = function (value) {
            traceCaching = value;
        }

        this.$get = ['$q', '$window', 'debugServiceProxy', 'domainEnums', 'instanceGUIDService', 'clientSettings', 'settingsService', 'dateExtensionService', 'GenericHttpErrorHandler', function ($q, $window, debugServiceProxy, domainEnums, instanceGUIDService,
                                clientSettings, settingsService, dateExtensionService, GenericHttpErrorHandler) {

            var traceCache = [];
            var errorHandler = GenericHttpErrorHandler.createWithErrorCodesEnabled();
            var currentUmoXUser;

            var debugService = {

                startUpTrace: function () {
                    if (traceLogging === false) { return $q.resolve(); }
                    var traceData = new StartUpData(domainEnums.traceEventTypeEnum.Start, "Startup");
                    addTraceToCache(traceData);
                    return debugServiceProxy.createTrace([traceData], errorHandler).then(onSuccessful(traceData));
                },

                stopTrace: function () {
                    if (traceLogging === false) { return $q.resolve(); }
                    var traceData = new TraceData(domainEnums.traceEventTypeEnum.Stop, "Stop");
                    addTraceToCache(traceData);
                    return debugServiceProxy.createTrace([traceData], errorHandler).then(onSuccessful(traceData));
                },

                errorTrace: function (data) {
                    if (traceLogging === false) { return $q.resolve(); }
                    if ($window.isNullOrUndefined(data)) {
                        throw new Error('Missing data for Error Trace');
                    }
                    var traceData = new TraceData(domainEnums.traceEventTypeEnum.Error, data);
                    traceData.ExceptionType = "VKZ_Client_Exception";
                    addTraceToCache(traceData);
                    return debugServiceProxy.createTrace([traceData], errorHandler).then(onSuccessful(traceData));
                },

                getTraceCache: function () {
                    return traceCache;
                },

                setUmoXUser: function (userName) {
                    currentUmoXUser = userName;
                }
            }

            function TraceData(_traceEventType, _data) {
                if ($window.isNullOrUndefined(_data)) {
                    throw 'bad configuration TraceData';
                }

                this.Data = _data;
                this.ReferenceNumber = null;
                this.TraceStamp = dateExtensionService.convertDateToMsUtc(new Date());
                this.InstanceGuid = instanceGUIDService.createOrRetrieveInstanceGUID(); //Required
                this.ClientSessionGuid = undefined; // on purpose called undefined here because it is intentional to leave it undefined...
                this.Source = domainEnums.traceSourceType.Executable;
                this.TraceEventType = _traceEventType;
                this.UmoXUser = currentUmoXUser;
                this.__type = "ClientTraceData:www.verklizan.com"; //required for serialization purposes
            }

            function StartUpData(_traceEventType, _traceMessage) {
                var traceData = new TraceData(_traceEventType, _traceMessage);
                traceData.ApplicationName = settingsService.getApplicationName();
                traceData.ApplicationVersion = settingsService.getApplicationVersion();
                traceData.BrowserName = clientSettings.browserName;
                traceData.BrowserVersion = clientSettings.browserVersion;
                traceData.BrowserPlatform = clientSettings.browserEngine;
                traceData.UserAgent = clientSettings.browser;
                traceData.OSInfo = clientSettings.systemInfo;
                traceData.DeviceInfo = $window.isNullOrUndefined(clientSettings.device) === false ? JSON.stringify(clientSettings.device) : null;
                return traceData;
            }

            function onSuccessful(trace) {
                return function (isSuccess) {
                    if (isSuccess === true && traceCaching === true) {
                        var index = traceCache.indexOf(trace);
                        if (index !== -1) {
                            traceCache.splice(index, 1);
                        }
                    }
                    return {
                        isSuccess: isSuccess,
                        trace : trace
                    }
                }
            }

            function addTraceToCache(trace) {
                if (traceCaching === true) {
                    traceCache.push(trace);
                }
            }

            return debugService;
        }]
    }
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.service').service('loginService',
    ['$q', '$window', 'securityTokenService', 'hashService', 'loginServiceProxy', 'taskAuthorizationService', 'moduleAuthorizationService', 'debugService', 'cachedSessionStorageService', function ($q, $window, securityTokenService, hashService, loginServiceProxy,
        taskAuthorizationService, moduleAuthorizationService, debugService, cachedSessionStorageService) {
        'use strict';

        // =======================
        // Private Fields
        // =======================
        var amountOfLogins = 0;

        // =======================
        // Public Methods
        // =======================
        this.login = function (username, password) {
            if ($window.isNullOrUndefined(username) || $window.isNullOrUndefined(password)) {
                return $q.reject(new Error('userName or password missing'));
            }

            var hashedPassword = hashService.CreatePasswordHash(username, password);

            return loginServiceProxy
                .login(username, hashedPassword, moduleAuthorizationService.getApplicationSupportedModules())
                .then(loginSuccesCallback);
        }

        this.validate2FA = function (sig_request) {
            if ($window.isNullOrUndefined(sig_request)) {
                return $q.reject(new Error('signature missing'));
            }

            return loginServiceProxy
                .validate2FA(sig_request, moduleAuthorizationService.getApplicationSupportedModules())
                .then(tfaSuccessCallBack);
        }

        this.logout = function () {
            return debugService.stopTrace().then(logout).catch(logout);
        }

        this.isLoginTokenPresent = function () {
            if (securityTokenService.tokenIsPresent()) {
                return true;
            } else {
                return false;
            }
        }

        this.getAmountOfSuccesfulLogins = function () {
            return amountOfLogins;
        }

        this.buildPassageIdRedirectUri = function (clientId, clientState) {
            return loginServiceProxy.buildPassageIdRedirectUri(clientId, clientState);
        }

        // =======================
        // Private Methods
        // =======================
        var loginSuccesCallback = function (response) {
            //get username/password confirmation
            var isValid = response.data.LoginResult;

            //get token
            if (isValid === true) {
                amountOfLogins++;

                // If the TFAToken is not returned, TFA is disabled and login should continue
                if (!response.headers("Token") && response.headers("Identity")) {

                    securityTokenService.setToken(response.headers("Identity"));

                    // We remove the token if it exists and login successful as it's not needed anymore
                    if (cachedSessionStorageService.getSessionStorageItem("tkn")) {
                        cachedSessionStorageService.removeSessionStorageItem("tkn")
                    }

                    // We remove the one-time token if it exists and login successful as it's not needed anymore
                    if (cachedSessionStorageService.getSessionStorageItem("ott")) {
                        cachedSessionStorageService.removeSessionStorageItem("ott")
                    }
                    // We remove the usr token if exists and login successful as it's not needed anymore
                    if (cachedSessionStorageService.getSessionStorageItem("usr")) {
                        cachedSessionStorageService.removeSessionStorageItem("usr")
                    }
                }

                return $q.resolve(response);
            } else {
                return $q.reject(new Error('_LoginError_Failed_'));
            }
        };

        var tfaSuccessCallBack = function (response) {
            var isValid = response.data.Validate2FAResult;

            //get token
            if (isValid === true) {

                amountOfLogins++;
                securityTokenService.setToken(response.headers("Identity"));

                // We remove the token if it exists and login successful as it's not needed anymore
                if (cachedSessionStorageService.getSessionStorageItem("tkn")) {
                    cachedSessionStorageService.removeSessionStorageItem("tkn")
                }

                return $q.resolve(response);
            } else {
                return $q.reject(new Error('_LoginError_Failed_'));
            }
        }

        var logout = function () {
            return loginServiceProxy.logout()
                .then(logoutSuccesCallback)
                .catch(logoutErrorCallback);
        };

        var logoutSuccesCallback = function (response) {
            //get logout confirmation
            var isLoggedout = response;

            //get token
            if (isLoggedout === true) {
                securityTokenService.removeToken();
                taskAuthorizationService.clearTasks();
                moduleAuthorizationService.clearModules();
                return $q.resolve(response);
            }

            return $q.reject(new Error('_LogoutError_Failed_'));
        };

        var logoutErrorCallback = function (error) {
            return $q.reject(error);
        };
    }]
);

angular.module('verklizan.umox.common.html5.vkz-webrequests.service').provider('userDataManagerService',
function () {
    'use strict';

    var userType;

    this.setUserType = function(_userType) {
        userType = _userType;
    };

    //#region public Methods
    this.$get = ['$q', 'USER_ROLES', 'USER_TYPES', 'cachedLocalStorageService', 'securityTokenService', 'loginService', 'loginServiceProxy', 'subscriberManagementServiceProxy', 'userManagementServiceProxy', 'hashService', 'authorizationTaskConstants', 'authorizationModuleConstants', 'taskAuthorizationService', 'moduleAuthorizationService', '$window', 'debugService', function($q, USER_ROLES, USER_TYPES, cachedLocalStorageService, securityTokenService, loginService, loginServiceProxy,
                            subscriberManagementServiceProxy, userManagementServiceProxy, hashService, authorizationTaskConstants, authorizationModuleConstants,
                            taskAuthorizationService, moduleAuthorizationService, $window, debugService) {

        //#region private fields
        //Used for caching the User.
        var USERID_STRING = "UserId";
        //Contains the information of the user.
        var userInfo;
        //A check that will tell you if the last logged in user is the same as the current, usefull for caching.
        var currentUserIsTheSameAsPreviousUser;
        //Contains the logged in UserId, this has been decoupled from the userInfo so that it can be used regardless of knownledge what user is logged in.
        var userInfoId;
        //Contains the type of the logged in user. e.g. Operator, Caregiver, subscriber
        var userRole;
        //Contains tasks for authorization purposes
        var tasks = null;
        //#endregion

        //#region public methods
        var userDataManager = {

            //returns the current user as a promise.
            readCurrentUser: function() {
                return $q.all([setModuleAuthorizations(), setTaskAuthorizations()]).then(readCurrentUser);
            },

            //returns the current userId as a promise.
            getUserId : function() {
                if(angular.isDefined(userInfo)) {
                    return userInfoId;
                }
                return new Error('User not logged in');
            },

            //Checks if the session is a fresh start
            sessionIsFreshStart: function() {
                var firstLogin = this.isFirstLoginSinceAppStart();
                var otherUserLoggedInBefore = !this.isFirstLoginSinceAppStart() && !currentUserIsTheSameAsPreviousUser;
                return firstLogin || otherUserLoggedInBefore;
            },

            //Request for a password reset
            requestPasswordReset : function (username) {
                return userManagementServiceProxy.requestPasswordReset(username);
            },

            //the definite action to reset the password with a new password
            resetPassword : function (username, newPassword, resetCode) {
                var hashedPassword = hashService.CreatePasswordHash(username, newPassword);

                return userManagementServiceProxy.resetPassword(username, hashedPassword, resetCode);
            },

            //change password when still having knownledge of the old password
            changePassword : function (username, oldPassword, newPassword) {
                var hashedOldPassword = hashService.CreatePasswordHash(username, oldPassword);
                var hashedNewPassword = hashService.CreatePasswordHash(username, newPassword);

                return userManagementServiceProxy.changeUserPassword(hashedOldPassword, hashedNewPassword);
            },

            //user change his password when still having knownledge of the old password
            //different from changePassword in the sense that it doesn't require task validation
            selfChangeUserPassword: function (username, oldPassword, newPassword) {
                var hashedOldPassword = hashService.CreatePasswordHash(username, oldPassword);
                var hashedNewPassword = hashService.CreatePasswordHash(username, newPassword);

                return userManagementServiceProxy.selfChangeUserPassword(username, hashedOldPassword, hashedNewPassword);
            },

            //resets the logged in user, e.g. when logging out.
            resetCurrentUser : function() {
                userInfo = null;
                userRole = USER_ROLES.empty;
                tasks = null;
                taskAuthorizationService.clearTasks();
                moduleAuthorizationService.clearModules();
            },

            // This field tells if this is the first login in this app session
            isFirstLoginSinceAppStart : function () {
                return loginService.getAmountOfSuccesfulLogins() === 1;
            },

            //This method checks on specifics to less specifics if it can find an OrganizationId belonging to the logged in user.
            getUserOrganizationId : function () {
                if (!$window.isNullOrUndefined(userInfo.ProfessionalCaregiverIdentity)) {
                    return userInfo.ProfessionalCaregiverIdentity.OrganizationId;
                }
                else if (!$window.isNullOrUndefined(userInfo.OperatorIdentity)) {
                    return userInfo.OperatorIdentity.OrganizationId;
                }
                else if (!$window.isNullOrUndefined(userInfo.OrganizationId)) {
                    return userInfo.OrganizationId;
                }
                return null;
            },

            //Checks if the user is logged in.
            isAuthorized : function () {
                return userInfo !== null && typeof userInfo === "object";
            },

            //Checks if the user is authorized to a specific page.
            //Checks if the user is authorized to a specific page.
            isAuthorizedForRole : function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                if (authorizedRoles.indexOf(USER_ROLES.empty) !== -1) { //contains USER_ROLES.empty
                    return true;
                } else if (authorizedRoles.indexOf(USER_ROLES.all) !== -1 && userRole !== USER_ROLES.empty) { //Check if everyone can access page as long he is logged in (USER_ROLES.empty is false)
                    return true;
                } else if (authorizedRoles.indexOf(userRole) !== -1) { //Check if the authorizedRoles contains the user role.
                    return true;
                } else {
                    return false;
                }
            },

            isCurrentUserTheSameAsPreviousUser: function() {
                return currentUserIsTheSameAsPreviousUser;
            }
        };
        //#endregion

        //#endregion

        //#region private methods
        var handleUser = function(_userInfo)  {
            setUserRole();
            checkIfTheUserStayedTheSame();
            return userInfo;
        };

        var setUserRole = function () {
            if ($window.isNullOrUndefined(userInfo)) {
                userRole = USER_ROLES.empty;
            } else if (!$window.isNullOrUndefined(userInfo.ProfessionalCaregiverIdentity)) {
                userRole = USER_ROLES.caregiver;
            } else if (!$window.isNullOrUndefined(userInfo.OperatorIdentity)) {
                userRole = USER_ROLES.operator;
            } else if (!$window.isNullOrUndefined(userInfo.SubscriptionNumber)) {
                userRole =  USER_ROLES.subscriber;
            }
        };

        var checkIfTheUserStayedTheSame = function () {
            if (!userIdIsSetInLocalStorage()) {
                setUserIdToStorage(userInfoId);
                currentUserIsTheSameAsPreviousUser = true;
                return null;
            }

            currentUserIsTheSameAsPreviousUser = currentUserEqualsPreviousUser();

            return currentUserIsTheSameAsPreviousUser;
        };

        var userIdIsSetInLocalStorage = function () {
            var userIdStorage = getUserIdFromStorage();

            return userIdStorage !== null;
        };

        var getUserIdFromStorage = function () {
            return cachedLocalStorageService.getLocalStorageItem(USERID_STRING);
        };

        var setUserIdToStorage = function (value) {
            cachedLocalStorageService.setLocalStorageItem(USERID_STRING, value);
        };

        var currentUserEqualsPreviousUser = function () {
            if (userInfoId !== getUserIdFromStorage()) {
                setUserIdToStorage(userInfoId);
                return false;
            } else {
                return true;
            }
        };

        var readCurrentUser = function() {
            if(userInfo) {
                return $q.when(userInfo);
            }

            return loginServiceProxy.readCurrentUserInfo().then(function(_userInfo) {
                userInfo = _userInfo;
                userInfoId = userInfo.Person.Id;
                securityTokenService.setExperiationInMinutes(userInfo.CacheTimeoutMinutes);

                //some specific userTypes need additional information to be retrieved and inserted as the userInfo.
                var userInfoPromise = $q.when(userInfo);
                if(userType === USER_TYPES.subscriber) {
                    return userInfoPromise.then(function() {
                        return subscriberManagementServiceProxy.readCurrentSubscriber().then(function(response){
                            userInfo = response;
                            userInfoId = userInfo.Id;
                            return $q.resolve(userInfo).then(handleUser);
                        });
                    });
                }

                return userInfoPromise.then(handleUser);
            }).finally(function () {
                debugService.setUmoXUser(userInfo.UserName);
                debugService.startUpTrace();
            });
        };

        //Responsible for setting up the tasks for the taskAuthorizationService.
        var setTaskAuthorizations = function()  {
            if ($window.isNullOrUndefined(taskAuthorizationService.getTasks()) === false) {
                return $q.resolve();
            }

            var taskNames = [];
            for (var taskName in authorizationTaskConstants) {
                if (authorizationTaskConstants.hasOwnProperty(taskName)) {
                    taskNames.push(authorizationTaskConstants[taskName]);
                }
            }
            return userManagementServiceProxy.checkTaskAuthorization(taskNames).then(function (data) {
                var tasks = {};

                for (var i = 0; i < data.length; i++) {
                    tasks[data[i].TaskName] = data[i].IsAuthorized;
                }

                taskAuthorizationService.setTasks(tasks);
                return $q.resolve(tasks);
            });
        };

        var setModuleAuthorizations = function() {
            if ($window.isNullOrUndefined(moduleAuthorizationService.getModules()) === false) {
                return $q.resolve();
            }

            var moduleNames = [];
            for (var moduleName in authorizationModuleConstants) {
                if (authorizationModuleConstants.hasOwnProperty(moduleName)) {
                    moduleNames.push(authorizationModuleConstants[moduleName]);
                }
            }
            return userManagementServiceProxy.checkModuleAuthorization(moduleNames).then(function (data) {
                var modules = {};

                for (var i = 0; i < data.length; i++) {
                    modules[data[i].ModuleName] = {
                        'IsAuthorized': data[i].IsAuthorized,
                        'FailureReason': data[i].FailureReason
                    };
                }

                moduleAuthorizationService.setModules(modules);
                return $q.when(modules);
            });
        };
        //#endregion

        return userDataManager;

    }];
}
);
