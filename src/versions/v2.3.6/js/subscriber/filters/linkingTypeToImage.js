angular.module('verklizan.umox.mobile.subscriber').filter('linkingTypeToImage',
    function (domainModel) {
        'use strict';

        return function (linkingType) {
            if (linkingType === domainModel.linkingType.Subscriber) {
                return "../../shared/img/subscriber-normal_24x24.png";
            } else if (linkingType === domainModel.linkingType.Residence) {
                return "../../shared/img/residences-normal_24x24.png";
            } else if (linkingType === domainModel.linkingType.Scheme) {
                return "../../shared/img/carecenters-normal_24x24.png";
            }
        };
    }
);
