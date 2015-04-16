'use strict';

require('babel/register');

var env = process.env.NODE_ENV;

var serverConfig = require('configs/es5/server.js')[env];

//Instantiates and Bootstraps server
var server = require('bootstrap-server.js')({}, {} , env);

//Start the server
server.listen(serverConfig.port, serverConfig.address, function() {
    console.log('Started server at http://%s:%s', serverConfig.host, serverConfig.port);
});
