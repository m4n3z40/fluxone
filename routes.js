import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import RootComponent from 'components/RootComponent.js';
import AppComponent from 'components/AppComponent.js';

export default function getRoutes() {
    return (
        <Route name="app" path="/" handler={RootComponent}>
            <DefaultRoute handler={AppComponent} />
        </Route>
    );
};