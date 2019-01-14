var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserDeviceSchema = new mongoose.Schema({
    userid: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String,
    active: { type: Number, default: 1 },
    role:{ type:String, default:"Employee"},
    devices:[{
        deviceid : String,
        devicetype : String
    }],
    user_id: String,
});

mongoose.model('UserDevice', UserDeviceSchema);
