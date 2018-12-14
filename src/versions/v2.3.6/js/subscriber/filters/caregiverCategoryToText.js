angular.module('verklizan.umox.mobile.subscriber').filter('caregiverCategoryToText',
    function (domainModel) {
        'use strict';

        return function (caregiverCategory) {
            if (caregiverCategory === domainModel.caregiverCategory.Professional) {
                return "_Caregiver_Professional_";
            } else if (caregiverCategory === domainModel.caregiverCategory.Relational) {
                return "_Caregiver_Relational_";
            } else if (caregiverCategory === domainModel.caregiverCategory.Warden) {
                return "_Caregiver_Warden_";
            } else if (caregiverCategory === domainModel.caregiverCategory.ProfessionalAsRelational) {
                return "_Caregiver_ProfessionalAsRelational_";
            } else {
                return "_Caregiver_Unknown_";
            }
        };
    }
);
