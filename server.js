'use strict';

require('babel/register');

var serverConfig = require('configs/es5/server.js')[process.env.NODE_ENV];

//Instantiates and Bootstraps server
var server = require('bootstrap-server.js');

//Start the server
server.listen(serverConfig.port, serverConfig.address, function() {
    console.log('Started server at http://%s:%s', serverConfig.host, serverConfig.port);
});
