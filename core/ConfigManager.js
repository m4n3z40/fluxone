'use strict';

import _ from 'lodash';

export const DEVELOPMENT = 'development';
export const TESTING = 'testing';
export const PRODUCTION = 'production';

/**
 * Config Manager class
 *
 * @class
 */
export default class ConfigManager {
    /**
     * Initializes an instance of a config manager
     *
     * @param {Object} configBundle
     * @param {string} environment
     * @constructor
     */
    constructor(configBundle, environment = null) {
        this._registry = {};
        this._env = environment !== null ? environment : DEVELOPMENT;
        this.setMany(configBundle);
    }

    /**
     * Returns a value of config registered by the name passed, if exists
     *
     * @param {string} name
     * @return {*}
     */
    get(name) {
        return name in this._registry ? this._registry[name] : null;
    }

    /**
     * Returns true if there is an config value with the specified name, false otherwise
     *
     * @param {string} name
     * @return {boolean}
     */
    has(name) {
        return name in this._registry && !!this._registry[name];
    }

    /**
     * Sets a config value with the specified name
     *
     * @param {string} name
     * @param {*} config
     */
    set(name, config) {
        if (config) {
            this._registry[name] = _.isObject(config) && (this._env in config) ? config[this._env] : config;
        }
    }

    /**
     * Sets an array of config values with the specified data
     *
     * @param {array|Object} configBundle
     * @return {void}
     */
    setMany(configBundle) {
        if (!configBundle) return;

        if (_.isArray(configBundle)) {
            return _.forEach(configBundle, (config) => {
                this.set(config.name, config.content);
            });
        }

        if (_.isObject(configBundle)) {
            return _.forOwn(configBundle, (content, name) => {
                this.set(name, content);
            });
        }

        throw new Error('Invalid config bundle, it must be an array or object.');
    }
}