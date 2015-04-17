'use strict';

import Application from './Application.js';

/**
 * Service class
 *
 * @class
 */
export default class Service {
    /**
     * Class constructor
     *
     * @param {Application} app
     */
    constructor(app = null) {
        if (app) {
            this.app = app;
        }
    }

    /**
     * Return the name of the service for dependency container use
     *
     * @return {string}
     */
    get name() {
        throw new Error('You have to implement a getter with the signature "get name()" returning the service identifier.');
    }

    /**
     * Sets the app instance
     *
     * @param {Application} app
     */
    set app(app) {
        if (!(app instanceof Application)) {
            throw new Error('Parameter must bi an instance of Application.');
        }

        this._app = app;
    }

    /**
     * Gets the app instance
     *
     * @return {Application}
     */
    get app() {
        return this._app;
    }
}