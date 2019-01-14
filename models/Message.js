
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var MessageSchema = new mongoose.Schema({
    
    GroupId: String,
    SenderId: String,
    TextMessage: String,
    ImageUrl: String,
    VideoUrl: String,
    SendTime: String, //{ type: Date, default: Date.now },
  
    CreatedBy: String,
    ModifiedBy: String,
    CreatedOn: String,//{ type: Date, default: Date.now },
    ModifiedOn: String,//{ type: Date, default: Date.now },
    MediaType: String,
    ClientMessageId: String,
    ReadStatus: Boolean,
    BlurURL: String,
    PushStatus: { type: String, default: "ServerRecieved"},
    deleveryStatus: { type: String, default: "New" },
    ReadBy: [
        {
            userid: String,
            time: String//{ type: Date, default: Date.now }
        }
    ],
    DeleverTo: [
        {
            userid: String,
            time: String//{ type: Date, default: Date.now }
        }
    ],
    isMedia: Boolean,
    isnotification: Boolean,

    created_at: String,// { type: Date, default: Date.now },
    updated_at: String,//{ type: Date, default: Date.now },
    created_by: String,
    updated_by: String,
    active: { type: Number, default: 1 },
    
});

module.exports = mongoose.model('Message', MessageSchema);

