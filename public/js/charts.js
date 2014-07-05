'use strict';

/* global d3, dc, node, crossfilter */

var artists_chart = dc.rowChart(node('#charts')),
    songs_chart = dc.rowChart(node('#charts'));

d3.json('/entry/query/action/song', function (err, data) {
    var xf = crossfilter(data.data),
        artists_dim = xf.dimension(function (song) { return song.data.artist.name; }),
        songs_dim = xf.dimension(function (song) { return song.data.name; }),
        artists_group = artists_dim.group(),
        songs_group = songs_dim.group();

    artists_chart
        .height(1000)
        .width(300)
        .dimension(artists_dim)
        .group(artists_group)
        .render();

    songs_chart
        .height(7000)
        .width(600)
        .dimension(songs_dim)
        .group(songs_group)
        .render();
});
