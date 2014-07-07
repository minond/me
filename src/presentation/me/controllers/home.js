'use strict';

angular.module('me').controller('HomeController', function ($scope, entries) {
    entries.query('action/song').success(function (data) {
        $scope.songs = data.data;
    });
});
