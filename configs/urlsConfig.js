'use strict';

import _ from 'lodash';

var defaultConfig = {};

export var development = _.assign({}, defaultConfig);

export var testing = _.assign({}, defaultConfig);

export var production = _.assign({}, defaultConfig);