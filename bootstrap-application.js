'use strict';

import 'isomorphic-fetch';
import _ from 'lodash';
import Application from 'core/Application.js';

//Importing necessary utils here
import * as responseUtils from 'utils/responseUtils.js';
import * as urlUtils from 'utils/urlUtils.js';

//Importing necessary configs here
import * as mainConfig from 'configs/mainConfig.js';
import * as urlsConfig from 'configs/urlsConfig.js';

//Importing app routes
import getRoutes from 'routes.js';

//Importing actions
import HelloWorldAction from 'actions/HelloWorldAction.js';

//Importing stores
import HelloWorldStore from 'stores/HelloWorldStore.js';

/**
 * Instantiates the application instance, bootstrapping with all needed data and returns it
 *
 * @param {Object} configBundle
 * @param {Object} utils
 * @param {string} env
 * @return {Application}
 */
export default function bootstrap(configBundle = {}, utils = {}, env = null) {
    /**
     * List of config object that will be available throughout the app lifecycle
     *
     * @type {Object}
     */
    configBundle = _.assign({
        main: mainConfig,
        urls: urlsConfig
    }, configBundle);

    /**
     * List of utility functions that will be available throughout the app lifecycle
     *
     * @type {Object}
     */
    utils = _.assign({
        response: responseUtils,
        url: urlUtils
    }, utils);

    let app = new Application(configBundle, utils, env);

    //Adding routes
    app.routes = getRoutes();

    //Adding actions
    app.addAction(new HelloWorldAction());

    //Adding stores
    app.addStore(new HelloWorldStore());

    return app;
};