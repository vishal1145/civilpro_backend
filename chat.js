var mongoose = require('mongoose');
var _ = require('underscore');
var NotificationManager = require('./controllers/NotificationManager');
module.exports = function (app, server) {

    require('./models/Message.js');
    require('./models/ChatGroup.js');

    app.get('/chat-test-page', function (req, res) {
        console.log("hrer");
        res.sendFile(__dirname + '/text.html');
    });


    var User = require('./models/User');
    var host = '104.248.30.138';

    app.get('/dummyData', async function (req, res, ) {


        var users = [
            {
                "email": "user1@gmail.com",
                "password": "user1",
                "first_name": "user1",
                "last_name": "test"

            },
            {
                "email": "user2@gmail.com",
                "password": "user2",
                "first_name": "user2",
                "last_name": "test"

            },
            {
                "email": "user3@gmail.com",
                "password": "user3",
                "first_name": "user3",
                "last_name": "test"

            },
            {
                "email": "user4@gmail.com",
                "password": "user4",
                "first_name": "user4",
                "last_name": "test"

            }
        ]

        let addedUsers = await User.insertMany(users);

        var restThress = [addedUsers[1], addedUsers[2], addedUsers[3]]

        var grp1 = {
            "GroupInfo": {
                "GroupName": "test",
                "OwnerId": addedUsers[0]._id.toString(),
                "ProfileURLOfGroup": "firstgroup", // strinhg 
            },

            "Admin": [{ MemberId: addedUsers[0]._id }],
            "Members": [

                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f6",
                    "MemberName": "user1",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_VjbGp2l31iTl9SdlLt9r7azIsHq7-LlKqFGAijVK3qdOFiml",
                },

                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f7",
                    "MemberName": "user2",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLb5mOUtzV0ObqBVuAURSvPAsC27148aFdKGc6e6Z_Z78vmMWf",
                },
                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f8",
                    "MemberName": "user3",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnj79hGArvvKgp5nkDA1KaH8aH6KB5urIb70PuhQMvM4CUS2kK",
                },
                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f9",
                    "MemberName": "user4",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1L6OAsULMeMRM8quccws05c-Cr4fqF_A35R2QikvbD-bY4_61",
                }
            ],
        }

        var firstUser1 = addedUsers[0];
        var seconfUser2 = addedUsers[1];

        var grp2 = {
            "GroupInfo": {
                "GroupName": "test2",
                "OwnerId": addedUsers[0]._id.toString(),
                "ProfileURLOfGroup": "secondgroup", // strinhg 
            },
            "Admin": [{ MemberId: addedUsers[0]._id }],
            "Members": [

                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f6",
                    "MemberName": "user1",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_VjbGp2l31iTl9SdlLt9r7azIsHq7-LlKqFGAijVK3qdOFiml",
                },

                {
                    "MemberId": "5bf65be2cbfdb41abc8c85f7",
                    "MemberName": "user2",
                    "MemberImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLb5mOUtzV0ObqBVuAURSvPAsC27148aFdKGc6e6Z_Z78vmMWf",
                }
            ],
        }


        let addedChatGroups = await ChatGroup.insertMany([grp1, grp2]);



    })
     

    function getSingleEmployeeData(id) {

        return new Promise((resolve, reject) => {
            var request = require('request');
            request('http://'+host+'/civilpro/rest_api/v1/index.php/EmployeeList?emp_id=' + id, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                resolve(body);
            });
        });

    }


    function getProjectData(id) {

        return new Promise((resolve, reject) => {
            var request = require('request');
            request('http://'+host+'/civilpro/rest_api/v1/index.php/ProjectList?emp_id=' + id, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                resolve(body);
            });
        });

    }

    app.get('/api/employee/:id', async function (req, res) {
        var apimembers = await getSingleEmployeeData(req.params.id);
        var memberesult = JSON.parse(apimembers);
        var group = {
            GroupInfo: {
                GroupName: "",
                OwnerId: "",
                GroupType: 1,
            },
            Members: [],
        }
        for (var i = 0; i < memberesult.length; i++) {
            var username = memberesult[i].first_name + " " + memberesult[i].last_name;
            if (memberesult[i].image) {
                member_image = memberesult[i].image
            }
            else {
                member_image = "http://"+host+"/civilpro/assets/img/logo2.png"
            }
            var member = {
                MemberId: memberesult[i].empl_id,
                MemberName: username,
                MemberImage: member_image,
                MemberDOB: memberesult[i].joining_date,
                MemberEmail: memberesult[i].email,
                MemberPhone: memberesult[i].phone,
                Role: "employee",
            }
            group.Members.push(member);
        }
        var addchatgroups = new ChatGroup(group);
        let addresult = await addchatgroups.save();
        //group type one 
        res.send(req.params.id);
    });

    app.get('/api/project/:id', async function (req, res) {
        var apimembers = await getProjectData(req.params.id);
        var memberesult = JSON.parse(apimembers);
        var group = {
            GroupInfo: {
                GroupName: memberesult[0].project_name,
                OwnerId: "",
                GroupType: 2,
            },
            Members: [],
        }
        for (var i = 0; i < memberesult.length; i++) {
            var username = memberesult[i].first_name + " " + memberesult[i].last_name;
            if (memberesult[i].image) {
                member_image = memberesult[i].image
            }
            else {
                member_image = "http://"+host+"/civilpro/assets/img/logo2.png"
            }
            var member = {
                MemberId: memberesult[i].empl_id,
                MemberName: username,
                MemberImage: member_image,
                MemberDOB: memberesult[i].joining_date,
                MemberEmail: memberesult[i].email,
                MemberPhone: memberesult[i].phone,
                Role: "employee",
            }
            group.Members.push(member);
        }
        var addchatgroups = new ChatGroup(group);
        let addresult = await addchatgroups.save();
        res.send(req.params.id);
    });


    app.get('/GETUSERCHATGROUPS/:userId', async function (req, res) {
        var ChatGroupManager = require('./controllers/chatGroupManager.js');
        var chatmethods = new ChatGroupManager();
        let tosends = await chatmethods.GETUSERCHATGROUPS({ Data: { Id: req.params.userId } })
        res.send(tosends);
    });

    var common = require('./helper/common');
    var broadCst = require('./chats/broadCaster.js');
    var caster = new broadCst();
    var GroupModifier = require('./chats/groupModifier.js');
    var groupModifier = new GroupModifier();
    var MessageManager = require('./chats/messageManager.js');
    var messageManager = new MessageManager();
    var Message = mongoose.model('Message');
    var ChatGroup = mongoose.model('ChatGroup');
    var User = mongoose.model('User')
    var socketio = require('socket.io').listen(server);
    console.log("after socket.io")
    socketio.on('connection', function (socket) {
        console.log("socket details");

        socket.on('connectUser', function (msg) {
            console.log('userconnection Received: ', msg);
            caster.AddUserSocketTOCache(msg.UserId, socket);
            ChatGroup.find({ "Members.MemberId": msg.UserId }, function (err, result) {
                if (err) {
                    console.log(err);

                } else if (result.length > 0) {
                    for (var groupCounter = 0; groupCounter < result.length; groupCounter++) {
                        groupModifier.getGroup(result[groupCounter]._id.toString()).then(function (group) {
                            var messageToBroadCast = {
                                memberId: msg.UserId,
                                isonline: true,
                                groupId: group._id
                            };
                            caster.sentToClient(msg.UserId, group, messageToBroadCast, 'onUSerConnectionStatusChange');
                        });
                    }
                }

            });
        });
        socket.on('textMessage', function (msg) { //groupId, senderId, msgText, clientMessageId) {
            console.log('Message Received: ', groupId + senderId + msgText + clientMessageId);
            var groupId = msg.GroupId;
            var senderId = msg.SenderId;
            var msgText = msg.MsgText;
            var clientMessageId = msg.ClientMessageId;
            var isNotification = msg.isNotification;
            try {
                groupModifier.getGroup(groupId).then(function (group) {
                    var messageInfo = messageManager.defaultMessageObject(groupId, senderId, msgText, clientMessageId, false, isNotification)
                    var messageToBroadCast = {
                        messageInfo: messageInfo
                    };

                    var message = new Message(messageInfo);
                    message.save(message, function (err, logresult) {
                        if (err) {
                            console.log("Error in adding user");
                        }
                        else {
                            //messageInfo._id = docsInserted;
                            var messageToBroadCast = {
                                messageInfo: logresult
                            };
                            console.log('Insert Successfully..')
                            caster.sentToClient(senderId, group, messageToBroadCast, 'onTextMessage');
                            caster.sentToSelf(senderId, group, messageToBroadCast, 'selfTextMessage', socket.id);
                            caster.sentToDevice(senderId, group, messageToBroadCast, 'deviceTextMessage', socket.id);
                            console.log(group);

                            console.log("adding push message");


                            var senderuser = _.find(group.Members, function (num) {
                                return num.MemberId === senderId;
                            });

                            for (var mcounter = 0; mcounter < group.Members.length; mcounter++) {

                                var targetmemberid = group.Members[mcounter].MemberId;
                                if (targetmemberid === senderId)
                                    continue;

                                var targetuser = _.find(group.Members, function (num) {
                                    return num.MemberId === targetmemberid;
                                });
                                try {
                                    var notifObj = {
                                        targetId: targetuser.MemberId,
                                        title: senderuser.MemberName + " sent you a message",
                                        text: msg.MsgText,
                                        image: senderuser.MemberImage,
                                        type: 'CHATMESSAGE',
                                        //linkId: mongoose.Types.ObjectId(senderuser.MemberId),
                                        //byId: mongoose.Types.ObjectId(senderuser.MemberId),
                                        isRead: false,
                                        refData: {
                                            GroupId: groupId
                                        }
                                    }
                                    var notManager = new NotificationManager();
                                    notManager.CREATEPUSHNOTIFICATION(notifObj);

                                } catch (err) { }
                            }

                            socket.emit('onTextMessageRecieved', logresult);
                            return logresult;

                        }
                    });

                });
            } catch (err) {

                console.log("fugajgjgfajfjgsa");
            }
        });

        socket.on('typing', function (msg) {

            var groupId = msg.GroupId;
            var senderId = msg.SenderId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {
                    GroupId: groupId,
                    SenderId: senderId
                };
                caster.sentToClient(senderId, group, messageToBroadCast, 'onTyping');
                caster.sentToSelf(senderId, group, messageToBroadCast, 'selfTyping', socket.id);
            });
        });

        socket.on('stopTyping', function (msg) {
            var groupId = msg.GroupId;
            var senderId = msg.SenderId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {
                    GroupId: groupId,
                    SenderId: senderId
                };
                caster.sentToClient(senderId, group, messageToBroadCast, 'onStopTyping');
                caster.sentToSelf(senderId, group, messageToBroadCast, 'selfStopTyping', socket.id);
            });
        });

        socket.on('mediaMessage', function (msg) { //groupId, senderId, msgText, clientMessageId) {
            console.log('Message Received: ', groupId + senderId + msgText + clientMessageId, taggedmessge);
            var groupId = msg.GroupId;
            var senderId = msg.SenderId;
            var msgText = msg.MsgText;
            var clientMessageId = msg.ClientMessageId;
            var taggedmessge = msg.TaggedMessge;
            var mediaMessage = msg.MediaType;
            var videoMessage = msg.VideoImage;

            try {
                groupModifier.getGroup(groupId).then(function (group) {
                    var messageInfo = messageManager.defaultMessageObject(groupId, senderId, msgText, clientMessageId, true, false, mediaMessage)
                    messageInfo.TaggedMessge = taggedmessge;
                    if (mediaMessage == "2") {
                        messageInfo.VideoUrl = videoMessage;
                    }
                    var messageToBroadCast = {
                        messageInfo: messageInfo
                    };

                    // const collection1 = DBConn.collection('Messages');
                    var message = new Message(messageInfo);
                    message.save(message, function (err, logresult) {
                        //  Message.insert(messageInfo, (err, docsInserted) => {
                        if (err) {
                            console.log("Error in adding user");
                        }
                        else {
                            //messageInfo._id = docsInserted;
                            var messageToBroadCast = {
                                messageInfo: messageInfo
                            };
                            console.log('Insert Successfully..')

                            caster.sentToClient(senderId, group, messageToBroadCast, 'onMediaMessage');
                            caster.sentToSelf(senderId, group, messageToBroadCast, 'selfMediaMessage', socket.id);


                            var senderuser = _.find(group.Members, function (num) {
                                return num.MemberId === senderId;
                            });

                            for (var mcounter = 0; mcounter < group.Members.length; mcounter++) {

                                var targetmemberid = group.Members[mcounter].MemberId;
                                if (targetmemberid === senderId)
                                    continue;

                                var targetuser = _.find(group.Members, function (num) {
                                    return num.MemberId === targetmemberid;
                                });
                                try {
                                    // var notifObj = {
                                    //     targetId: targetuser.MemberId,
                                    //     title: senderuser.MemberName + " sent you a message",
                                    //     text: msg.MsgText,
                                    //     image: senderuser.MemberImage,
                                    //     type: 'CHATMESSAGE',
                                    //     //linkId: mongoose.Types.ObjectId(senderuser.MemberId),
                                    //     //byId: mongoose.Types.ObjectId(senderuser.MemberId),
                                    //     isRead: false,
                                    //     refData: {
                                    //         GroupId: groupId
                                    //     }
                                    // }

                                    var notifObj = {
                                        targetId: targetuser.MemberId,
                                        title: senderuser.MemberName + " sent you a message",
                                        text: msg.MsgText,
                                        image: senderuser.MemberImage,
                                        type: 'CHATMESSAGE',
                                        //linkId: mongoose.Types.ObjectId(senderuser.MemberId),
                                        //byId: mongoose.Types.ObjectId(senderuser.MemberId),
                                        isRead: false,
                                        refData: {
                                            GroupId: groupId
                                        }
                                    }

                                    var notManager = new NotificationManager();
                                    notManager.CREATEPUSHNOTIFICATION(notifObj);

                                } catch (err) { }
                            }



                            console.log("adding push message");
                            
                        }
                    });
                    try {
                        var membids = [];
                        for (var memb = 0; memb < group.Members.length; memb++) {
                            membids.push(mongoose.Types.ObjectId(group.Members[memb].MemberId));
                        }
                        //updatd ht \emedi to group object
                        var mediaobj = {
                            url: msgText,
                            type: mediaMessage,
                            linkedid: groupId,
                            linkedtype: 'GROUP',
                            targetids: membids,

                            created_by: moment.utc().format("MM/DD/YYYY HH:mm:ss A"),
                            updated_by: moment.utc().format("MM/DD/YYYY HH:mm:ss A"),
                            // MediaType: mediaMessage, url: msgText, memberId: senderId, groupId: groupId, linkedmessageid: clientMessageId
                        };
                        //const collection = DBConn.collection('Groups');
                        //collection.update({ "_id": ObjectId(groupId) }, { $push: { "Medias": mediaobj } }, function (err, result) {


                        var MedManager = new MediaManager();
                        MedManager.SAVEMEDIA(mediaobj);
                    } catch (err) { }

                });
            } catch (err) { }
        });

        socket.on('readNotification', function (msg) {
            var groupId = msg.GroupId;
            var senderId = msg.SenderId;
            // var recieverId = msg.ReciverId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {
                    readby: senderId
                };

                //  const collection = DBConn.collection('Messages');
                Message.update({ "GroupId": groupId }, { $set: { "deleveryStatus": "Read" } }, { multi: true }, function (err, result) {

                    if (err) {
                        console.log(err);
                    }
                    else {
                        Message.update({ "GroupId": groupId, "ReadBy.userid": { $ne: senderId } }, { $push: { ReadBy: { userid: senderId, time: Date() } } }, { multi: true }, function (err, result) {
                            // collection.update({"_id":ObjectId(body.Data.memberid),"contacts.linkedmobile":body.Data.id.number }, { $set: { "contacts.$.status": 'connected'} }, function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("fdggfsd");
                            }
                        });
                        console.log('update msg successfully');
                    }

                });

                caster.sentToClient(senderId, group, messageToBroadCast, 'onReadNotification');
                caster.sentToSelf(senderId, group, messageToBroadCast, 'selfReadNotification', socket.id);
            });
        });

        socket.on('createGroup', async function (msg) {

            var members = msg.Members; //id of members
            //find members fron users coletion
            var Members = []
            var userResult = await User.find({ _id: { $in: members } });
            console.log(userResult)
            for (var count = 0; count < userResult.length; count++) {
                Members.push({
                    MemberId: userResult[count]._id,
                    MemberName: userResult[count].name,
                    MemberImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9EgDaEMwUgjlPlPi6G66dR7SyFsh2M6eEDYrHpByJxINpp7Nj9A",
                })
            }
            var grp = {
                GroupInfo: {
                    GroupName: msg.GroupName,
                    OwnerId: msg.SenderId,
                    ProfileURLOfGroup: msg.ProfileURLOfGroup,
                },
                Admin: [{ MemberId: msg.SenderId }]
            }
            grp.Members = grp.Members || []
            grp.Members = Members
            console.log(grp)

            //save to database 
            //get the group id 
            //get the admin id 
            var newChatGroups = new ChatGroup(grp);
            var chatGroupResult = await newChatGroups.save()


            var groupId = chatGroupResult._id; //created group id 

            var senderId = msg.SenderId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {};
                caster.sentToClient(senderId, group, messageToBroadCast, 'oncreateGroup');
                //caster.sentToSelf(senderId, group, messageToBroadCast, 'selfStopTyping', socket.id);
            });
        });

        socket.on('addMemberToGroup', async function (msg) {

            var members = msg.Members; //id of members
            //find members fron users coletion
            var Members = []
            var userResult = await User.find({ _id: { $in: members } });

            console.log(userResult)
            for (var count = 0; count < userResult.length; count++) {
                Members.push({
                    MemberId: userResult[count]._id,
                    MemberName: userResult[count].name,
                    MemberImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9EgDaEMwUgjlPlPi6G66dR7SyFsh2M6eEDYrHpByJxINpp7Nj9A",
                })
            }

            for (var i = 0; i < Members.length; i++) {
                var findchatgroup = await ChatGroup.findByIdAndUpdate(msg.GroupId, {
                    $push: {
                        "Members": Members[i]
                    }
                }, {
                        new: true
                    }

                );
            }

            var groupId = msg.GroupId; //created group id 

            var senderId = msg.SenderId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {};
                caster.sentToClient(senderId, group, messageToBroadCast, 'onaddMember');
                //caster.sentToSelf(senderId, group, messageToBroadCast, 'selfStopTyping', socket.id);
            });
        });
        socket.on('deleteMemberFromGroup', async function (msg) {

            var members = msg.Members; //id of members
            //find members fron users coletion
            // var Members = []
            // var userResult = await User.find({ _id: { $in: members } });

            // console.log(userResult)
            // for (var count = 0; count < userResult.length; count++) {
            //     Members.push({
            //         MemberId: userResult[count]._id,
            //         MemberName: userResult[count].name,
            //         MemberImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9EgDaEMwUgjlPlPi6G66dR7SyFsh2M6eEDYrHpByJxINpp7Nj9A",
            //     })
            // }

            for (var i = 0; i < members.length; i++) {
                var findchatgroup = await ChatGroup.findByIdAndUpdate(msg.GroupId, {

                    $pull: {
                        "Members": {
                            MemberId: members[i]
                        }

                    }
                },
                    {
                        //new: true
                        new: true
                    }

                );
                console.log(findchatgroup)
            }

            var groupId = msg.GroupId; //created group id 

            var senderId = msg.SenderId;
            groupModifier.getGroup(groupId).then(function (group) {
                var messageToBroadCast = {};
                caster.sentToClient(senderId, group, messageToBroadCast, 'ondeleteMember');
                //caster.sentToSelf(senderId, group, messageToBroadCast, 'selfStopTyping', socket.id);
            });
        });
    });






    var configManager = require('./config/configManager.js');
    var chatport = configManager.getConfigValueByKey('chatport');
    server.listen(chatport, function () {
        console.log('Chat Listening at port: ' + chatport);
    });

}