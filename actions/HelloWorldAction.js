import Action from 'core/Action.js';
import * as helloWorldConstants from 'constants/helloWorldConstants.js';

/**
 * Action de hello world
 *
 * @class
 */
export default class HelloWordAction extends Action {
    /**
     * Return the action name
     *
     * @return {string}
     */
    get name() {
        return 'helloWorldChange';
    }

    /**
     * Executes the action
     *
     * @param {Object} payload
     * @return {Promise|void}
     */
    execute(payload) {
        this.app.emit(helloWorldConstants.HELLO_WORLD_CHANGE);
    }
}