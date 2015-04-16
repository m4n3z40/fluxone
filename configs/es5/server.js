module.exports = {
    development: {
        host: 'localhost',
        address: '127.0.0.1',
        port: process.env.PORT || 3000
    },
    production: {
        host: 'localhost',
        address: '127.0.0.1',
        port: process.env.PORT || 80
    }
};

module.exports.testing = module.exports.development;