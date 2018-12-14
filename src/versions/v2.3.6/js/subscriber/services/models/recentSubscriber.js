angular.module('verklizan.umox.mobile.subscriber').factory('RecentSubscriber',
    function () {
        'use strict';

        function RecentSubscriber(id, name) {
            this.id = id;
            this.name = name;
        }

        return RecentSubscriber;
    });
