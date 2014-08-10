angular.module('me').controller('HomeController',
    function ($scope, entries, moment) {
        'use strict';

        var until = moment(),
            since = moment().subtract(6, 'days'),
            range = moment.range(since, until);

        /**
         * objects holding informaiton for every day
         * @property days
         * @type {Object}
         */
        $scope.days = [];

        range.by('day', function (date) {
            var len = {},
                day = {};

            len = {
                since: date.startOf('day').toDate().toISOString(),
                until: date.endOf('day').toDate().toISOString()
            };

            day = {
                date: date,
                commits: {},
                fat: {},
                songs: {},
                steps: {},
                weight: {},
            };

            $scope.days.unshift(day);

            entries.query('action/song', len).success(function (res) {
                day.songs.count = res.data.length;
                day.songs.data = res.data;
            });

            entries.query('action/commit', len).success(function (res) {
                day.commits.count = res.data.length;
                day.commits.data = res.data;
            });

            entries.query('health/steps', len).success(function (res) {
                day.steps.count = res.data.length;
                day.steps.data = res.data;
            });

            entries.query('health/weight', len).success(function (res) {
                day.weight.count = res.data.length;
                day.weight.data = res.data;
            });

            entries.query('health/fat', len).success(function (res) {
                day.fat.count = res.data.length;
                day.fat.data = res.data;
            });
        });
    }
);
