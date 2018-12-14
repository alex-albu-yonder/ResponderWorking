angular.module("verklizan.umox.mobile.subscriber").filter('careRequestStatusToText',
    function (domainModel) {
        return function (status) {
            switch (status) {
                case domainModel.careRequestStatus.Send:
                case domainModel.careRequestStatus.RequestReceived:
                    return "_CareRequestStatus_Alarm_";
                case domainModel.careRequestStatus.Accept:
                    return "_CareRequestStatus_Accept";
                case domainModel.careRequestStatus.Decline:
                    return "_CareRequestStatus_Decline";
                case domainModel.careRequestStatus.Arrived:
                    return "_CareRequestStatus_Arrived";
                case domainModel.careRequestStatus.Done:
                    return "_CareRequestStatus_Done";
                case domainModel.careRequestStatus.Closed:
                    return "_CareRequestStatus_Closed_";
                case domainModel.careRequestStatus.Cancelled:
                    return "_CareRequestStatus_Cancelled_";
                case domainModel.careRequestStatus.DeviceNotReachable:
                    return "_CareRequestStatus_DeviceNotReachable";
                case domainModel.careRequestStatus.Unknown:
                    /* falls through */
                default:
                    return "_CareRequestStatus_Unknown_";
            }
        }
    }
);
