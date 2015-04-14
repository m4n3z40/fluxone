'use strict';

var _ = require('lodash');
var hasListenersIn = require('event-emitter/has-listeners');
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
     * @param {Object} eventEmitter
     * @param {Object} handlers
     */
    constructor(eventEmitter, handlers = {}) {
        this.eventEmitter = eventEmitter;
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
        return 'base';
    }

    /**
     * Sets the action handlers by passing a hash object.
     * The key being the action name and
     * the value being a function on name of a function of this class.
     *
     * @param {Object} handlers
     */
    set handlers(handlers) {
        let mediator = this.eventEmitter;

        if (mediator && this._handlers) {
            removeActionHandlers(this);
        }

        this._handlers = handlers;

        if (mediator) registerActionHandlers(this);
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
     * Sets the eventEmitter that will take care of action dispatching in the store.
     *
     * @param {Object} eventEmitter
     */
    set eventEmitter(eventEmitter) {
        let handlers = this.handlers;

        if (!eventEmitter) {
            throw new Error('EventEmitter object required to instantiate th Store.')
        }

        if (handlers && this._eventEmitter) {
            removeActionHandlers(this);
        }

        this._eventEmitter = eventEmitter;

        if (handlers) registerActionHandlers(this);
    }

    /**
     * Gets the eventEmitter instance.
     *
     * @return {Object}
     */
    get eventEmitter() {
        return this._eventEmitter;
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
        this.eventEmitter.on(this.changeActionName, listener);
    }

    /**
     * Returns if there are listeners waiting changes of this store
     *
     * @return {boolean}
     */
    hasListeners() {
        return hasListenersIn(this.eventEmitter, this.changeActionName);
    }

    /**
     * Removes the change listener waiting for changes of this store
     *
     * @param {Function} listener
     */
    removeListener(listener) {
        this.eventEmitter.off(this.changeActionName, listener);
    }

    /**
     * Notifies all listeners that the store has changed its state
     */
    emitChanges() {
        this.eventEmitter.fire(this.changeActionName, this);
    }
}

/**
 * Registers the action handlers contained in the store
 *
 * @param {Store} store
 */
function registerActionHandlers(store) {
    _.forOwn(store.handlers, (handler, actionName) => {
        store.eventEmitter.on(actionName, _.isFunction(handler) ? handler : _.bind(store[handler], store));
    });
}

/**
 * Removes the action handlers contained in the store
 *
 * @param {Store} store
 */
function removeActionHandlers(store) {
    _.forOwn(store.handlers, (handler, actionName) => {
        store.eventEmitter.off(actionName, _.isFunction(handler) ? handler : _.bind(store[handler], store));
    });
}