'use strict';

var _ = require('lodash');

import { Application, Store } from 'fluxone-core';

/**
 * Default handler name
 *
 * @type {string}
 */
export const DEFAULT_HANDLER_NAME = 'onChange';

export default {
    /**
     * Registers the statically declared listeners
     *
     * @return {void}
     */
    componentDidMount() {
        if (!(this.context.app instanceof Application)) {
            throw new Error('The application instance has not been added to the root component context.');
        }

        var listeners = this._normalizeStoreListeners();

        _.forEach(listeners, (listener) => {
            listener.store.registerListener(listener.handler);
        });

        this._listeners = listeners;
    },

    /**
     * Removes all the listeners registered freeing memory
     *
     * @return {void}
     */
    componentWillUnmount() {
        _.forEach(this._listeners, (listener) => {
            listener.store.removeListener(listener.handler);
        });

        this._listeners = null;
    },

    /**
     * Shortcut to get a store instance
     *
     * @param {string} name
     * @return {Store}
     */
    getStore(name) {
        var store = this.context.app.getStore(name);

        if (!store) {
            throw new Error( `Store ${name} has not been registered in the app container.`);
        }

        return store;
    },

    /**
     * Normalize the store listeners hash as a array of objects
     *
     * @return {Array}
     * @protected
     */
    _normalizeStoreListeners() {
        var storeListeners = this.constructor.storeListeners;

        return _.isArray(storeListeners) ?
            this._normalizeDefaultStoreListeners(storeListeners) :
            this._normalizeCustomStoreListeners(storeListeners);
    },

    /**
     * Normalizes the store listeners with the default handler name
     *
     * @param {Array} listeners
     * @return {Array}
     * @protected
     */
    _normalizeDefaultStoreListeners(listeners) {
        return _.map(listeners, (storeName) => {
            return {
                handler: this[DEFAULT_HANDLER_NAME],
                store: this.getStore(storeName)
            };
        });
    },

    /**
     * Normalizes the store listeners with a custom handler name
     *
     * @param {Object} listeners
     * @return {Array}
     * @protected
     */
    _normalizeCustomStoreListeners(listeners) {
        var normalizedHandlers = [];

        _.forIn(listeners, function(handler, storeName) {
            if (_.isString(handler)) {
                handler = this[handler];
            }

            normalizedHandlers.push({
                handler: handler,
                store: this.getStore(storeName)
            });
        });

        return normalizedHandlers;
    }
};