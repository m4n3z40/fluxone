'use strict';

import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import EventEmitter from 'event-emitter';
import ConfigManager from 'core/ConfigManager.js';
import Container from 'core/Container.js';
import Store from 'core/Store.js';
import Action from 'core/Action.js';
import Service from 'core/Service.js';
import SiteTitle from 'core/SiteTitle.js';

/**
 * Prefix for the stores contained in the container
 *
 * @type {string}
 */
const STORES_PREFIX = 'store.';

/**
 * Prefix for the actions contained in the container
 *
 * @type {string}
 */
const ACTIONS_PREFIX = 'action.';

/**
 * Prefix for the services contained in the container
 * @type {string}
 */
const SERVICES_PREFIX = 'service.';

/**
 * Prefix for the utils container in the container
 * @type {string}
 */
const UTILS_PREFIX = 'util.';

/**
 * Key for the config object in the container
 *
 * @type {string}
 */
export const CONFIG_KEY = 'config';

/**
 * Key for the event emitter object in the container
 *
 * @type {string}
 */
export const EVENT_EMITTER_KEY = 'event-emitter';

/**
 * Application container, here be all the crucial tools of the app
 *
 * @class
 */
export default class Application {
    /**
     * Class constructor
     *
     * @param {array|Object} configBundle
     * @param {array} utils
     * @param {string} env
     */
    constructor(configBundle, utils, env) {
        this._registeredStores = [];
        this._routes = null;

        this._container = new Container();
        this._container.registerSingleton(EVENT_EMITTER_KEY, () => EventEmitter());
        this._container.registerSingleton(CONFIG_KEY, new ConfigManager(configBundle, env));

        if (utils) this.addUtils(utils);

        this._prepareSiteTitle();
    }

    /**
     * Prepares the site title with the default config
     *
     * @private
     */
    _prepareSiteTitle() {
        let mainConfig = this.config('main');

        if (mainConfig) {
            this.siteTitle = new SiteTitle(mainConfig.baseTitle, mainConfig.titleSeparator);
        }
    }

    /**
     * Sets the site title manager
     *
     * @param {SiteTitle} siteTitle
     */
    set siteTitle(siteTitle) {
        if (siteTitle instanceof SiteTitle) {
            return this._siteTitle = siteTitle;
        }

        if (_.isString(siteTitle)) {
            this._siteTitle.set(siteTitle);
        }
    }

    /**
     * Gets the site title manager
     *
     * @return {SiteTitle}
     */
    get siteTitle() {
        return this._siteTitle;
    }

    /**
     * Sets the routes for the applications
     *
     * @param {Route} routes
     */
    set routes(routes) {
        this._routes = routes;
    }

    /**
     * Gets the application routes
     *
     * @return {Route}
     */
    get routes() {
        return this._routes;
    }

    /**
     * Returns a registered object from the container if exists
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        return this._container.get(name);
    }

    /**
     * Gets or sets a config value
     *
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    config(name, value = null) {
        let config = this.get(CONFIG_KEY);

        if (!value) return config.get(name);

        config.set(name, value);
    }

    /**
     * Adds a list of util objects to the container
     *
     * @param {array|Object} utils
     */
    addUtils(utils) {
        if (_.isArray(utils)) {
            return _.forEach(utils, (item) => this.util(item.name, item.util));
        }

        if (_.isObject(utils)) {
            return _.forOwn(utils, (util, name) => this.util(name, util));
        }

        throw new Error('Invalid list of utilities, it must be an array or an hash object.');
    }

    /**
     * Gets a util from the app container
     *
     * @param {string} name
     * @param {Function|Object} util
     */
    util(name, util = null) {
        let utilKey = UTILS_PREFIX + name;

        if (!util && !_.isObject(util) && !_.isFunction(util)) {
            return this.get(utilKey);
        }

        this.value(utilKey, util);
    }

    /**
     * Adds a store to the app container
     *
     * @param {Store} store
     */
    addStore(store) {
        if (!(store instanceof Store)) {
            throw new Error('the parameter must be an instance of Store.');
        }

        if (!store.app) {
            store.app = this;
        }

        if (!store.eventEmitter) {
            store.eventEmitter = this.get(EVENT_EMITTER_KEY);
        }

        let storeKey = STORES_PREFIX + store.name;

        this.singleton(storeKey, store);
        this._registeredStores.push(storeKey);
    }

