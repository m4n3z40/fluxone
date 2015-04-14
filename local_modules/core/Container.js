'use strict';

const VALUE = 0;
const FACTORY = 1;
const SINGLETON = 2;

/**
 * Dependency injection container
 *
 * @class
 */
export default class Container {
    /**
     * Instantiates the container instance
     *
     * @constructor
     */
    constructor() {
        this._registry = {};
        this._resolved = {};
    }

    /**
     * Registers a simple value in the container
     *
     * @param {string} name
     * @param {*} value
     */
    registerValue(name, value) {
        this._addToRegistry(VALUE, name, value);
    }

    /**
     * Registers a factory in the container
     *
     * @param {string} name
     * @param {Function|array} factory
     */
    registerFactory(name, factory) {
        this._addToRegistry(FACTORY, name, factory);
    }

    /**
     * Registers a singleton in the container
     *
     * @param {string} name
     * @param {*} singleton
     */
    registerSingleton(name, singleton) {
        this._addToRegistry(SINGLETON, name, singleton);
    }

    /**
     * Removes a value from the container
     *
     * @param {string} name
     * @returns {void}
     */
    remove(name) {
        if (name in this._resolved) {
            delete this._resolved[name];
        }

        if (name in this._registry) {
            delete this._registry[name];
        }
    }

    /**
     * Gets a dependency registered in the container
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        if (name in this._resolved) {
            return this._resolved[name];
        }

        return this._resolveFromRegistry(name);
    }

    /**
     * Injects the dependencies of the passed function as described
     * in the dependencies parameter (in the exact same order)
     *
     * @param {string|array} dependencies
     * @param {Function} callable
     * @returns {Function}
     */
    inject(dependencies, callable) {
        if (_.isString(dependencies)) {
            return this._injectOne(dependencies, callable);
        } else if (_.isArray(dependencies)) {
            return this._injectFromArray(dependencies, callable);
        }

        throw new Error('Invalid parameter. First parameter must be a dependency name or list of names.');
    }

    /**
     * Adds a object to the container
     *
     * @param {string} type
     * @param {string} name
     * @param {*} value
     * @private
     */
    _addToRegistry(type, name, value) {
        this._registry[name] = {name, type, value};
    }


    /**
     * Resolve the dependency on the container, tf it exists
     *
     * @param {string} name
     * @returns {*}
     * @private
     */
    _resolveFromRegistry(name) {
        if (!(name in this._registry)) return null;

        let resolver = this._registry[name],
            value = resolver.value,
            result;

        if (_.isFunction(value)) {
            result = value();
        } else if (_.isArray(value) && Container.isInjectableArray(value)) {
            result = this._injectFromArray(value)();
        }

        this._cacheResolved(resolver, result);

        return result;
    }

    /**
     * Caches the value of a resolved dependency
     *
     * @param {object} resolver
     * @param {*} value
     * @private
     */
    _cacheResolved(resolver, value) {
        if (resolver.type === VALUE || resolver.type === SINGLETON) {
            this._resolved[resolver.name] = value;
        }
    }

    /**
     * Injects the dependencies passed in the array format
     *
     * @param {array} dependencies
     * @param {Function} callable
     * @returns {Function}
     * @private
     */
    _injectFromArray(dependencies, callable) {
        if (Container.isInjectableArray(dependencies)) {
            callable = dependencies.pop();
        }

        if (dependencies.length <= 1) {
            return this._injectOne(dependencies, callable);
        }

        return this._injectMany(dependencies, callable);
    }

    /**
     * Inject exactly one dependency in the passed function
     *
     * @param {string} dependency
     * @param {Function} callable
     * @returns {Function}
     * @private
     */
    _injectOne(dependency, callable) {
        if (!_.isFunction(callable)) {
            throw new Error('Invalid parameter. second parameter must be a function.');
        }

        let dep = dependency ? this.get(dependency) : null;

        return function() { return callable(dep); };
    }

    /**
     * Injects the dependencies of the passed function as described
     * in the dependencies parameter (in the exact same order)
     *
     * @param {array} dependencies
     * @param {Function} callable
     * @returns {Function}
     * @private
     */
    _injectMany(dependencies, callable) {
        if (!_.isFunction(callable)) {
            throw new Error('Invalid parameter. second parameter must be a function.');
        }

        let injections = [];

        _.forEach(dependencies, (dep) => injections.push(this.get(dep)));

        return function() { return callable(...injections); };
    }

    /**
     * Returns true if passed array is an injectable array notation,
     * returns false otherwise.
     *
     * @static
     * @param {Array} array
     * @returns {boolean}
     */
    static isInjectableArray(array) {
        return _.isFunction(array[array.length - 1]);
    }
}