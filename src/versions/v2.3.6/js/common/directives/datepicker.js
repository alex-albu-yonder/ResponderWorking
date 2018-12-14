angular.module('verklizan.umox.mobile.common').directive('diDatepicker',
    function (deviceService, devicePlatformConstants) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                prBinding: '=',
                prShowTime: '=',
                prStartYearDelta: '@',
                prEndYearDelta: '@',
                prDefaultYearDelta: '@'
            },
            templateUrl: 'js/common/directives/datePicker.html',
            link: function (scope, element, attr) {

                //element of the datepicker input
                var datepicker = element.find("input");

                // ============================
                // Public Fields
                // ============================
                // Set the default value if no value has been specified.
                scope.prShowTime = angular.isDefined(scope.prShowTime) ? scope.prShowTime : false;

                // ============================
                // Public Methods
                // ============================
                //click events of the buttons
                scope.showDate = function () {
                    datepicker.mobiscroll('show');
                };

                scope.resetDate = function () {
                    //resets the value of the input field, and the value of the mobiscroll object
                    datepicker.val('');

                    scope.prBinding = "";
                };

                initDatePicker();

                // ============================
                // Private Methods
                // ============================
                function initDatePicker() {
                    //gets the datepicker element                    
                    var datePickerSettings = createDatePickerSettings();

                    // Depending on the setting, the time can also be shown for the picker (instead of only the date).
                    if (scope.prShowTime === true) {
                        datepicker.mobiscroll().datetime(datePickerSettings);
                    } else {
                        datepicker.mobiscroll().date(datePickerSettings);
                    }

                    if (scope.prBinding) {
                        datepicker.mobiscroll('setDate', scope.prBinding, true);
                    }
                }

                function createDatePickerSettings() {
                    var datePickerSettings = {
                        theme: getTheme(),
                        display: 'modal',
                        mode: 'scroller',
                        dateOrder: 'ddMyy',
                        startYear: getStartYear(),
                        endYear: getEndYear(),
                        defaultValue: getDefaultDate(),
                        onSelect: function (value, inst) {
                            scope.$apply(function () {
                                var date = datepicker.mobiscroll('getDate');

                                scope.prBinding = date;
                            });
                        }
                    };

                    return datePickerSettings;
                }

                function getTheme() {
                    switch (deviceService.platform) {
                        case devicePlatformConstants.iOS:
                            return 'ios7';
                        case devicePlatformConstants.Android:
                            return 'android-holo light';
                        case devicePlatformConstants.WP8:
                        case devicePlatformConstants.WP7:
                            return 'wp light';
                        default:
                            return 'android-holo light';
                    }
                }

                function getStartYear() {
                    var now = new Date();
                    var startYearDelta = parseInt(scope.prStartYearDelta) | 0;

                    return now.getFullYear() + startYearDelta;
                }

                function getEndYear() {
                    var now = new Date();
                    var endYearDelta = parseInt(scope.prEndYearDelta) | 0;

                    return now.getFullYear() + endYearDelta;
                }

                function getDefaultDate() {
                    var defaultDate = new Date();

                    if (scope.prDefaultYearDelta) {
                        var defaultYearDelta = parseInt(scope.prDefaultYearDelta) | 0;
                        var defaultYear = defaultDate.getFullYear() + defaultYearDelta;
                        defaultDate = new Date(defaultYear, 0, 1);
                    }

                    return defaultDate;
                }
            }
        }
    }
);