'use strict';

import Application from './Application.js';

/**
 * Action class of the flux architecture
 *
 * @class
 */
export default class Action {
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

    /**
     * Executes the action
     *
     * @param {Object} payload
     * @param {Function} callback
     * @return {Promise|void}
     */
    execute(payload, callback) {
        throw new Error('This action has not been implemented yet.');
    }
}