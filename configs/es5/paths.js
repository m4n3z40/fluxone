module.exports = {
    /*************************
     * JS bundle configs
     *************************/

    clientJSEntryPoint: './client.js',

    clientJSDestinyFile: 'app.js',

    clientJSDestinyFolder: './public/js/',


    /*************************
     * Styles bundle configs
     *************************/

    clientStylesEntryPoint: './styles/app.styl',

    clientStylesDestinyFolder: './public/css/',

    /*************************
     * Server configs
     *************************/

    serverEntryPoint: './server.js',

    /*************************
     * Watchers configs
     *************************/

    developmentJSWatchers: ['./**/*.js', '!./public/js/app.js', '!./node_modules/**/*.js'],

    developmentStylesWatchers: ['./styles/**/*.styl'],

    developmentLayoutsWatchers: ['./layouts/**/*.jade'],

    productionWatchers: ['./styles/**/*.styl', './**/*.js']
};
