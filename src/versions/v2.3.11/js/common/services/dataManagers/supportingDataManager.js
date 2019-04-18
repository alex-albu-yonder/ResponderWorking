angular.module('verklizan.umox.mobile.common').service('supportingDataManager',
    function ($rootScope, webRequestService, userDataManager, supportingDataManagementServiceProxy, descriptors, pageSize,
        deviceManagementServiceProxy, subscriberManagementServiceProxy, hierarchyService, config, descriptorFactory,
        domainEnums) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var supportingDataCollection = createSupportingDataCollection();

        // ============================
        // Public Methods
        // ============================
        this.init = function () {
            // if the user is not the same, the supporting data 
            // can be changed and have to be reloaded.
            // This will also be called when the user logs in for the first time.
            if (userDataManager.sessionIsFreshStart()) {
                console.log("reload data");
                clearSupportingData();

                loadAllSupportingData();
            } else {
                console.log("only check the data");
                loadAllSupportingData();
            }
        };

        this.getSubscriberStates = function () {
            return supportingDataCollection.readsubscriberstatepage.loadData();
        };

        this.getNewDeviceStatusses = function () {
            return supportingDataCollection.readdevicestatepage.loadData();
        };

        this.getCities = function (searchFilter, organizationId, pageIndex) {
            var requestModel = createRequestModelAutoCompleter(searchFilter, organizationId, pageIndex);
            return supportingDataManagementServiceProxy.readCityPage(requestModel.filters, requestModel.sort, requestModel.pageDescriptor);
        };

        this.getRegions = function (searchFilter, organizationId, pageIndex) {
            var requestModel = createRequestModelAutoCompleter(searchFilter, organizationId, pageIndex);
            return supportingDataManagementServiceProxy.readRegionPage(requestModel.filters, requestModel.sort, requestModel.pageDescriptor);
        };

        this.getLanguages = function () {
            return getLanguages();
        };

        this.getDeviceState = function (statusString) {
            var deviceStatusses = getSupportingData(supportingDataCollection.readdevicestatepage);

            for (var i = 0; i < deviceStatusses.length; i++) {
                var status = deviceStatusses[i];
                if (status.Name === statusString) {
                    return status.Id;
                }
            }

            return "";
        };

        this.getOrganizations = function (excludeTopLevelOrganization) {
            var organizations = supportingDataCollection.readorganizationpage.data;
            if (organizations.length === 0) {
                supportingDataCollection.readorganizationpage.loadData();
            }

            // Check if the top level organization should be included in the list.
            if (organizations && excludeTopLevelOrganization === true) {

                var filteredOrganizations = [];

                // Add all the organizations to a new list except for the top level organization (whose ParentId will be null).
                angular.forEach(organizations, function (organization) {
                    if (organization.ParentId) {
                        filteredOrganizations.push(organization);
                    }
                });
                organizations = filteredOrganizations;
            }

            return organizations;
        };

        this.getOrganizationsHierarchyTree = function () {
            var organizations = getSupportingData(supportingDataCollection.readorganizationpage);

            return hierarchyService.buildHierarchy(organizations, 'Name');
        }

        // ============================
        // Private Methods
        // ============================
        var getSupportingData = function (supportingDataListItem) {
            if (supportingDataListItem.data.length === 0) {
                supportingDataListItem.loadData();
            }

            return supportingDataListItem.data;
        }

        var clearSupportingData = function () {
            supportingDataCollection = createSupportingDataCollection();
        };

        var loadAllSupportingData = function () {
            angular.forEach(supportingDataCollection, function (value, key) {
                value.loadData();
            });
        }

        var getLanguages = function () {
            var supportedLanguages = [];
            for (var language in config.supportedLanguages) {
                supportedLanguages.push({ code: language, value: config.supportedLanguages[language].language });
            }
            return supportedLanguages;
        };

        function SupportingDataCollectionItem(serviceOperation, eventString, includeOrganization) {
            var that = this;

            this.includesOrganization = includeOrganization;
            this.eventString = eventString;
            this.serviceOperation = serviceOperation;
            this.data = [];
            this.isLoading = false;
            this.allItemsLoaded = false;
            this.pageIndex = 0;
            this.loadingPromise = null;

            this.loadData = function () {
                that.loadingPromise = genericSupportingDataRequest();

                return that.loadingPromise.then(function () {
                    return that.data;
                });
            }

            this.clearData = function () {
                this.data = [];
            }

            var genericSupportingDataRequest = function (pageIndex) {
                if (that.isLoading !== true && that.allItemsLoaded !== true) {
                    that.isLoading = true;

                    //sets default value for the parameter
                    if (typeof pageIndex === 'undefined') {
                        pageIndex = that.pageIndex;
                    } else {
                        that.pageIndex = pageIndex;
                    }

                    var request;
                    var filters = null;

                    if (that.includesOrganization) {
                        var organizationId = userDataManager.getUserOrganizationId();
                        var organizationFilter = new descriptorFactory
                            .FilterOptionObject('OrganizationId', organizationId, domainEnums.filterOperation.Equals);
                        filters = [organizationFilter];
                    }

                    var requestData = descriptorFactory.readXXLargeData(pageIndex, filters);
                    request = that.serviceOperation(requestData.filters, requestData.sort, requestData.pageDescriptor);

                    return request.then(function (response) {
                        return genericSupportingDataSuccesCallback(response, pageIndex);
                    })
                    .catch(function () {
                        genericSupportingDataErrorCallback();
                    });
                }
                else {
                    return that.loadingPromise;
                }
            }

            var genericSupportingDataSuccesCallback = function (response, pageIndex) {
                that.data.push.apply(that.data, response.Rows);

                $rootScope.$broadcast(that.eventString, that.data);

                that.isLoading = false;

                // Check if everything is downloaded.
                if (response.TotalCount > that.data.length) {

                    // Download the next page.
                    return genericSupportingDataRequest(pageIndex + 1);
                } else {
                    console.log("Supporting data is loaded: " + that.eventString);
                    that.allItemsLoaded = true;
                }
            }

            var genericSupportingDataErrorCallback = function () {
                that.loadingPromise = null;
                that.isLoading = false;
            }
        }

        function createSupportingDataCollection() {
            return {
                readsubscriberstatepage: new SupportingDataCollectionItem(
                    subscriberManagementServiceProxy.readSubscriberStatePage,
                    'supportingDataManager::subscriberStatesUpdated', true
                ),
                readdevicestatepage: new SupportingDataCollectionItem(
                    deviceManagementServiceProxy.readDeviceStatePage,
                    'supportingDataManager::newDeviceStateUpdated', true
                ),
                readorganizationpage: new SupportingDataCollectionItem(
                    supportingDataManagementServiceProxy.readOrganizationPage,
                    'supportingDataManager::organizationsUpdated', false
                )
            };
        }

        function createRequestModelAutoCompleter(searchFilter, organizationId, pageIndex) {
            var filterItems = [
                new descriptors.filterDescriptorItem("OrganizationId", organizationId, domainEnums.filterOperation.Equals)
            ];

            if (window.isNullOrUndefinedOrEmpty(searchFilter) === false) {
                filterItems.push(new descriptors.filterDescriptorItem("Name", searchFilter, domainEnums.filterOperation.StartsWith));
            }

            var filterDescriptorList = new descriptors.filterDescriptor(filterItems, domainEnums.filterOperation.And);

            return {
                pageDescriptor: new descriptors.pageDescriptor(pageIndex, pageSize.Small),
                filters: filterDescriptorList,
                sort: new descriptors.sortDescriptor(true, "Name")
            }
        }
    }
);
