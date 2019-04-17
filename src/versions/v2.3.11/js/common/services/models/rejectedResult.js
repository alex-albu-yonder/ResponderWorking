angular.module('verklizan.umox.mobile.common').factory('RejectedResult',
    function () {

        function RejectedResult(isHandled, response, message, messageIsLocalized) {
            this.errorIsHandled = isHandled;
            this.response = response;  
            this.message = message;  
            this.messageIsLocalized = messageIsLocalized;

            this.hasLocalizedMessage = function() {   
                return this.messageIsLocalized === true && this.message;
            }
        }

        return RejectedResult;
    }
);
