[![Build Status](https://travis-ci.org/minond/me.svg?branch=master)](https://travis-ci.org/minond/me)

me
===

Gather information about myself so that I can graph and analyze it.

## getting started
```sh
# installing
npm install
bower install

# running tests and linters
npm test

# staring data sync (set DEBUG=* to see debugging output)
foreman start worker

# starting web server
foreman start server
```

Make sure to set the environment variables used in `config/getters.js` and
modify the contents of `config/schedule.js` to your needs.

## data
#### current sources
* fitbit
* github
* lastfm
* sleep cycle app
* weather information

#### future sources
* youtube
* air quality
* songs metadata
* anything else

## todo
1. tests
2. display data
3. summary view job
4. complete 'future sources'
