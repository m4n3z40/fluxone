import React from 'react';
import { RouteHandler } from 'react-router';
import Application from 'core/Application.js';

/**
 * Root component
 *
 * @class
 */
export default class RootComponent extends React.Component {
    /**
     * Returns the context objects available to the children
     * To receive the object the given child must declare which one in the 'contextTypes' attribute
     *
     * @return {Object}
     */
    getChildContext() {
        return {
            app: this.props.app
        };
    }

    /**
     * Renders the component
     *
     * @return {XML}
     */
    render() {
        return (
            <div>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

var types = React.PropTypes;

/**
 * Properties types declaration
 *
 * @type {Object}
 */
RootComponent.propTypes = {
    app: types.instanceOf(Application).isRequired
};

/**
 * Child context types declarations
 *
 * @type {Object}
 */
RootComponent.childContextTypes = {
    app: types.instanceOf(Application).isRequired
};