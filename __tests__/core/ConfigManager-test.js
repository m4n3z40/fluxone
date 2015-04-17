'use strict';

import ConfigManager from '../../core/ConfigManager.js';

describe('ConfigManager', () => {
    var config;

    beforeEach(() => {
        config = new ConfigManager();
    });

    it('has to be defined, be a function and can be instantiated', () => {
        expect(ConfigManager).toBeDefined();
        expect(ConfigManager).toEqual(jasmine.any(Function));
        expect(config instanceof ConfigManager).toEqual(true);
    });

    it('can set and get a config value', () => {
        config.set('foo', 'bar');

        expect(config.has('foo')).toBe(true);
        expect(config.get('foo')).toBe('bar');
    });

    it('can set many config values with an array', () => {
        var confs = [
            {name: 'foo', content: 'bar'},
            {name: 'foo1', content: 'bar2'},
            {name: 'foo2', content: 'bar3'}
        ];

        config.setMany(confs);

        confs.forEach(function(conf) {
            expect(config.get(conf.name)).toBe(conf.content);
        });
    });

    it('can set many config values with an object', () => {
        var confs = {
            'foo': 'bar',
            'foo1': 'bar2',
            'foo2': 'bar3'
        };

        config.setMany(confs);

        for(var key in confs) {
            expect(config.get(key)).toBe(confs[key]);
        }
    });
});