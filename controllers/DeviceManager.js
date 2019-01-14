var mongoose = require('mongoose');


module.exports = function () {
    var AWS = require('aws-sdk');
    var Core = require('../Core/core.js')
    var fs = require('fs');
    var FCM = require('fcm-node');
    var gcm = require('node-gcm');
    var moment = require('moment');
    var PushNotification = mongoose.model('PushNotification');
    var UserDevice = mongoose.model('UserDevice');
    var _ = require('underscore');


this.ADDDEVICE = async function(data, res) {
    console.log(data);
    var records = await UserDevice.find({ user_id: data.userid,role:data.role});
        
        if (records && records.length > 0) {
            for (var cnt = 0; cnt < records.length; cnt++) {
                var record = records[cnt];
                if (record.devices) {
                    record.devices.push({deviceid:data.deviceid , devicetype:data.devicetype});
                } else
                    record.devices = [{deviceid:data.deviceid , devicetype:data.devicetype}];
                   var addresult = await record.save();
                }
            // resCallback(res, null, { Message: "Device Updated" });
        }
        else {
            var obj = {
                user_id: data.userid,
                created_by: 'User',
                updated_by: 'User',
                role:data.role,
                devices: [{
                    deviceid:data.deviceid,
                    devicetype:data.devicetype
                }]
            }
            var newrecord = new UserDevice(obj);
            var addresult = await newrecord.save(newrecord);
        }
        if(addresult){
            return addresult
        }
   
}

this.REMOVEDEVICE = async function (data, res) {
   
   var records = await UserDevice.find({user_id:data.userid,role:data.role});
        if (records) {
            for (var cnt = 0; cnt < records.length; cnt++) {
                var record = records[cnt];
                record.devices = _.reject(record.devices, function (one) {
                    return one.deviceid == data.deviceid;
                });
                record.save();
            }
            // resCallback(res, null, { Message: "Device Updated" });
        }
        else {
           
            // resCallback(res, null, { Message: "Device Updated" });
        }
 
}
}