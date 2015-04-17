'use strict';

import Application from '../../core/Application.js';
import Action from '../../core/Action.js';

describe('Action', () => {
    var app;
    var action;

    class ChildAction extends Action {
        get name() {
            return 'ChildAction';
        }
    }

    beforeEach(() => {
        app = new Application();
        action = new ChildAction(app);
    });

    it('has to be defined, be a function and can be instantiated', () => {
        expect(ChildAction).toBeDefined();
        expect(ChildAction).toEqual(jasmine.any(Function));
        expect(action instanceof ChildAction).toBe(true);
    });

    it('holds an app instance', () => {
        var myApp = action.app;

        expect(myApp).toEqual(jasmine.any(Application));
        expect(myApp).toBe(app);
    });

    it('has an execute function that throws an error if it is not implemented', () => {
        expect(action.execute).toEqual(jasmine.any(Function));

        expect(() => action.execute(payload)).toThrow();
    });
});