'use strict';

import Container from '../../core/Container.js';

describe('Container', () => {
    var container;

    beforeEach(() => {
        container = new Container();
    });

    it('has to be defined and be a function', () => {
        expect(Container).toBeDefined();
        expect(Container).toEqual(jasmine.any(Function));
        expect(container).toEqual(jasmine.any(Container));
    });

    it('can register and retrieve a simple value', () => {
        container.registerValue('foo', 'bar');

        expect(container.get('foo')).toBe('bar');
    });

    it('can register and lazily retrieve a simple value', () => {
        let factory = jest.genMockFn().mockReturnValue('bar');

        container.registerValue('foo', factory);

        expect(container.get('foo')).toBe('bar');
        expect(container.get('foo')).toBe('bar');

        expect(factory.mock.calls.length).toBe(1);
    });

    it('can register and retrieve an array value', () => {
        let arr = [1, 2, 3];

        container.registerValue('foo', arr);

        expect(container.get('foo')).toBe(arr);
    });

    it('can register and retrieve lazily an array value', () => {
        let arr = [1, 2, 3],
            factory = jest.genMockFn().mockReturnValue(arr);

        container.registerValue('foo', factory);

        expect(container.get('foo')).toBe(arr);
        expect(container.get('foo')).toBe(arr);

        expect(factory.mock.calls.length).toBe(1);
    });

    it('can register and retrieve a singleton', () => {
        let singleton = { 'foo': 'bar' };

        container.registerSingleton('foo', singleton);

        expect(container.get('foo')).toBe(singleton);
    });

    it('can register and lazily retrieve a singleton', () => {
        let singleton = { 'foo': 'bar' },
            factory = jest.genMockFn().mockReturnValue(singleton);

        container.registerSingleton('foo', factory);

        expect(container.get('foo')).toBe(singleton);
        expect(container.get('foo')).toBe(singleton);

        expect(factory.mock.calls.length).toBe(1);
    });

    it('can register and execute factories', () => {
        let factory = jest.genMockFn().mockReturnValue('bar');

        container.registerFactory('foo', factory);

        expect(container.get('foo')).toBe('bar');
        expect(container.get('foo')).toBe('bar');

        expect(factory.mock.calls.length).toBe(2);
    });

    it('can remove values', () => {
        container.registerValue('foo', 'bar');

        expect(container.get('foo')).toBe('bar');

        container.remove('foo');

        expect(container.get('foo')).toBeNull();
    });

    it('can inject dependencies in a function using a helper method', () => {
        container.registerValue('foo', 'foo');
        container.registerValue('bar', 'bar');
        container.registerFactory('bar2', () => 'bar');

        let injectedFoo = container.inject('foo', (foo) => foo),
            injectedFooBarBar = container.inject(['foo', 'bar', 'bar2'], (...args) => args.join(' '));

        expect(injectedFoo).toEqual(jasmine.any(Function));
        expect(injectedFoo()).toBe('foo');

        expect(injectedFooBarBar).toEqual(jasmine.any(Function));
        expect(injectedFooBarBar()).toBe('foo bar bar');
    });

    it('can inject dependencies in a function using the array notation', () => {
        container.registerValue('foo', 'foo');
        container.registerValue('bar', 'bar');
        container.registerFactory('bar2', () => 'bar');

        let injectedFooBarBar = container.inject(['foo', 'bar', 'bar2', (...args) => args.join(' ')]);

        expect(injectedFooBarBar()).toBe('foo bar bar');
    });
});