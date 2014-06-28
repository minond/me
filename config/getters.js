module.exports = {
    github: {
        user: process.env.GITHUB_OAUTH_USER,
        key: process.env.GITHUB_OAUTH_TOKEN
    },

    lastfm: {
        user: process.env.LASTFM_USER,
        key: process.env.LASTFM_API_KEY
    },

    sleep_cycle: {
        files: '/home/marcos/Downloads/sleepdata*'
    },

    weather: {
        static_location: 'Provo, UT'
    }
};
