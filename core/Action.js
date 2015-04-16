'use strict';

import Application from 'core/Application.js';

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
        if (app) {
            this.app = app;
        }
    }

    /**
     * Return the name of the action for dependency container use
     *
     * @return {string}
     */
    get name() {
        throw new Error('You have to implement a getter with the signature "get name()" returning the action identifier.');
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
     * @return {Promise|void}
     */
    execute(payload) {
        throw new Error('This action has not been implemented yet.');
    }
}