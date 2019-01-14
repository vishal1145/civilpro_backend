var mongoose = require('mongoose');


var ChatGroupSchema = new mongoose.Schema({
    GroupInfo: {
        GroupName: String,
        OwnerId: String,
        IsActive: { type: Number, default: 1 },
         GroupType: { type: String, default: "2" },
         ProfileURLOfGroup: String,
         Role:String,
         DOB:String,
         Email:String,
         Phone:String
    },
    Admin: [{ MemberId: String }],
    Members: [{
        MemberId: String,
        MemberName: String,
        MemberImage: String,
        MemberDOB : String,
        MemberEmail : String,
        MemberPhone :String, 
        IsActive: { type: Number, default: 1 },
        StatusText: { type: String, default: "Online" },
        UserStatus: { type: String, default: "Online" },
        //  linkednumber: String,
          Role:String,
        isMute: { type: Boolean, default: "false" },
        isjoined: { type: Boolean, default: "true" },
        status: { type: String, default: "INVITE" }
    }],
  
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String,
    active: { type: Number, default: 1 },
    
});

mongoose.model('ChatGroup', ChatGroupSchema);

