import _ from 'lodash';
import Store from 'core/Store.js';
import * as helloWorldConstants from 'constants/helloWorldConstants.js';

/**
 * Store de hello world
 *
 * @class
 */
export default class HelloWorldStore extends Store {
    /**
     * Returns the store name
     *
     * @return {string}
     */
    get name() {
        return 'HelloWorldStore';
    }

    /**
     * Hook to do some init work that gets called just after the parents constructor has been called
     */
    initialize() {
        this.data = getRandomData();
    }

    /**
     * Hook that will save the state of the store between server and client
     *
     * @return {Object}
     */
    saveState() {
        return { helloWorldData: this.data };
    }

    /**
     * Hook that will restore the state of the store between server and client
     *
     * @param {Object} state
     */
    restoreState(state) {
        this.data = state.helloWorldData;
    }

    /**
     * Hook that will register the action handlers of the child stores on instantiation
     *
     * @return {Object}
     */
    getActionHandlers() {
        return {
            [helloWorldConstants.HELLO_WORLD_CHANGE]: '_onDataChange'
        };
    }

    /**
     * Returns the data
     *
     * @return {Object}
     */
    getData() {
        return this.data;
    }

    /**
     * Handler fot the HELLO_WORLD_CHANGE event
     *
     * @private
     */
    _onDataChange() {
        this.data = getRandomData();

        this.emitChanges();
    }
}

var called = 0,
    subjects = ['Isomorphism', 'React', 'Node', 'io.js', 'flux', 'React router', 'Jade', 'Stylus', 'express', 'ES2015', 'javascript'],
    adjectives = ['awesome', 'great', 'fast', 'flexible', 'the future', 'the best', 'easy', 'incredible', 'unbelievable', 'very good'];

/**
 * Return random data for the hello world
 *
 * @return {Object}
 */
function getRandomData() {
    called++;

    return {
        subject: called > 1 ? _.sample(subjects) : subjects[0],
        adjective: called > 1 ? _.sample(adjectives) : adjectives[0]
    };
}