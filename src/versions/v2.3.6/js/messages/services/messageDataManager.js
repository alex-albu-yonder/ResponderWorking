angular.module('verklizan.umox.mobile.messages').service('messageDataManager',
    function ($rootScope, $q, userDataManager, userSettingsService, supportingDataManagementServiceProxy,
        dateExtensionService, descriptorFactory, domainEnums, organizationFactory, pageSize) {
        'use strict';

        //#region Public Methods
        // ============================
        // Public Methods
        // ============================
        //initiated when overview message page is opened
        this.loadMessage = function (isToday, messageIndex) {
            var userOrganizationId = userDataManager.getUserOrganizationId();

            var pageSizeOfMessages = pageSize.Normal;
            var pageIndex = Math.floor(messageIndex / pageSizeOfMessages);
            var messageIndexOnPage = messageIndex % pageSizeOfMessages;

            return this.loadMessages(isToday, pageIndex).then(function (messages) {
                return messages.Rows[messageIndexOnPage];
            })
        }

        this.loadMessages = function (isToday, pageIndex) {
            var userOrganizationId = userDataManager.getUserOrganizationId();

            if (angular.isDefined(userOrganizationId)) {
                return sendGetMessagesRequest(userOrganizationId, isToday, pageIndex);
            } else {
                return $q.reject("no organization id");
            }
        };

        // This function gets called from the controllers (which try to create a new organization note).
        this.createOrganizationNote = function (newOrganizationNote) {

            // Validation: Organization is required.
            if (newOrganizationNote.organization && newOrganizationNote.organization.Id) {

                return createOrganizationNote(newOrganizationNote.organization,
                    newOrganizationNote.subject,
                    newOrganizationNote.content,
                    newOrganizationNote.fromDate,
                    newOrganizationNote.toDate
                );
            } else {
                console.error("no organization id");
            }
        };

        this.getNewMessageCount = function () {
            var sortIndex = userSettingsService.getLastSeenOrganizationNoteIndex();

            if (!sortIndex) {
                return $q.when(0);
            }

            return supportingDataManagementServiceProxy.readNewOrganizationMessageCount(sortIndex).then(function (response) {
                var messageCount = response;

                if (messageCount > 99) {
                    messageCount = 99;
                }

                return messageCount;
            });
        }
        //#endregion Public Methods


        //#region Private Methods
        // ============================
        // Private Methods
        // ============================

        var createOrganizationNote = function (organization, subject, content, fromDate, toDate) {
            var toDateConverted = dateExtensionService.convertDateToMsUtc(toDate);
            var fromDateConverted = dateExtensionService.convertDateToMsUtc(fromDate);

            var note = organizationFactory
                .createSimpleOrganizationNote(organization.CompanyId, subject, content, fromDateConverted, toDateConverted);
            return supportingDataManagementServiceProxy.createOrganizationNote(note);
        };

        var sendGetMessagesRequest = function (userOrganizationId, isToday, pageIndex) {
            var filters = null;
            if (isToday) {
                var dateOffset = getTodayDateOffset();
                var fromDateFilter = new descriptorFactory.FilterOptionObject('ValidPeriod.FromDate', dateOffset, domainEnums.filterOperation.Greater);
                filters = fromDateFilter ? [fromDateFilter] : null;
            }

            var requestData = descriptorFactory.readNormalDataSortSortIndexDesc(pageIndex, filters)
            return supportingDataManagementServiceProxy
                .readOrganizationNotePage(requestData.filters, requestData.sort, requestData.pageDescriptor)
                .then(function (response) {
                    var organizationNotes = response;
                    return organizationNotes;
                });
        }

        var getTodayDateOffset = function () {
            var currentDateTime = new Date();
            var todayMidnight = currentDateTime.setHours(0, 0, 0, 0);
            todayMidnight = new Date(todayMidnight);
            return dateExtensionService.convertDateToMsUtc(todayMidnight);
        }
        //#endregion Private Methods
    }
);
