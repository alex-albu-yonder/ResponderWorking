angular.module('verklizan.umox.mobile.common').factory('domainModel',
    function () {
        'use strict';

        var model = {};

        model.pushSubscriptionType = {
            Unknown: 0,
            CareRequests: 1,
            FaceTime: 2
        }

        model.filterOperator = {
            And: 0,
            Or: 1
        }

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
            Cancelled : 8,
            Closed : 9,
        };

        model.linkingType = {
            Unknown: 0,
            None: 1,
            Subscriber: 2,
            Residence: 3,
            Scheme: 4,
        };
        
        model.pageDescriptor = function (pageIndex, pageSize) {
            this.PageIndex = pageIndex;
            this.PageSize = pageSize;
        };

        model.filterDescriptorItem = function (property, value, filterOperation) {
            this.__type = "FilterDescriptor:www.verklizan.com";
            this.FilterProperty = [property];
            this.FilterValue = value;
            this.Operation = filterOperation;
        };

        model.filterDescriptor = function (list, operator) {
            this.List = list;
            this.Operator = operator;
        };

        //directionAscending: 1(Asc; true) or 2(Desc; false)
        model.sortDescriptor = function (directionAscending, sortProperty) {
            this.List = [
                {
                    Direction: (directionAscending ? 1 : 2),
                    SortProperty: [sortProperty]
                }
            ];
        };

        model.subscriberNote = function (subscriberId, subject, content, crmCheck, callCheck, photo) {
            this.PersonId = subscriberId;
            this.Subject = subject;
            this.Content = content;
            this.IsEditDataRequired = crmCheck;
            this.IsPopUp = callCheck;
            this.ValidPeriod = "";

            if (photo) {
                this.DefaultAttachment = photo;
                this.DefaultAttachmentMimeType = "image/jpeg";
                this.DefaultAttachmentName = "";
            }
        };

        model.organizationNote = function (companyId, subject, content, fromDate, toDate) {
            this.CompanyId = companyId;
            this.Subject = subject;
            this.Content = content;
            this.ValidPeriod = {
                FromDate: fromDate,
                ToDate: toDate
            };
        };

        model.subscriber = function (subscriberProfile, birthDate, status, organization, subscriptionNumber, residence) {
            this.Identity = {
                FirstName: subscriberProfile.firstName,
                Insertion: subscriberProfile.insertion,
                Gender: subscriberProfile.gender,
                BirthDate: birthDate,
                LastName: subscriberProfile.surname
            };

            this.CitizenServiceNumber = subscriberProfile.serviceNr;
            this.DefaultRemark = subscriberProfile.remark;
            this.SubscriberStateId = status;
            this.OrganizationId = organization;
            this.SubscriptionNumber = subscriptionNumber;
            this.ResidenceId = residence;
            this.SocialServiceNumber = {};
        };

        model.residence = function (houseNr, street, city, region, postcode, phone, organization) {
            this.StreetAddress = {
                HouseNumber: houseNr,
                StreetName: street,
                CityId: city,
                RegionId: region,
                PostalCode: postcode
            };

            this.DefaultPhoneNumber = phone;
            this.OrganizationId = organization;

            //StreetAddress is skipped if no streetAdressId is inserted (bug in the service)
            this.StreetAddressId = "00000000-0000-0000-0000-000000000000";
        };

        model.urlObject = function (host, port, path) {
            this.host = host;
            this.port = port;
            this.path = path;
        };

        return model;
    }
);
