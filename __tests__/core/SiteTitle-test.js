'use strict';

import SiteTitle from '../../core/SiteTitle.js'

describe('SiteTitle', () => {
    var siteTitle;

    beforeEach(() => {
        siteTitle = new SiteTitle('base title', ' - ');
    });

    it('has to be defined and be a function', () => {
        expect(SiteTitle).toBeDefined();
        expect(SiteTitle).toEqual(jasmine.any(Function));
        expect(siteTitle).toEqual(jasmine.any(SiteTitle));
    });

    it('can set a simple title with one segment and supports converting to string', () => {
        expect(siteTitle.full).toEqual('base title');
        expect('' + siteTitle).toEqual('base title');
    });

    it('can set multiple title segments and supports converting to string', () => {
        siteTitle.push('segment 1');

        expect(siteTitle.full).toEqual('base title - segment 1');
        expect('' + siteTitle).toEqual('base title - segment 1');

        siteTitle.push('segment 2');

        expect(siteTitle.full).toEqual('base title - segment 1 - segment 2');
        expect('' + siteTitle).toEqual('base title - segment 1 - segment 2');

        siteTitle.set('unique segment');

        expect(siteTitle.full).toEqual('base title - unique segment');
        expect('' + siteTitle).toEqual('base title - unique segment');
    });

    it('supports reseting and popping an segment', () => {
        siteTitle.push('segment 1');

        expect(siteTitle.full).toEqual('base title - segment 1');
        expect('' + siteTitle).toEqual('base title - segment 1');

        expect(siteTitle.pop()).toEqual('segment 1');

        expect(siteTitle.full).toEqual('base title');
        expect('' + siteTitle).toEqual('base title');

        siteTitle.set('unique segment');

        expect(siteTitle.full).toEqual('base title - unique segment');
        expect('' + siteTitle).toEqual('base title - unique segment');

        siteTitle.reset();

        expect(siteTitle.full).toEqual('base title');
        expect('' + siteTitle).toEqual('base title');
    });
});