'use strict';

import Application from 'core/Application.js';

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
        this.app = app;
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