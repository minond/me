'use strict';

var Entry = require('../../../entry'),
    log = require('debug')('environment:weather:forecast_io:getter');

/**
 * @param {Object} storage
 * @param {ForecastIo} forecast_io
 * @param {Object} filters
 */
module.exports = function (storage, forecast_io, filters) {
    var date = filters.since,
        suid = Entry.date2suid(date);

    // TODO get from filters
    // var lat = filters.latitude,
    //     lon = filters.longitude;

    var lat = process.env.MY_LATITUDE,
        lon = process.env.MY_LONGITUDE;

    log('getting weather data from forecast.io for %s', date);

    /**
     * handles response from foercast.io's forecast call
     * @param {Object} res
     */
    forecast_io.forecast(lat, lon, Math.round(date / 1000)).then(function (res) {
        var today = res.daily.data.shift(),
            entry = new Entry('weather', suid, {
                summary: today.summary,
                icon: today.icon,
                precipitation_prop: today.precipProbability,
                precipitation_type: today.precipType,
                temp_min: today.temperatureMin,
                temp_max: today.temperatureMax,
                feels_like_min: today.apparentTemperatureMin,
                feels_like_max: today.apparentTemperatureMax,
                dew_point: today.dewPoint,
                humidity: today.humidity,
                wind_speed: today.windSpeed,
                visibility: today.visibility,
                cloud_cover: today.cloudCover,
                pressure: today.pressure,
                ozone: today.ozone
            });

        entry.source = 'forecast.io';
        entry.dtstamp = date;
        log('saving %s', entry.id());
        storage.upsert(entry);
    });
};
