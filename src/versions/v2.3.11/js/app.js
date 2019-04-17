// ============================
// Module definitions
// ============================
// Declare app level module which depends on filters and services
angular.module('verklizan.umox.mobile', [
    'verklizan.umox.mobile.common',
    'verklizan.umox.mobile.account',
    'verklizan.umox.mobile.userInfo',
    'verklizan.umox.mobile.subscriber',
    'verklizan.umox.mobile.careRequests',
    'verklizan.umox.mobile.messages',
    'ui.map',
    'ui.event',
    'ngRoute',
    'ngSanitize',
    'verklizan.umox.mobile.shared.constants',
    'verklizan.umox.common.html5.vkz-utilities',
    'verklizan.umox.common.html5.vkz-angular-cordova',
    'verklizan.umox.common.html5.vkz-webrequests',
]);

angular.module('verklizan.umox.mobile.common', ['verklizan.umox.mobile.userInfo']);
angular.module('verklizan.umox.mobile.account', ['verklizan.umox.mobile.common']);
angular.module('verklizan.umox.mobile.userInfo', ['verklizan.umox.mobile.common']);
angular.module('verklizan.umox.mobile.subscriber', ['verklizan.umox.mobile.common']);
angular.module('verklizan.umox.mobile.careRequests', ['verklizan.umox.mobile.common']);
angular.module('verklizan.umox.mobile.messages', ['verklizan.umox.mobile.common']);