    /**
     * Removes a store from the app container
     *
     * @param {string} name
     */
    removeStore(name) {
        let storeKey = STORES_PREFIX + name,
            registeredStores = this._registeredStores;

        this._container.remove(storeKey);
        registeredStores.splice(registeredStores.indexOf(name), 1);
    }

    /**
     * Returns the store contained in the app container
     *
     * @param name
     * @return {Store}
     */
    getStore(name) {
        return this.get(STORES_PREFIX + name);
    }

    /**
     * Adds an action to the app container to be executed later
     *
     * @param {Action} action
     */
    addAction(action) {
        if (!(action instanceof Action)) {
            throw new Error('The parameter must be an instance of Action.');
        }

        if (!action.app) {
            action.app = this;
        }

        this.singleton(ACTIONS_PREFIX + action.name, action);
    }

    /**
     * Removes an action from the app container
     *
     * @param {string} name
     */
    removeAction(name) {
        this._container.remove(ACTIONS_PREFIX + name);
    }

    /**
     * Executes an action registered in the app container
     *
     * @param {string} name
     * @param {*} payload
     * @return {Promise|void}
     */
    executeAction(name, payload) {
        let action = this.get(ACTIONS_PREFIX + name);

        if (!action) {
            throw new Error(`Action '${name}' was not registered in the app container, therefore it cannot be executed.`);
        }

        return action.execute(payload);
    }

    /**
     * Adds a service object to the app container
     *
     * @param {Service} service
     * @return {void}
     */
    addService(service) {
        if (!(service instanceof Service)) {
            throw new Error('The parameter must be an instance of Service.');
        }

        if (!service.app) {
            service.app = this;
        }

        this.singleton(SERVICES_PREFIX + service.name, service);
    }

    /**
     * Removes a service object from the app container
     *
     * @param {string} name
     */
    removeService(name) {
        this._container.remove(SERVICES_PREFIX + name);
    }

    /**
     * Gets a service object from the app container
     *
     * @param {string} name
     * @return {Service}
     */
    getService(name) {
        return this.get(SERVICES_PREFIX + name);
    }

    /**
     * Restores the global states for all stores registered in the app instance
     *
     * @param {object} state
     */
    saveState(state) {
        return _.reduce(this._registeredStores, (result, storeKey) => {
            return _.assign(result, this.get(storeKey).saveState());
        }, {});
    }

    /**
     * Returns the state of all stores registered in the app instance
     *
     * @return {Object}
     */
    restoreState(state) {
        _.forEach(this._registeredStores, (storeKey) => {
            this.get(storeKey).restoreState(state)
        });
    }

    /**
     * Registers an instance of a singleton in the app container
     *
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    singleton(name, value = null) {
        if (!value) return this.get(name);

        this._container.registerSingleton(name, value);
    }

    /**
     * Registers a simple value in the app container
     *
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    value(name, value = null) {
        if (!value) return this.get(name);

        this._container.registerValue(name, value);
    }

    /**
     * Registers a factory in the app container
     *
     * @param {string} name
     * @param {Function} value
     * @returns {*}
     */
    factory(name, value) {
        if (!value) return this.get(name);

        this._container.registerFactory(name, value);
    }

    /**
     * Register a handler for the given event
     *
     * @param {string} event
     * @param {Function} handler
     */
    on(event, handler) {
        this.get(EVENT_EMITTER_KEY).on(event, handler);
    }

    /**
     * Removes the handler for the given event
     *
     * @param {string} event
     * @param {Function} handler
     */
    off(event, handler) {
        this.get(EVENT_EMITTER_KEY).off(event, handler);
    }

    /**
     * Executes all registered handlers for the given event
     *
     * @param {string} event
     * @param {array} args
     */
    emit(event, ...args) {
        this.get(EVENT_EMITTER_KEY).emit(event, ...args);
    }

    /**
     * Renders the app on the server
     *
     * @param {string} currentUrl
     * @param {Object} rootProps
     * @return {Promise}
     */
    renderServer(currentUrl, rootProps) {
        return new Promise((resolve, reject) => {
            return Router.run(this._routes, currentUrl, (Handler) => {
                try {
                    let content = React.renderToString(React.createElement(Handler, rootProps));

                    resolve(content);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Renders the app on the client
     *
     * @param {HTMLElement} container
     * @param {Object} rootProps
     */
    renderClient(container, rootProps) {
        Router.run(this._routes, Router.HistoryLocation, (Handler) => {
            React.render(React.createElement(Handler, rootProps), container);
        });
    }
}