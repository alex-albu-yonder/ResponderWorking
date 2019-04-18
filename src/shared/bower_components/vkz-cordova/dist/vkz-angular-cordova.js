/**
 * @ngdoc overview
 * @name CordovaAPI
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova', []);

/**
 * @ngdoc service
 * @name CordovaAPI.cameraService
 * @requires $window
 * @requires $q
 * @requires $rootScope
 * @requires CordovaAPI.cordovaReady
 *
 * @description
 * The cameraService allows for easier use of the camera api's of cordova.
 *
 * **Note:** Requires Cordova.
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('cameraService',
    ['$rootScope', '$q', '$window', 'cordovaReady', function ($rootScope, $q, $window, cordovaReady) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var cameraService = {};
        var defferedCameraImage;
        var cameraOptions;
        var defaultQuality = 49; //override for iOS to prevent memory problems

        // ============================
        // Public Methods
        // ============================

        /**
         * @ngdoc method
         * @name getPicture
         * @methodOf CordovaAPI.cameraService
         * @param {Object} options allows for settings settings like imagequality and destinationtype.
         * @returns {promise} returns a promise which will be resolved with the imageData on success or rejected with the error message on failure.
         *
         * @description
         * getPicture method will make a picture with the specified options and return a resolved promise with the imageData on success.
        */
        cameraService.getPicture = function (options) {
            defferedCameraImage = $q.defer();
            cameraOptions = options || {};

            cordovaReady.then(cameraSuccessCallback).catch(cameraErrorCallback);

            return defferedCameraImage.promise;
        };

        // ============================
        // Private Methods
        // ============================
        var cameraSuccessCallback = function () {
            var resolvedOptions = resolveOptions(cameraOptions);

            $window.navigator.camera.getPicture(function (imageData) {
                defferedCameraImage.resolve(imageData);
            }, function (error) {
                defferedCameraImage.reject(error);
            }, resolvedOptions);

        };

        var cameraErrorCallback = function (message) {
            message = message || "camera is currently unavailable";
            return defferedCameraImage.reject(message);
        };

        var resolveOptions = function (options) {
            var resolvedOptions = options;
            var destinationTypes = $window.navigator.camera.DestinationType;

            resolvedOptions.quality = defaultQuality;
            resolvedOptions.destinationType = options.returnAsBytes === true ? destinationTypes.DATA_URL : destinationTypes.FILE_URI;

            return resolvedOptions;
        };

        return cameraService;
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.cordovaIsPresent
 * @requires $window
 *
 * @description
 * Service which checks if cordova is present. The service will return a true or false boolean depending
 * if specific global variables are set, the file system is used and the useragent matches a mobile device.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('cordovaIsPresent',
    ['$window', function ($window) {
        'use strict';

        var hasCordovaVariable = ($window.cordova || $window.PhoneGap || $window.phonegap);
        var usesCorrectProtocol = /^file:\/{3}[^\/]/i.test($window.location.href);
        var hasCorrectUserAgent = /ios|iphone|ipod|ipad|android/i.test($window.navigator.userAgent);

        var cordovaIsPresent = hasCordovaVariable && usesCorrectProtocol && hasCorrectUserAgent;

        return !!cordovaIsPresent;
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.cordovaReady
 * @requires $q
 * @requires CordovaAPI.cordovaIsPresent 
 * @requires $window
 *
 * @description
 * The service will return a resolved or rejected promise which depends on if cordovaIsPresent is true and the deviceready event is triggered.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('cordovaReady',
    ['$q', 'cordovaIsPresent', '$window', function ($q, cordovaIsPresent, $window) {
        'use strict';
        var defferedCordovaLoaded = $q.defer();

        if (cordovaIsPresent) {
            if (! /ios|iphone|ipod|ipad|android/i.test($window.navigator.userAgent)) {
                onDeviceReady();
            } else {
                $window.document.addEventListener('deviceready', onDeviceReady, false);
            }
        } else {
            defferedCordovaLoaded.reject();
        }

        function onDeviceReady() {
            defferedCordovaLoaded.resolve();
        }

        return defferedCordovaLoaded.promise;
    }]
);

/**
 * @ngdoc object
 * @name CordovaAPI.devicePlatformConstants
 *
 * @description
 * constant values for the different platforms in cordova
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').constant('devicePlatformConstants', {
    
    /**
     * @ngdoc property
     * @name iOS
     * @propertyOf CordovaAPI.devicePlatformConstants
     *
     * @description
     * magic string for iOS which matches the magic string used in Cordova for the iOS platform
    */
    iOS: 'iOS',
    /**
     * @ngdoc property
     * @name Android
     * @propertyOf CordovaAPI.devicePlatformConstants
     *
     * @description
     * magic string for iOS which matches the magic string used in Cordova for the Android platform
    */
    Android: 'Android',
    /**
     * @ngdoc property
     * @name WP8
     * @propertyOf CordovaAPI.devicePlatformConstants
     *
     * @description
     * magic string for iOS which matches the magic string used in Cordova for the WP8 platform
    */
    WP8: 'Win32NT',
    /**
     * @ngdoc property
     * @name WP7
     * @propertyOf CordovaAPI.devicePlatformConstants
     *
     * @description
     * magic string for iOS which matches the magic string used in Cordova for the WP7 platform
    */
    WP7: 'WinCE',
    /**
     * @ngdoc property
     * @name Tizen
     * @propertyOf CordovaAPI.devicePlatformConstants
     *
     * @description
     * magic string for iOS which matches the magic string used in Cordova for the Tizen platform
    */
    Tizen: 'Tizen'
});

/**
 * @ngdoc service
 * @name CordovaAPI.deviceService
 * @requires CordovaAPI.cordovaReady
 * @requires $window
 *
 * @description
 * This service collect information about the device and return an object with 3 properties : platform, model and version
 * This service is asnyc.
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('deviceService',
    ['cordovaReady', '$window', function (cordovaReady, $window) {

        var deviceFactory = {};

        cordovaReady.then(function () {
            deviceFactory.platform = $window.device.platform;
            deviceFactory.model = $window.device.model;
            deviceFactory.version = $window.device.version;
            deviceFactory.cordovaVersion = $window.device.cordova;
            deviceFactory.deviceUUID = $window.device.uuid;
        });

        return deviceFactory;
    }]
);

/**
 * @ngdoc directive
 * @name CordovaAPI.directives.diHideOnKeyboard
 *
 * @description
 * This directive allows you to bind an element to the keyboard events, so that the elements can be shown when no keyboard present and hidden when there is.
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').directive('diHideOnKeyboard', ['keyboardService', function (keyboardService) {
    'use strict';

    return {
        link: function ($scope, element) {
            //Hide the element when the keyboard is shown
            var onShowKeyboard = function () {
                element.hide();
            }
            //Show the element when the keyboard is hidden.
            var onHideKeyboard = function () {
                element.show();
            }

            //Register the events
            keyboardService.registerOnKeyboardShow(onShowKeyboard);
            keyboardService.registerOnKeyboardHide(onHideKeyboard);

            //Important because the events are added in another Service. So we have to remove them manually.
            $scope.$on('$destroy', function () {
                keyboardService.unregisterOnKeyboardShow(onShowKeyboard);
                keyboardService.unregisterOnKeyboardHide(onHideKeyboard);
            });
        }
    }
}]);

/**
 * @ngdoc service
 * @name CordovaAPI.geolocationService
 * @requires $rootScope
 *
 * @description
 * This Service will return a resolved promise with the geolocation information specified at http://cordova.apache.org/docs/en/2.5.0/cordova_geolocation_geolocation.md.html when succesful.
 * When unsuccesful a rejected promise with the error message is returned.
 * This service is async.
 *
 * **Note:** requires Cordova or a browser with the geolocation API implemented.
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('geolocationService',
    ['$rootScope', '$q', '$window', function ($rootScope, $q, $window) {

        // this service does not need a cordovaReady event listener.
        // navigator.geolocation.getCurrentPosition can be used in almost any browser.
        return {
            getCurrentPosition: function (options) {
                var defferedGeolocation = $q.defer();

                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    defferedGeolocation.resolve(position);
                },
                function (error) {
                    defferedGeolocation.reject(error);
                },
                options);

                return defferedGeolocation.promise;
            }
        };
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.keyboardService
 * @requires $window
 * @requires com.ionic.keyboard (cordova plugin)
 *
 * @description
 * The keyboard service listens if the application shows a keyboard or not on mobile operating systems.
 * A service can register itself and send a function to the keyboard service that will be triggerd when the keyboard is shown or hidden.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('keyboardService',
    ['$window', function ($window) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var keyboardService = {};
        var registeredFunctions_KeyboardShowEvent = [];
        var registeredFunctions_KeyboardHideEvent = [];

        // ============================
        // Public Methods
        // ============================

        /**
         * @ngdoc method
         * @name registerOnKeyboardShow
         * @methodOf CordovaAPI.keyboardService
         * @param {function} fnc registers function to be called on keyboard show
         * @returns {boolean} returns a boolean which is true when the fnc is succesfully added and false if not. 
         *
         * @description
         * register a function to be called when the keyboard is shown
        */
        keyboardService.registerOnKeyboardShow = function (fnc) {
            if (typeof fnc !== 'function') {
                return false;
            }
            $window.addEventListener('native.showkeyboard', fnc, false);
            return true;
        };

        /**
         * @ngdoc method
         * @name registerOnKeyboardHide
         * @methodOf CordovaAPI.keyboardService
         * @param {function} fnc function to be removed from being called on showkeyboard event
         * @returns {boolean} returns a boolean which is true when the fnc is succesfully added and false if not. 
         *
         * @description
         * register a function to be called when the keyboard is hidden
        */
        keyboardService.registerOnKeyboardHide = function (fnc) {
            if (typeof fnc !== 'function') {
                return false;
            }
            $window.addEventListener('native.hidekeyboard', fnc, false);
            return true;
        };

        /**
         * @ngdoc method
         * @name unregisterOnKeyboardHide
         * @methodOf CordovaAPI.keyboardService
         * @param {function} fnc function to be removed from being called on hidekeyboard event
         * @returns {boolean} returns a boolean which is true when the fnc is succesfully removed and false if not. 
         *
         * @description
         * unregisters a function to NOT be called when the keyboard is hidden
        */
        keyboardService.unregisterOnKeyboardHide = function (fnc) {
            if (typeof fnc !== 'function') {
                return false;
            }
            $window.removeEventListener('native.hidekeyboard', fnc, false);
            return true;
        };

        /**
         * @ngdoc method
         * @name unregisterOnKeyboardShow
         * @methodOf CordovaAPI.keyboardService
         * @param {function} fnc function to be removed from being called on showkeyboard event
         * @returns {boolean} returns a boolean which is true when the fnc is succesfully removed and false if not. 
         *
         * @description
         * unregisters a function to NOT be called when the keyboard is shown
        */
        keyboardService.unregisterOnKeyboardShow = function (fnc) {
            if (typeof fnc !== 'function') {
                return false;
            }
            $window.removeEventListener('native.showkeyboard', fnc, false);
            return true;
        };

        return keyboardService;
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.launchNavigatorService
 * @requires $rootScope
 * @requires $q
 * @requires $window
 * @requires CordovaAPI.cordovaReady
 *grunt
 * @description
 * Service that handles incoming pushNotifications for the different platforms.
 *
 * **Note:** Requires Cordova
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('launchNavigatorService',
    ['$window', '$rootScope', '$q', 'cordovaReady', function($window, $rootScope, $q, cordovaReady) {
        'use strict';

        var launchNavigatorService = {};
        var navigationDeffered;
        var destination;
        var start;

        // ============================
        // Public Methods
        // ============================
        /**
         * @ngdoc method
         * @name navigate
         * @methodOf CordovaAPI.launchNavigatorService
         * @param {String} _destination is used as destination for the navigation.
         * @param {String} _start is used as start for the navigation. Uses your current location if left empty.
         * @returns {promise} returns a promise which is resolved or rejected depending of the response of the launch navigator plugin
         *
         * @description
         * Registers the push event and when succesful resolves the promise with the token.
        */
        launchNavigatorService.navigate = function (_destination, _start) {
            navigationDeffered = $q.defer();
            destination = _destination;
            start = _start;

            cordovaReady.then(startNavigation).catch(navigateError);

            return navigationDeffered.promise;
        };

        // ============================
        // Private Methods
        // ============================
        var startNavigation = function() {
            $window.launchnavigator.navigate(destination, start, navigateSuccess, navigateError);
        };

        var navigateSuccess = function(result) {
            navigationDeffered.resolve(result);
        };

        var navigateError = function(error) {
            navigationDeffered.reject(error);
        };

        return launchNavigatorService;
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.nativeNotificationService
 * @requires $rootScope
 * @requires $window
 * @requires $q
 * @requires CordovaAPI.cordovaReady
 *
 * @description
 * This service implements different native ways of showing confirm and alert boxes depending on the platform.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('nativeNotificationService',
    ['$rootScope', '$window', '$q', 'cordovaReady', function ($rootScope, $window, $q, cordovaReady) {

        // ============================
        // Public methods
        // ============================

        var nativeNotificationService = {
            /**
             * @ngdoc method
             * @name alert
             * @methodOf CordovaAPI.notificationService
             * @param {string} message The message to be shown in the alert.
             * @param {string} title The title of the alert.
             * @param {string} buttonName The name of the button to be shown in the alert.
             * @returns {promise} returns a promise that is resolved when the alert is pressed.
             *
             * @description
             * The function will execute the appropiate alert depending on what platform the application runs.
            */
            alert: function (message, title, buttonName) {
                var defferedAlert = $q.defer();

                cordovaReady.then(function () {
                    mobileAlert(message, title, buttonName, defferedAlert);
                }).catch(function () {
                    browserAlert(message, defferedAlert);
                });

                return defferedAlert.promise;
            },
            /**
             * @ngdoc method
             * @name confirm
             * @methodOf CordovaAPI.notificationService
             * @param {string} message The message to be shown in the confirm.
             * @param {string} title The title of the confirm.
             * @param {string[]} buttonLabels The labels of the buttons for the confirm (optional, default is "OK", "Cancel").
             * @returns {promise} returns a promise that is resolved or rejected which depends on what button the user pressed (default "OK" is resolved and "Cancel" is rejected).
             *
             * @description
             * The function will execute the appropiate confirm depending on what platform the application runs.
            */
            confirm: function (message, title, buttonLabels) {
                var defer = $q.defer();

                cordovaReady.then(function () {
                    mobileConfirm(message, title, buttonLabels, defer);
                }).catch(function () {
                    browserConfirm(message, defer);
                });

                return alertPromise(defer.promise);
            },

            /**
             * @ngdoc method
             * @name confirm
             * @methodOf CordovaAPI.notificationService
             * @param {int} beepCount The amount of beeps you want.
             *
             * @description
             * This will create a beeping sound similar to the notification sound of the phone.
            */
            beep: function (beepCount) {
                var defer = $q.defer();

                cordovaReady.then(function () {
                    $window.navigator.notification.beep(beepCount);
                }).catch(function () {
                    console.error("Beep is only supported on mobile platforms");
                });

                return alertPromise(defer.promise);
            }
        };

        // ============================
        // Private methods
        // ============================
        var browserAlert = function (message, defferedAlert) {
            $window.alert(message);

            defferedAlert.resolve();
        };

        var mobileAlert = function (message, title, buttonName, defferedAlert) {
            var callBack = function () {
                defferedAlert.resolve();
            };

            $window.navigator.notification.alert(message, callBack, title, buttonName);
        };

        var browserConfirm = function (message, defferedConfirmation) {
            return $window.confirm(message) ? defferedConfirmation.resolve() : defferedConfirmation.reject();
        };

        var mobileConfirm = function (message, title, buttonLabels, defferedConfirmation) {
            var onConfirm = function (idx) {
                if (idx === 1) {
                    defferedConfirmation.resolve();
                } else {
                    defferedConfirmation.reject();
                }
            };

            $window.navigator.notification.confirm(message, onConfirm, title, buttonLabels);
        };

        //creates a promise that can be consumed with '.ok' and '.cancel' instead of '.then' and '.catch'.
        var alertPromise = function (promise) {

            var prototype = Object.getPrototypeOf(promise);

            Object.defineProperty(prototype, 'ok', {
                value: prototype.ok ? prototype.ok : promise.then
            });

            Object.defineProperty(prototype, 'cancel', {
                value: prototype.cancel ? prototype.cancel : promise.catch
            });

            return promise;
        };

        return nativeNotificationService;
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.orientationService
 * @requires $window
 *
 * @description
 * This service enables you to hook into orientation changes in the app.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').service('orientationService',
    ['$window', function ($window) {

        //#region private fields
        var landscape = "landscape";
        var portrait = "portrait";
        var browser = "browser";
        var orientation;
        var onPortraitOrientation = [];
        var onLandscapeOrientation = [];
        var onOrientation = [];

        var OrientationObject = function (_orientation) {
            this.orientation = _orientation;
        };
        //#endregion

        //#region public methods
        /**
         * @ngdoc method
         * @name getOrientation
         * @methodOf CordovaAPI.orientationService
         * @returns {object} returns an Object representing an OrientationObject with the property orientation.
         *
         * @description
         * Gives you the current orientation that app is in.
        */
        this.getOrientation = function () {
            return orientation;
        };

        /**
         * @ngdoc method
         * @name registerOnOrientationChange
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been added or not.
         *
         * @description
         * Adds a function to be executed when the orientation changes.
        */
        this.registerOnOrientationChange = function (_function) {
            if (angular.isFunction(_function)) {
                onOrientation.push(_function);
                return true;
            }
            return false;
        };

        /**
         * @ngdoc method
         * @name unRegisterOnOrientationChange
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been removed or not.
         *
         * @description
         * Removes a function that was to be executed when the orientation in the app was going to change.
        */
        this.unRegisterOnOrientationChange = function (_function) {
            if (angular.isFunction(_function)) {
                var indexOfFunction = onOrientation.indexOf(_function);
                if (indexOfFunction > -1) {
                    onOrientation.splice(indexOfFunction, 1);
                    return true;
                }
            }
            return false;
        };

        /**
         * @ngdoc method
         * @name registerOnEnterLandscape
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been added or not.
         *
         * @description
         * Adds a function to be executed when the orientation changes to landscape.
        */
        this.registerOnEnterLandscape = function (_function) {
            if (angular.isFunction(_function)) {
                onLandscapeOrientation.push(_function);
                return true;
            }
            return false;
        };

        /**
         * @ngdoc method
         * @name unRegisterOnEnterLandscape
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been removed or not.
         *
         * @description
         * Removes a function that was to be executed when the orientation in the app was going to change to Landscape.
        */
        this.unRegisterOnEnterLandscape = function (_function) {
            if (angular.isFunction(_function)) {
                var indexOfFunction = onLandscapeOrientation.indexOf(_function);
                if (indexOfFunction > -1) {
                    onLandscapeOrientation.splice(indexOfFunction, 1);
                    return true;
                }
            }
            return false;
        };

        /**
         * @ngdoc method
         * @name registerOnEnterPortrait
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been added or not.
         *
         * @description
         * Adds a function to be executed when the orientation changes to portrait.
        */
        this.registerOnEnterPortrait = function (_function) {
            if (angular.isFunction(_function)) {
                onPortraitOrientation.push(_function);
                return true;
            }
            return false;
        };

        /**
         * @ngdoc method
         * @name unRegisterOnEnterPortrait
         * @methodOf CordovaAPI.orientationService
         * @returns {boolean} returns a boolean stating if the function has been removed or not.
         *
         * @description
         * Removes a function that was to be executed when the orientation in the app was going to change to Portrait.
        */
        this.unRegisterOnEnterPortrait = function (_function) {
            if (angular.isFunction(_function)) {
                var indexOfFunction = onPortraitOrientation.indexOf(_function);
                if (indexOfFunction > -1) {
                    onPortraitOrientation.splice(indexOfFunction, 1);
                    return true;
                }
            }
            return false;
        };
        //#endregion

        //#region private methods
        var executeFunctionsInArray = function (arrFunctions) {
            for (var i = 0; i < arrFunctions.length; i++) {
                arrFunctions[i]();
            }
        };

        //What is getting called each time the orientation of the app changes.
        var onOrientationChange = function (e) {
            var orientationObject = determineOrientation();

            if (orientationObject.orientation === browser) { return; }

            executeFunctionsInArray(onOrientation);

            if (orientationObject.orientation === landscape) {
                executeFunctionsInArray(onLandscapeOrientation);
            } else{
                executeFunctionsInArray(onPortraitOrientation);
            }

        };

        //Determines the type of orientation the app is currently in.
        var determineOrientation = function () {
            if ($window.orientation === 90 || $window.orientation === -90) {
                orientation = new OrientationObject(landscape);
            } else if ($window.orientation === 0 || $window.orientation === 180) {
                orientation = new OrientationObject(portrait);
            } else {
                orientation = new OrientationObject(browser);
            }
            return orientation;
        };
        //#endregion

        //#region on startup
        $window.addEventListener('orientationchange', onOrientationChange, false);
        determineOrientation();
        //#endregion
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.pushNotificationService
 * @requires $rootScope
 * @requires $q
 * @requires CordovaAPI.cordovaReady
 * @requires CordovaAPI.deviceService
 * @requires CordovaAPI.devicePlatformConstants
 * @requires $window
 *
 * @description
 * Service that handles incoming pushNotifications for the different platforms.
 *
 * **Note:** Requires Cordova
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').service('pushNotificationService',
    ['$rootScope', '$q', 'cordovaReady', 'deviceService', 'devicePlatformConstants', '$window', function ($rootScope, $q, cordovaReady, deviceService, devicePlatformConstants, $window) {

        // ============================
        // Private Fields
        // ============================
        var tokenRetrieveIsCalled = false;
        var tokenDeferred = $q.defer();
        var pushCallbackMethod;
        var registeredEventListeners = [];
        var pushInstance = null;

        // ============================
        // Public Methods
        // ============================
        /**
         * @ngdoc method
         * @name registerPushEventAndReturnToken
         * @methodOf CordovaAPI.pushNotificationService
         * @returns {promise} returns a promise which is resolved with the token when succesful and rejected when not.
         *
         * @description
         * Registers the push event and when succesful resolves the promise with the token.
        */
        this.registerPushEventAndReturnToken = function () {
            this.registerPushEvents();

            return tokenDeferred.promise;
        };

        /**
         * @ngdoc method
         * @name registerPushEvents
         * @methodOf CordovaAPI.pushNotificationService
         *
         * @description
         * Registers the push events and asynchronously get the pushNotificationToken.
        */
        this.registerPushEvents = function () {
            if (tokenRetrieveIsCalled === false) {
                tokenRetrieveIsCalled = true;

                cordovaReady.then(function () {
                    getPushNotificationToken();
                    registerEventListeners();
                }).catch(function () {
                    tokenDeferred.reject();
                });
            }
        };

        /**
         * @ngdoc method
         * @name setPushNotificationCallback
         * @methodOf CordovaAPI.pushNotificationService
         * @param {function} callbackMethod this parameter should be a function which will be called when a pushNotification is received.
         *
         * @description
         * Sets the function for the pushCallbackMethod (private scope) in the pushNotificationService.
        */
        this.setPushNotificationCallback = function (callbackMethod) {
            pushCallbackMethod = callbackMethod;
        };

        /**
         * @ngdoc method
         * @name addEventListenerForPush
         * @methodOf CordovaAPI.pushNotificationService
         * @param {function} Method will be instantiated on push notification.
         *
         * @description
         * Given method will be called on push. This method will eventually replace the setPushNotificationCallback method.
        */
        this.addEventListenerForPush = function (callbackMethod) {
            registeredEventListeners.push(callbackMethod);
        };

        /**
            * @ngdoc method
            * @name removeEventListenerForPush
            * @methodOf CordovaAPI.pushNotificationService
            * @param {function} Function to remove as event listener.
            *
            * @description
            * Given function will be removed as event listener and will no longer be called when a push notification is received.
        */
        this.removeEventListenerForPush = function (callbackMethod) {
            var indexOfExistingHandler = registeredEventListeners.indexOf(callbackMethod);
            if (indexOfExistingHandler >= 0) {
                registeredEventListeners.splice(indexOfExistingHandler, 1);
            }
        };

        // ============================
        // Private Methods
        // ============================
        var getPushNotificationToken = function () {
            pushInstance = $window.PushNotification.init({
                android: { },
                ios: {
                    badge: "true",
                    sound: "true",
                    alert: "true"
                }
            });
        };

        var pushNotificationTokenReceived = function (token) {
            tokenDeferred.resolve(token);
        };

        var pushNotificationReceived = function (sessionId, isCalledFromForeground, customContent) {
            $rootScope.$apply(function () {
                if (typeof pushCallbackMethod === "function") {
                    pushCallbackMethod(sessionId, isCalledFromForeground);
                }

                for (var i = 0; i < registeredEventListeners.length; i++) {
                    var currentEventListener = registeredEventListeners[i];
                    if (typeof currentEventListener === "function") {
                        currentEventListener(isCalledFromForeground, customContent);
                    }
                }
            });
        };

        var registerEventListeners = function() {
            pushInstance.on('registration', function (data) {
                pushNotificationTokenReceived(data.registrationId);
            });

            pushInstance.on('notification', function (data) {
                var customContent = data.additionalData.customContent;
                if(typeof customContent === 'string') {
                    customContent = JSON.parse(customContent);
                }
                pushNotificationReceived(data.additionalData.sessionId, data.additionalData.foreground, customContent);
            });

            pushInstance.on('error', function (error) {
                console.log(error);
            });
        };        
    }]
);

/**
 * @ngdoc service
 * @name CordovaAPI.splashScreenService
 * @requires CordovaAPI.cordovaReady
 * @requires $window
 *
 * @description
 * Service that handles the showing and hiding of the splash screen.
 * **Note:** Requires Cordova.
*/
angular.module('verklizan.umox.common.html5.vkz-angular-cordova').factory('splashScreenService',
    ['cordovaReady', '$window', function (cordovaReady, $window) {

        var splashScreenService = {};

        splashScreenService.turnOffSplashScreen = function () {
            cordovaReady.then(function () {
                $window.navigator.splashscreen.hide();
            });
        };

        splashScreenService.turnOnSplashScreen = function () {
            cordovaReady.then(function () {
                $window.navigator.splashscreen.show();
            });
        };

        return splashScreenService;
    }]
);
