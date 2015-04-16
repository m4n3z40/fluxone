'use strict';

import bootstrapApplication from 'bootstrap-application.js';

//Instantiates and configures the application
Object.defineProperty(window, 'fluxone', {
    value: bootstrapApplication({}, {}, process.env.NODE_ENV),
    configurable: true
});

let app = window.fluxone;

//Restoring application state
app.restoreState(window.__serverState);

//Render the application on the client side
app.renderClient(document.getElementById('fluxoneRoot'), {app: app});