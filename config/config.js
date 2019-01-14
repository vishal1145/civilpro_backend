let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = 8100;

module.exports = CONFIG;