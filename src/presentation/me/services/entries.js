'use strict';

angular.module('me').service('entries', function ($http) {
    var BASE_URL = '/entry/',
        QUERY_URL = BASE_URL + 'query/';

    return {
        /**
         * @param {string} [entry]
         * @param {Object} [params]
         */
        query: function (entry, params) {
            return $http({
                method: 'GET',
                url: QUERY_URL + (entry || ''),
                params: params
            });
        },

        /**
         * @param {string} endpoint
         */
        get: function (endpoint) {
            return $http({
                method: 'GET',
                url: BASE_URL + endpoint
            });
        }
    };
});
