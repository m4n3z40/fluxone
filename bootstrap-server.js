'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import jade from 'jade';
import bootstrapApplication from 'bootstrap-application.js';

/**
 * Instantiates the server instance, bootstrapping needed data and returns it
 *
 * @param {Object} configBundle
 * @param {Object} utils
 * @param {string} env
 * @return {Server}
 */
export default function bootstrap(configBundle = {}, utils = {}, env = null) {
    //Creates the server express instance
    let server = express();

    //Configuring the jade view engine at the layout directory
    server.set('views', './layouts');
    server.set('view engine', 'jade');
    server.engine('jade', jade.__express);

    //Configuring request body parsers
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true}));

    //Configures route public to pass through the public assets directory
    server.use('/public', express.static('public'));

    //Responds the favicon icon, cannot let react router handle this
    server.get('/favicon.ico', function (req, res) {
        //TODO: get a favicon to work
        res.status(404).end();
    });

    //Sets the catch-all route, lets everything get handled by react router
    server.get('*', (req, res) => {
        //Instantiates and configures the application for each session
        let app = bootstrapApplication(configBundle, utils, env);

        app
            .renderServer(req.url, {app: app})
            .then(function (content) {
                res.render('default', {
                    lang: app.config('main').defaultLang,
                    pageTitle: app.siteTitle,
                    content,
                    state: JSON.stringify(app.saveState())
                });
            }, function (error) {
                console.error(`Could not render application: \n ${error.message} \n  ${error.stack}`);
            });
    });

    return server;
};
