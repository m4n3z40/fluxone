'use strict';

import Application from '../../core/Application.js';

describe('Service', () => {
    var app;

    beforeEach(() => {
        app = new Application();
    });

    it('has to be defined, be a function and can be instantiated', () => {
        expect(Application).toBeDefined();
        expect(Application).toEqual(jasmine.any(Function));
        expect(app instanceof Application).toBe(true);
    });
});