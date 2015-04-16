import React from 'react';
import StoreMixin from 'mixins/StoreMixin.js';

/**
 * App component
 *
 * @class
 */
export default React.createClass({
    /**
     * Static members
     */
    statics: {
        storeListeners: ['HelloWorldStore']
    },

    /**
     * Mixins of the component
     */
    mixins: [StoreMixin],

    /**
     * Context types declaration, pull objects from the app context
     */
    contextTypes: {
        app: React.PropTypes.object.isRequired
    },

    /**
     * Sets the initial state of the component
     *
     * @return {Object}
     */
    getInitialState() {
        var data = this.getStore('HelloWorldStore').getData();

        return {
            subject: data.subject,
            adjective: data.adjective
        };
    },

    /**
     * Handler for when a store emits a change event
     */
    onChange(helloWorldStore) {
        var data = helloWorldStore.getData();

        this.setState({ subject: data.subject, adjective: data.adjective });
    },

    /**
     * Executed when the component has mounted
     */
    componentDidMount() {
        this._tick = setInterval(() => {
            this.context.app.executeAction('helloWorldChange');
        }, 2000);
    },

    /**
     * Executed when the component has unmounted
     */
    componentWillUnmount() {
        clearInterval(this._tick);
    },

    /**
     * Renders the component
     *
     * @return {XML}
     */
    render() {
        return (
            <div>
                <h1>Welcome to fluxone</h1>
                <h3>{this.state.subject} is {this.state.adjective}!</h3>
            </div>
        );
    }
});