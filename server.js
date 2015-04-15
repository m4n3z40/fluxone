require('babel/register');

var bootstrapServer = require('bootstrap-server.js');

//Start the server
var server = bootstrapServer().listen(3000, '127.0.0.1', function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started server at http://%s:%s', host, port);
});
