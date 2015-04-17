'use strict';

import Application from '../../core/Application.js';
import Service from '../../core/Service.js';

describe('Service', () => {
    var app;
    var service;

    class ChildService extends Service {
        get name() {
            return 'ChildService';
        }
    }

    beforeEach(() => {
        app = new Application();
        service = new ChildService(app);
    });

    it('has to be defined, be a function and can be instantiated', () => {
        expect(ChildService).toBeDefined();
        expect(ChildService).toEqual(jasmine.any(Function));
        expect(service instanceof ChildService).toBe(true);
    });

    it('holds an app instance', () => {
        var myApp = service.app;

        expect(myApp).toEqual(jasmine.any(Application));
        expect(myApp).toBe(app);
    });
});