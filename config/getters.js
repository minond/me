module.exports = {
    github: {
        user: process.env.GITHUB_OAUTH_USER,
        key: process.env.GITHUB_OAUTH_TOKEN
    },

    lastfm: {
        user: process.env.LASTFM_USER,
        key: process.env.LASTFM_API_KEY
    },

    fitbit: {
        consumer_key: process.env.FITBIT_API_KEY,
        application_secret: process.env.FITBIT_SECRET,
        user_token: process.env.FITBIT_ACCESS_TOKEN,
        user_secret: process.env.FITBIT_ACCESS_TOKEN_SECRET
    },

    sleep_cycle: {
        files: process.env.HOME + '/Downloads/sleepdata*'
    },

    weather: {
        static_location: 'Provo, UT'
    }
};
