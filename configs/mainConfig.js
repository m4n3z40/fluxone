'use strict';

import _ from 'lodash';

var defaultConfig = {
    /**
     * The base site title, will be pretended in all titles
     */
    baseTitle: 'fluxone app',

    /**
     * The text used to separate the segments in the page title
     */
    titleSeparator: ' | ',

    /**
     * The default language if none other is specified
     */
    defaultLang: 'en'
};

export var development = _.assign({}, defaultConfig);

export var testing = _.assign({}, defaultConfig);

export var production = _.assign({}, defaultConfig);