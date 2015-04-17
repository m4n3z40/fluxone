'use strict';

import Application from '../../core/Application.js';
import Store from '../../core/Store.js';

describe('Store', () => {
    var app;
    var store;

    class ChildStoreClass extends Store {
        get name() {
            return 'ChildStoreClass';
        }

        getActionHandlers() {
            return {
                'event1': 'handler1',
                'event2': 'handler2'
            };
        }
    }

    Application.prototype.on = jest.genMockFn().mockImpl(Application.prototype.on);
    Application.prototype.off = jest.genMockFn().mockImpl(Application.prototype.off);
    Application.prototype.emit = jest.genMockFn().mockImpl(Application.prototype.emit);

    ChildStoreClass.prototype.handler1 = jest.genMockFn().mockImpl();
    ChildStoreClass.prototype.handler2 = jest.genMockFn().mockImpl();

    beforeEach(() => {
        app = new Application();
        store = new Store(app);

        Object.defineProperty(store, 'name', {
            value: 'Store'
        });

        ChildStoreClass.prototype.initialize = jest.genMockFn().mockImpl(ChildStoreClass.prototype.initialize);
    });

    it('has to be defined, be a function and can be instantiated', () => {
        expect(Store).toBeDefined();
        expect(Store).toEqual(jasmine.any(Function));
        expect(store instanceof Store).toBe(true);
    });

    it('holds an app instance', () => {
        var myApp = store.app;

        expect(myApp).toEqual(jasmine.any(Application));
        expect(myApp).toBe(app);
    });

    it('can register change listeners and notify changes', () => {
        var handler = jest.genMockFn();

        store.registerListener(handler);

        expect(store.hasListeners()).toBe(true);

        store.emitChanges();

        expect(handler.mock.calls[0][0]).toEqual(store);

        store.emitChanges();

        expect(handler.mock.calls[1][0]).toEqual(store);
        expect(handler.mock.calls.length).toBe(2);

        store.removeListener(handler);

        expect(store.hasListeners()).toBe(false);
    });

    it('can be extended and register children`s default handlers', () => {
        var handler3 = jest.genMockFn(),
            childStore = new ChildStoreClass(app, {'event3': handler3}),
            payload = {'foo': 'bar'};

        expect(app.hasListeners('event1')).toBe(true);
        expect(app.hasListeners('event2')).toBe(true);
        expect(app.hasListeners('event3')).toBe(true);

        app.emit('event1', payload);
        app.emit('event2', payload);
        app.emit('event3', payload);

        expect(childStore.handler1.mock.calls[0][0]).toEqual(payload);
        expect(childStore.handler2.mock.calls[0][0]).toEqual(payload);
        expect(handler3.mock.calls[0][0]).toEqual(payload);
    });

    it('lends some utility hooks to his children', () => {
        var childStore = new ChildStoreClass(app);

        expect(childStore.initialize.mock.calls.length).toBe(1);
        expect(childStore.saveState).toEqual(jasmine.any(Function));
        expect(childStore.restoreState).toEqual(jasmine.any(Function));
    });
});