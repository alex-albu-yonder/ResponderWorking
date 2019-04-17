angular.module('verklizan.umox.mobile.userInfo').service('userDataManager',
    function ($rootScope, $q, $route, USER_ROLES, cachedLocalStorageService, securityTokenService, loginServiceProxy,
        userManagementServiceProxy, hashService, RejectedResult, careProviderManagementServiceProxy,
        userDataManagerService, contactItemTypeFunctionValues, descriptorFactory, domainEnums, descriptors) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var that = this;
        var OPERATORID_STRING = "OperatorId";
        var userInfo;
        var userRole = USER_ROLES.empty;

        var currentUserIsTheSameAsPreviousUser;
        var firstLogInSinceAppStart;
        var backStackHistorySessionIsAvailable;

        // ============================
        // Events
        // ============================
        securityTokenService.registerTokenExpirationCallback(function () {
            that.readCurrentOperator();
        });

        // ============================
        // Public Methods
        // ============================
        this.readCurrentOperator = function () {
            if (userInfo) {
                return $q.when(userInfo);
            }

            return userDataManagerService.readCurrentUser()
                .then(handleUser);
        };

        this.getCurrentCaregiverPhoneNumbers = function () {
            var pageIndex = 0;
            var currentCaregiverId = userInfo.ProfessionalCaregiverIdentity.Id;

            var unknown = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.Unknown, domainEnums.filterOperation.Equals);
            var externalPhone = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.ExternalPhone, domainEnums.filterOperation.Equals);
            var sip = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.SIP, domainEnums.filterOperation.Equals);
            var smsAssist = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.SmsAssist, domainEnums.filterOperation.Equals);
            var careFollowUp = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.CareFollowUp, domainEnums.filterOperation.Equals);
            var careApp = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.CareApp, domainEnums.filterOperation.Equals);
            var faceTime = new descriptors.filterDescriptorItem('Type.FunctionValues', contactItemTypeFunctionValues.Facetime, domainEnums.filterOperation.Equals);

            var filterDescriptor = new descriptors.filterDescriptor([
                unknown,
                externalPhone,
                sip,
                smsAssist,
                careFollowUp,
                careApp,
                faceTime,
            ], domainEnums.filterOperator.Or);

            var requestData = descriptorFactory.readLargeData(pageIndex);

            return careProviderManagementServiceProxy
                .readProfessionalCaregiverContactItemPage(currentCaregiverId, filterDescriptor, requestData.sort, requestData.pageDescriptor);
        }

        this.requestPasswordReset = function (username) {
            return userManagementServiceProxy.requestPasswordReset(username);
        }

        this.resetPassword = function (username, newPassword, resetCode) {
            var hashedPassword = hashService.CreatePasswordHash(username, newPassword);

            return userManagementServiceProxy.resetPassword(username, hashedPassword, resetCode);
        }

        this.changePassword = function (username, oldPassword, newPassword) {
            var hashedOldPassword = hashService.CreatePasswordHash(username, oldPassword);
            var hashedNewPassword = hashService.CreatePasswordHash(username, newPassword);

            return userManagementServiceProxy.changePassword(hashedOldPassword, hashedNewPassword);
        }

        this.resetCurrentOperator = function () {
            setAuthenticationInfo(null);
            userDataManagerService.resetCurrentUser();
        }

        this.getUserOrganizationId = function () {
            if (angular.isDefined(userInfo.ProfessionalCaregiverIdentity) && userInfo.ProfessionalCaregiverIdentity !== null) {
                return userInfo.ProfessionalCaregiverIdentity.OrganizationId;
            }
            else if (angular.isDefined(userInfo.OperatorIdentity.OrganizationId) && userInfo.OperatorIdentity.OrganizationId !== null) {
                return userInfo.OperatorIdentity.OrganizationId;
            }
        };

        // This field tells if this is the first login in this app session
        this.isFirstLoginSinceAppStart = function () {
            // it is undefined before a login.            
            if (angular.isUndefined(firstLogInSinceAppStart)) {
                return true;
            }

            return firstLogInSinceAppStart;
        }

        this.sessionIsFreshStart = function () {
            console.log("Back stack history session avaible: " + backStackHistorySessionIsAvailable);

            var firstLogin = this.isFirstLoginSinceAppStart();

            var otherUserLoggedInBefore = !this.isFirstLoginSinceAppStart() && !currentUserIsTheSameAsPreviousUser;

            var backStackHistoryIsNotAvailable = !backStackHistorySessionIsAvailable;

            return firstLogin || otherUserLoggedInBefore || backStackHistoryIsNotAvailable;
        };

        this.isAuthorized = function () {
            return userInfo !== null && typeof userInfo === "object";
        }

        this.isAuthorizedForCurrentPage = function () {
            var authorizedRoles = $route.current.data.authorizedRoles;

            return checkAuthorization(authorizedRoles);
        }

        this.getUserId = function () {
            if (userInfo && userInfo.Person) {
                return userInfo.Person.Id;
            }
        }

        this.getCurrentUserRole = function () {
            return userRole || USER_ROLES.empty;
        }

        this.getUserName = function () {
            return userInfo.UserName;
        }

        this.setBackStackOfSessionAvailable = function (isAvailable) {
            backStackHistorySessionIsAvailable = isAvailable;
        }

        // ============================
        // Private Methods
        // ============================
        var handleUser = function (response) {
            var userInfoFromService = response;

            setTokenExpiration(userInfoFromService);

            return handleUserLoggedIn(userInfoFromService);
        }

        var handleUserLoggedIn = function (userData) {
            setAuthenticationInfo(userData);

            var isTheSameUser = checkIfTheUserStayedTheSame(userData.Person.Id);

            setIfUserHasLoggedInBefore();

            return userData;
        }

        var checkIfTheUserStayedTheSame = function (currentUserId) {
            if (!operatorIdIsSetInLocalStorage()) {
                setOperatorIdToStorage(currentUserId);
                currentUserIsTheSameAsPreviousUser = true;
                return;
            }

            currentUserIsTheSameAsPreviousUser = currentOperatorEqualsPreviousOperator(currentUserId);

            return currentUserIsTheSameAsPreviousUser;
        };

        var currentOperatorEqualsPreviousOperator = function (currentUserId) {
            var operatorIdStorage = getOperatorIdFromStorage();

            if (currentUserId !== operatorIdStorage) {
                setOperatorIdToStorage(currentUserId);
                return false;
            } else {
                return true;
            }
        }

        var checkAuthorization = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            if (authorizedRoles.indexOf(USER_ROLES.empty) !== -1) {
                return true;
            } else if (authorizedRoles.indexOf(USER_ROLES.all) !== -1 && userRole !== USER_ROLES.empty) {
                return true;
            } else if (authorizedRoles.indexOf(userRole) !== -1) {
                return true;
            } else {
                return false;
            }
        }

        var setTokenExpiration = function (_userInfo) {
            var expirationInMinutes = _userInfo.CacheTimeoutMinutes;
            securityTokenService.setExperiationInMinutes(expirationInMinutes);
        }

        var setIfUserHasLoggedInBefore = function () {
            if (angular.isUndefined(firstLogInSinceAppStart)) {
                firstLogInSinceAppStart = true;
            } else if (firstLogInSinceAppStart === true) {
                firstLogInSinceAppStart = false;
            }
        }

        var setAuthenticationInfo = function (newOperatorInfo) {
            userInfo = newOperatorInfo;

            if (angular.isUndefined(newOperatorInfo) || newOperatorInfo === null) {
                userRole = USER_ROLES.empty;
            } else if (userInfo.ProfessionalCaregiverIdentity !== null) {
                userRole = USER_ROLES.caregiver;
            } else if (userInfo.OperatorIdentity !== null) {
                userRole = USER_ROLES.operator;
            }
        }

        var operatorIdIsSetInLocalStorage = function () {
            var operatorIdStorage = getOperatorIdFromStorage();

            return operatorIdStorage !== null;
        }

        var getOperatorIdFromStorage = function () {
            return cachedLocalStorageService.getLocalStorageItem(OPERATORID_STRING);
        };

        var setOperatorIdToStorage = function (value) {
            cachedLocalStorageService.setLocalStorageItem(OPERATORID_STRING, value);
        };

    }
);
