module.exports.storage = {
    db: 'me',
    collection: 'data'
};

module.exports.auth = {
    github: {
        user: process.env.GITHUB_USER,
        key: process.env.GITHUB_TOKEN
    },

    forecast_io: {
        key: process.env.FORECASTIO_API_KEY
    },

    lastfm: {
        user: process.env.LASTFM_USER,
        key: process.env.LASTFM_API_KEY
    },

    moves_app: {
        expires_in: process.env.MOVES_APP_EXPIRATION_DATE,
        consumer_key: process.env.MOVES_APP_CLIENT_ID,
        application_secret: process.env.MOVES_APP_SECRET,
        access_token: process.env.MOVES_APP_ACCESS_TOKEN,
        refresh_token: process.env.MOVES_APP_REFRESH_TOKEN
    },

    fitbit: {
        consumer_key: process.env.FITBIT_API_KEY,
        application_secret: process.env.FITBIT_SECRET,
        user_token: process.env.FITBIT_ACCESS_TOKEN,
        user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
    }
};

module.exports.files = {
    sleep_cycle: process.env.SLEEP_CYCLE_GLOB
};

module.exports.user = {
    location: process.env.MY_STATIC_LOCATION
};
