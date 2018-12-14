(function (namespace, angular) {
    var $http, $q;

    namespace.loadConfig = function (configNamespace, url) {
        var initInjector = angular.injector(["ng"]);
        $http = initInjector.get("$http");
        $q = initInjector.get("$q");

        return $q.all([
            loadConfig(configNamespace, url),
            loadVerklizanConfig(configNamespace)
        ]);
    }

    var loadConfig = function (nameSpace, url) {
        return $http.get(url).then(function (response) {
            angular.module(nameSpace).constant("config", response.data);
        }, function () {
            console.error("config not found!");
        });
    }

    var loadVerklizanConfig = function (namespace) {
        return $http.get("verklizan.json").then(function (response) {
            angular.module(namespace).constant("verklizanConfig", response.data);
        }, function (errorResponse) {
            angular.module(namespace).constant("verklizanConfig", {});
        });
    }

})(window.verklizan = window.verklizan || {}, angular);