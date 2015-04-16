'use strict';

import _ from 'lodash';
import Application from 'core/Application.js';

var instancesCount =  0;

/**
 * Store base class for the flux architecture
 *
 * @class
 */
export default class Store {
    /**
     * Class constructor
     *
     * @param {Application} app
     * @param {Object} handlers
     */
    constructor(app, handlers = {}) {
        if (app) {
            this.app = app;
        }

        this.handlers = _.assign(this.getActionHandlers(), handlers);

        this._instanceId = ++instancesCount;

        this.initialize();
    }

    /**
     * Hook to do some init work that gets called just after the parents constructor has been called
     */
    initialize() {}

    /**
     * Hook that will save the state of the store between server and client
     *
     * @return {Object}
     */
    saveState() {
        throw new Error('The server state of this store is not been saved to be reused on the client');
    }

    /**
     * Hook that will restore the state of the store between server and client
     *
     * @param {Object} state
     */
    restoreState(state) {
        throw new Error('The server state of this store is not been restored on the client');
    }

    /**
     * Hook that will register the action handlers of the child stores on instantiation
     *
     * @return {Object}
     */
    getActionHandlers() {
        return {};
    }

    /**
     * Return the name of the store for dependency container use
     *
     * @return {string}
     */
    get name() {
        throw new Error('You have to implement a getter with the signature "get name()" returning the store identifier.');
    }

    /**
     * Sets the action handlers by passing a hash object.
     * The key being the action name and
     * the value being a function on name of a function of this class.
     *
     * @param {Object} handlers
     */
    set handlers(handlers) {
        let app = this.app;

        if (app && this._handlers) {
            removeActionHandlers(this);
        }

        this._handlers = handlers;

        if (app) registerActionHandlers(this);
    }

    /**
     * Returns the handlers hash object.
     *
     * @return {Object}
     */
    get handlers() {
        return this._handlers;
    }

    /**
     * Sets the app that will take care of action dispatching in the store.
     *
     * @param {Object} app
     */
    set app(app) {
        let handlers = this.handlers;

        if (!(app instanceof Application)) {
            throw new Error('Parameter must be an instance of Application.')
        }

        if (handlers && this._app) {
            removeActionHandlers(this);
        }

        this._app = app;

        if (handlers) registerActionHandlers(this);
    }

    /**
     * Gets the app instance.
     *
     * @return {Object}
     */
    get app() {
        return this._app;
    }

    /**
     * Gets the change action name for this store instance
     *
     * @return {string}
     */
    get changeActionName() {
        return `CHANGE_ACTION.${this.name}.${this._instanceId}`;
    }

    /**
     * Register a listener that will be notified of every change that happens in the store
     *
     * @param {Function} listener
     */
    registerListener(listener) {
        this.app.on(this.changeActionName, listener);
    }

    /**
     * Removes the change listener waiting for changes of this store
     *
     * @param {Function} listener
     */
    removeListener(listener) {
        this.app.off(this.changeActionName, listener);
    }

    /**
     * Notifies all listeners that the store has changed its state
     */
    emitChanges() {
        this.app.emit(this.changeActionName, this);
    }
}

/**
 * Registers the action handlers contained in the store
 *
 * @param {Store} store
 */
function registerActionHandlers(store) {
    _.forOwn(store.handlers, (handler, actionName) => {
        store.app.on(actionName, _.isFunction(handler) ? handler : _.bind(store[handler], store));
    });
}

/**
 * Removes the action handlers contained in the store
 *
 * @param {Store} store
 */
function removeActionHandlers(store) {
    _.forOwn(store.handlers, (handler, actionName) => {
        store.app.off(actionName, _.isFunction(handler) ? handler : _.bind(store[handler], store));
    });
}