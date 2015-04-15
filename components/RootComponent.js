import React from 'react';
import { RouteHandler } from 'react-router';
import Application from 'core/Application.js';

export default class RootComponent extends React.Component {
    getChildContext() {
        return {
            app: this.props.app
        };
    }

    render() {
        return (
            <RouteHandler {...this.props} />
        );
    }
}

RootComponent.propTypes = {
    app: React.PropTypes.instanceOf(Application).isRequired
};

RootComponent.childContextTypes = {
    app: React.PropTypes.instanceOf(Application).isRequired
};