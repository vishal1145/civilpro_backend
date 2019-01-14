//var common = require('../helpers/common.js');
var mongoose = require('mongoose');
var GroupModifier = require('../chats/groupModifier.js');
var groupModifier = new GroupModifier();

module.exports = function () {
    //setting default value
    var Core = require('../Core/core.js')
    var fs = require('fs');
    var ObjectId = require('mongodb').ObjectId;
    var Message = common.mongoose.model('Message');

     this.CREATMESSAGE = function (body, res, resCallback) {
         var mediaobj = new Message(body.Data);
        mediaobj.save(mediaobj, function (err, logresult) {
            console.log(logresult);
            resCallback(res, null, logresult);
        });
    }



    this.GETUSERCHATGROUPS = function (body, res, resCallback) {
        //const collection1 = DBConn.collection('Groups');
        var toReturn = {
            IsUserExist: false,
            Data: null
        }
        ChatGroup.find({}, function (err, result) {
            console.log(result);
            if (err) {
                toReturn.Data = { groups: [], messages: [] };
                resCallback(res, null, toReturn);
            } else if (result.length > 0) {
                var groupsToSend = [];
                var msgGroupId = [];
                for (var groupCounter = 0; groupCounter < result.length; groupCounter++) {
                    groupsToSend.push(groupModifier.modifyGroup(body.Data.Id, result[groupCounter]));
                    msgGroupId.push(result[groupCounter]._id.toString());
                }
                //const collection = DBConn.collection('Messages');
                //  collection.find({ GroupId: { $in: msgGroupId } }).toArray(function (err, result) {
                // if (err) {
                //    toReturn.Data = { groups: groupsToSend, messages: [] }
                //     resCallback(res, null, toReturn);
                //  } else if (result.length > 0) {
                var obj = {
                    groups: groupsToSend,
                    messages: []//result
                }
                toReturn.Data = obj;
                resCallback(res, null, toReturn);
                // } else {
                //   toReturn.Data = { groups: groupsToSend, messages: [] };
                //    resCallback(res, null, toReturn);
                //  }
                // });
            } else {
                toReturn.Data = { groups: [], messages: [] };
                resCallback(res, null, toReturn);
            }
        });

    }
}