configs = require('./dev.config.js');

module.exports = {
    getConfigValueByKey: function(key){
        return configs[key];
    }
}







