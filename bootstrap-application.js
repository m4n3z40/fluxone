'use strict';

import 'isomorphic-fetch';
import _ from 'lodash';
import Application from 'core/Application.js';

//Importing necessary utils here
import * as ResponseUtils from 'utils/ResponseUtils.js';
import * as UrlUtils from 'utils/UrlUtils.js';

//Importing necessary configs here
import * as mainConfig from 'configs/main.js';
import * as urlsConfig from 'configs/urls.js';

//Importing app routes
import getRoutes from 'routes.js';

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
        response: ResponseUtils,
        url: UrlUtils
    }, utils);

    let app = new Application(configBundle, utils, env);

    app.routes = getRoutes();

    return app;
};