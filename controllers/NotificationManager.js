// var common = require('../common/common.js');
var mongoose = require('mongoose');


module.exports = function () {
    var AWS = require('aws-sdk');
    var Core = require('../Core/core.js')
    var fs = require('fs');
    var FCM = require('fcm-node');
    //var ObjectId = require('mongodb').ObjectId;
    var gcm = require('node-gcm');
    // var Notification = common.mongoose.model('Notification');
    // var Link = common.mongoose.model('Links');
    var moment = require('moment');
    var PushNotification = mongoose.model('PushNotification');
    // var ErrorLog = mongoose.model('ErrorLog');
    var UserDevice = mongoose.model('UserDevice');
    var FCMPUSH = require('fcm-push');
    //this.ADDNOTOLD = function (body, res, resCallback) {

    //    const userCollection = DBConn.collection('AppUser');

    //    userCollection.find({}).forEach(function (appuser) {

    //        console.log(appuser);
    //        if (appuser.DeviceId) {

    //            var obj = {
    //                DeviceId: appuser.DeviceId,
    //                Text: body.Data.Text,
    //                Status: 'New',
    //                Count: 0
    //            }
    //            const collection = DBConn.collection('Notification');
    //            collection.insert(obj, function (err, result) {
    //                var objectId = body.Data._id;
    //                if (err) {
    //                    console.log(err);
    //                } else {
    //                    //resCallback(res, null, objectId);

    //                }
    //            });

    //        }
    //        resCallback(res, null, { Message: "Notification message added success fully" });

    //    });

    //};

    //var serverKey = 'AAAAao7_1WA:APA91bF7v5VhlHGTauInczNGDpD1DBAlublFXOj8Xn-eprO5liGhPXWdnlYkx4ANQUmpOkF3XLfI1CQ6sfiA2ybDcPq7n1SPgJX2fWdq5cSZH9Kapldd5uBkh_WsOC81dE4hmrhp6IxS';
    //var senderId = '457665664352';
    //var fcm = new FCM(serverKey);

    //this.GetNotificationObject = function (Type, Actor, RequestObject) {

    //    var notificationObj = {};

        
    //    switch (Type.toLowerCase()) {
    //        case "askedquestion":
    //            notificationObj.Title = Actor.Name;
    //            notificationObj.Body = "Post a Question";
    //            break;
    //        case "answeredquestion":
    //            notificationObj.Title = Actor.Name;
    //            notificationObj.Body = "Post an answer on the question";
    //            break;
    //        case "upvotedanswer":
    //            notificationObj.Title = Actor.Name;
    //            notificationObj.Body = "Upvote an answer on the question";
    //            break;
    //        case "likedblog":
    //            notificationObj.Title = Actor.Name + " likes a blog";
    //            break;
    //        case "commentedblog":
    //            notificationObj.Title = Actor.Name + " comments on a blog"
    //            notificationObj.Body = RequestObject.CommnetDetails.Comment;
    //            break;
    //        case "likedpost":
    //            notificationObj.Title = Actor.Name + " liked a post";
    //            notificationObj.Body = RequestObject.Question;
    //            break;
    //        case "sharedpost":
    //            notificationObj.Title = Actor.Name + " shared a post";
    //            notificationObj.Body = RequestObject.Question;
    //            break;
    //        case "commentedpost":
    //            notificationObj.Title = Actor.Name + " commented on a post";
    //            notificationObj.Body = RequestObject.Question;
    //            break;
    //        case "uploadedimage":
    //            notificationObj.Title = Actor.Name + " uploaded a image";
    //            notificationObj.Body = RequestObject.Question;
    //            break;
    //        case "uploadedvideo":
    //            notificationObj.Title = Actor.Name + " uploaded a video";
    //            notificationObj.Body = RequestObject.Question;
    //            break;
    //        case "friendrequest":
    //            notificationObj.Title = Actor.Name;
    //            notificationObj.Body = 'Wants to add you as a friend';
    //            break;
    //        case "friendrequestaction":
    //            notificationObj.Title = Actor.Name;
    //            //requestObj.Body = 'Apprrove your friend request';
    //            break;
    //    }

    //    if (RequestObject.SmallImage)
    //        notificationObj.SmallImage = RequestObject.SmallImage;
    //    else
    //        notificationObj.SmallImage = Actor.AppUserImage;

    //    if (RequestObject.LargeImage)
    //        notificationObj.LargeImage = RequestObject.LargeImage;


    //    notificationObj.NotificationType = Type;
    //    notificationObj.Actor = Actor;

    //    notificationObj.RefData = {};

    //    return notificationObj;

    //}

    //this.ADDNOT = function (NotificationType, Actor , NotifictionObject) {

    //    const collection = DBConn.collection('AppUser');
    //    collection.find({ AppUserId: Actor.AppUserId }).toArray(function (err, result) {
    //        for (var cntUser = 0; cntUser < result.length; cntUser++) {

    //            var targets = result[cntUser].Friends;

    //            var targetIds = [];
    //            for (var cntTargets = 0; cntTargets < targets.length; cntTargets++) {
    //                targetIds.push(targets[cntTargets].AppUserId)
    //            }

    //            collection.find({ "AppUserId": { $in: targetIds } }).toArray(function (err, targetList) {
    //                for (var cntTargetUser = 0; cntTargetUser < targetList.length; cntTargetUser++) {
    //                    var targetUser = targetList[cntTargetUser];
    //                    try {
    //                        if (targetUser.DeviceInfo.DeviceToken != '') {

    //                            const collectionNot = DBConn.collection('Notification');
    //                            NotifictionObject.DeviceInfo = targetUser.DeviceInfo;
    //                            NotifictionObject.Status = "New";
    //                            NotifictionObject.Count = 0;

    //                            switch (NotificationType.toLowerCase()) {
    //                                case "askedquestion":
    //                                case "answeredquestion":
    //                                case "upvotedanswer":
    //                                    if (targetUser.Settings.QnANotification.toString() == "true") {
    //                                        collectionNot.insert(NotifictionObject);
    //                                    }
    //                                    break;
    //                                case "likedblog":
    //                                case "commentedblog":
    //                                    if (targetUser.Settings.BlogNotification.toString() == "true") {
    //                                        collectionNot.insert(NotifictionObject);
    //                                    }
    //                                    break;
    //                                case "likedpost":
    //                                case "sharedpost":
    //                                case "commentedpost":
    //                                case "uploadedimage":
    //                                case "uploadedvideo":
    //                                    if (targetUser.Settings.FriendActivityNotification.toString() == "true") {
    //                                        collectionNot.insert(NotifictionObject);
    //                                    }
    //                                    break;
    //                                case "friendrequest":
    //                                case "friendapproval":
    //                                    if (targetUser.Settings.FriendRequestNotification.toString() == "true") {
    //                                        collectionNot.insert(NotifictionObject);
    //                                    }
    //                                    break;
    //                            }
    //                        }
    //                    }
    //                    catch (deviceError) {

    //                    }
    //                }
    //            });

    //        }
    //    });
    //}

    //this.ADDNOTTOTARGETUSER = function (targetIds, NotifictionObject) {

    //    const collection = DBConn.collection('AppUser');
    //    collection.find({ "AppUserId": { $in: targetIds } }).toArray(function (err, targetList) {
    //        for (var cntTargetUser = 0; cntTargetUser < targetList.length; cntTargetUser++) {
    //            var targetUser = targetList[cntTargetUser];
    //            try {
    //                if (targetUser.DeviceInfo.DeviceToken != '') {

    //                    const collectionNot = DBConn.collection('Notification');
    //                    NotifictionObject.DeviceInfo = targetUser.DeviceInfo;
    //                    NotifictionObject.Status = "New";
    //                    NotifictionObject.Count = 0;

    //                    switch (NotifictionObject.NotificationType.toLowerCase()) {
    //                        case "askedquestion":
    //                        case "answeredquestion":
    //                        case "upvotedanswer":
    //                            if (targetUser.Settings.QnANotification.toString() == "true") {
    //                                collectionNot.insert(NotifictionObject);
    //                            }
    //                            break;
    //                        case "likedblog":
    //                        case "commentedblog":
    //                            if (targetUser.Settings.BlogNotification.toString() == "true") {
    //                                collectionNot.insert(NotifictionObject);
    //                            }
    //                            break;
    //                        case "likedpost":
    //                        case "sharedpost":
    //                        case "commentedpost":
    //                        case "uploadedimage":
    //                        case "uploadedvideo":
    //                            if (targetUser.Settings.FriendActivityNotification.toString() == "true") {
    //                                collectionNot.insert(NotifictionObject);
    //                            }
    //                            break;
    //                        case "friendrequest":
    //                        case "friendrequestaction":
    //                            if (targetUser.Settings.FriendRequestNotification.toString() == "true") {
    //                                collectionNot.insert(NotifictionObject);
    //                            }
    //                            break;
    //                    }
    //                }
    //            }
    //            catch (deviceError) {

    //            }
    //        }
    //    });

    //}

    //this.ADDFEEDTOTARGETUSER = function (targetIds, FeedObject) {

    //    const collection = DBConn.collection('AppUser');
    //    collection.find({ "AppUserId": { $in: targetIds } }).toArray(function (err, targetList) {
    //        for (var cntTargetUser = 0; cntTargetUser < targetList.length; cntTargetUser++) {
    //            var targetUser = targetList[cntTargetUser];
    //            try {
    //                const collectionFeed = DBConn.collection('Feeds');
    //                FeedObject.Status = "New";
    //                FeedObject.Count = 0;
    //                collectionFeed.insert(FeedObject);
    //            }
    //            catch (deviceError) {

    //            }
    //        }
    //    });

    //}

    // var serverKey = 'AAAAk-xtLZs:APA91bFthXZrRCKbarH-QReGjx0FpaVe4pHuTA717FybSihUIqB1rgKsJc0TFy_2jl_XpvJr2SMbN8p2BwBS1p1sxrasp6m8Guku9G3LucQywavD2HqgX7Jzy_2NGAVY9otUzfAhl_Gd';
    // var senderId = '635326770587';
    var serverKey = 'AAAAunl9ciQ:APA91bHcG2LBYa_T-umfcyrhNuK1MQIhPJBm3DQzz0HmVfYF3__hhz7x9AOYFTO1_07nEn3B20iFnViNHY3ycCYtR6QXFc21acLqXYGV5pFPvQIREswxoh7NNktnPfXNXqLyrWahCy6H';
    var senderId = '800902181412';
    var fcm = new FCM(serverKey);
    var fcmPush = new FCMPUSH(serverKey);

    this.SENDNOT = async function () {
        var condition = {};
         condition = { "status": "New" };
         // condition = { "_id" : mongoose.Types.ObjectId("5c33307b4d7d4c54f11dbefb") };
      var pushnotifications = await PushNotification.find(condition); //.populate('byId')
      console.log(pushnotifications)
            // .populate({
            //     path: 'linkId',
            //     // Get friends of friends - populate the 'friends' array for every friend
            //     populate: { path: 'linkgroupid linkdebateid' }
            // })
            //.populate('targetId')
            //  .exec(function (err, pushnotifications) {
                 if (pushnotifications) {
                     for (var cnt = 0; cnt < pushnotifications.length; cnt++) {
                         var notification = pushnotifications[cnt];
                        console.log(notification);
                        //  if (!notification.type) { }
                        //  else {
                        //      if (notification.type == "CREATEGROUP" || notification.type == "CREATEDEBATE") {
                        //          { }
                        //      } else {
                        //          var data = null;
                        //          if (notification && notification.refData) {
                        //              data = notification.refData;
                        //          }
                        //          notification = common.getNOTOBJByTypeGB(notification);
                        //          if (data) {
                        //              notification.refData = data;
                        //          }
                        //      }
                        //  }
                         console.log(notification);
                         notification.status = "Lock";
                         notification.count = 1;
                        await notification.save(notification);

                         UserDevice.find({ user_id: notification.targetId }, function (err, users) {
                             var registrationTokens = [];

                             if (users && users.length > 0) {
                                 for (var cnt = 0; cnt < users.length; cnt++) {
                                     var user = users[cnt];
                                     if (user.devices) {
                                         for (var tokenidcnt = 0; tokenidcnt < user.devices.length; tokenidcnt++) {
                                             //registrationTokens.push(user.devices[tokenidcnt].deviceid);

                                             var message = {
                                                to: user.devices[tokenidcnt].deviceid, // required fill with device token or topics
                                                //collapse_key: 'your_collapse_key', 
                                                // data: {
                                                //     your_custom_data_key: 'your_custom_data_value'
                                                // },
                                                notification: {
                                                    title: notification.title,
                                                    body: notification.text
                                                }
                                            };
                                            
                                            //callback style
                                            fcmPush.send(message, function(err, response){
                                                if (err) {
                                                    console.log("Something has gone wrong!");
                                                } else {
                                                    console.log("Successfully sent with response: ", response);
                                                }
                                            });
                                         }
                                     }
                                 }
                             }

                             var tryother = false;

                             if (registrationTokens.length > 0 && tryother) {
                                 console.log(registrationTokens);                                 
                                 //var message = new gcm.Message({
                                 //    priority: 'high'                                                                       
                                 //});
                                 //message.addData("force-start", 1);
                                 //message.addData("content-available", "1");
                                 //message.addData("priority", "high");
                                 var message = new gcm.Message();
                                 message.addData('title', notification.title);
                                 message.addData('message', notification.text);
                               
                                //  if (notification.SmallImage)
                                //      message.addData('image', notification.SmallImage);
                                //  if (notification.LargeImage) {
                                //      message.addData('style', 'picture');
                                //      message.addData('picture', notification.LargeImage);
                                //      message.addData('summaryText', notification.Body);
                                //  }
                                //  else {
                                //      message.addData('style', 'inbox');
                                //      message.addData('summaryText', 'There are %n% notifications');
                                //  }

                                //  if (notification.type == "CHATMESSAGE") {
                                //      message.addData("MSGTYPE", "CHATMESSAGE");
                                //      message.addData("refData", notification.refData);
                                //  } else {
                                //      message.addData("MSGTYPE", notification.type);
                                //      if (notification.refData)
                                //          message.addData("refData", notification.refData);
                                //  }

                                 //message.addNotification('title', notification.title);
                                 //message.addNotification('body', notification.text);
                                 //message.addNotification('icon', 'ic_launcher');

                                 //if(notification.LargeImage)
                                 //  message.addData('image', notification.LargeImage);
                                 //message.addData('actions', [
                                 //{ "icon": "share", "title": "Share", "callback": "share", "foreground": true }
                                 //,{ "icon": "www/assets/images/milan.png", "title": "Cancle", "callback": "cancle", "foreground": true }
                                 //]);

                                 var sender = new gcm.Sender(serverKey);

                                 function sendMessageToUser(registrationTokens, notification, sender) {
                                     sender.send(message, { registrationTokens: registrationTokens }, async function (err, response) {
                                         if (err) {
                                             console.log("Something has gone wrong!");
                                         } else {
                                             console.log("Successfully sent with response: ", response);
                                             notification.status = "Sent";
                                             // await notification.save();
                                         }
                                     });
                                 }

                                 sendMessageToUser(registrationTokens, notification, sender);

                             }


                         });

                     }
                 }
            //  });
    }


    this.ADDNOTIFICATIONTODB = function (notObj) {
        notObj.created_at = moment.utc().format("MM/DD/YYYY HH:mm:ss A");
        notObj.updated_at = moment.utc().format("MM/DD/YYYY HH:mm:ss A");
        notObj.isRead = false;
        var NotificationObj = new Notification(notObj);
        NotificationObj.save(NotificationObj, function (err, logresult) {
            console.log(logresult);
        });
    }

    this.ADDERRORLOG = function (body, res, resCallback) {
        var errorLogObj = new ErrorLog(body.Data);
        errorLogObj1.save(errorLogObj, function (err, logresult) {
            resCallback(res, null, "ADDED");
        });
    }

    this.CREATENOTIFICATION = function (body, res, resCallback) {
        var NotificationObj = new Notification(body.Data);
        NotificationObj.save(NotificationObj, function (err, logresult) {
            console.log(logresult);
        });
    }
    //this.CREATEPUSHNOTIFICATION = function (body, res, resCallback) {
    //    var PushNotificationObj = new PushNotification(body);
    //    PushNotificationObj.save(PushNotificationObj, function (err, logresult) {
    //        console.log(logresult);
    //    });
    //}

    this.CREATEPUSHNOTIFICATION = function (notobj) {
        var PushNotificationObj = new PushNotification(notobj);
        PushNotificationObj.save(PushNotificationObj, function (err, logresult) {
            console.log(logresult);
        });
    }

    this.GETNOTIFICATION = function (body, res, resCallback) {
       
        Notification.find({ "targetId": mongoose.Types.ObjectId(body.Data.ID), "isActive": true })
            .populate('byId elinkId vlinkId' )
            .populate({
                path: 'linkId',
                // Get friends of friends - populate the 'friends' array for every friend
                populate: { path: 'linkgroupid linkdebateid' }
            })
            .exec(function (err, logresult) {
                if (logresult) {
                    var notification = [];
                    for (var i = 0; i < logresult.length; i++) {
                        if (!logresult[i].type)
                            notification.push(logresult[i]);
                        else {
                            if (logresult[i].type == "CREATEGROUP" || logresult[i].type == "CREATEDEBATE") {
                                notification.push(logresult[i]);
                            } else if (logresult[i].type == "EBOOK" || logresult[i].type == "VIDEO") {
                                notification.push(logresult[i]);
                            } else if (logresult[i].type == "ECLAP" || logresult[i].type == "VCLAP" || logresult[i].type == "EUNCLAP" || logresult[i].type == "VUNCLAP"
                                || logresult[i].type == "ECOMMENT" || logresult[i].type == "VCOMMENT") {
                                notification.push(common.getNOTOBJByTypeEV(logresult[i]));
                            }else {
                                notification.push(common.getNOTOBJByTypeGB(logresult[i]));
                            }
                        }
                    }

                    resCallback(res, null, notification);
                } else {
                    resCallback(res, null, logresult);
                }
      });

    }
	   this.GETNOTIFICATIONFORPARENTS = function (body, res, resCallback) {
       
	   
	   var ids=[];
	   for(var cnt=0;cnt<body.Data.IDS.length;cnt++){
		   ids.push(mongoose.Types.ObjectId(body.Data.IDS[cnt]))
	   }
	   
        Notification.find({ "targetId": { $in: ids}, "isActive": true })
            .populate('byId')
            .populate({
                path: 'linkId',
                // Get friends of friends - populate the 'friends' array for every friend
                populate: { path: 'linkgroupid linkdebateid' }
            })
            .exec(function (err, logresult) {
                if (logresult) {
                    var notification = [];
                    for (var i = 0; i < logresult.length; i++) {
                        notification.push(common.getNOTOBJByTypeGB(logresult[i]));
                    }

                    resCallback(res, null, notification);
                } else {
                    resCallback(res, null, logresult);
                }
      });

    }

    var fs = require('fs');
    this.SENDPASSWORDLINK = function (email) {

        //get the email id 
        var obj = {
            emailid: email,
            created_at:moment.utc().format("MM/DD/YYYY HH:mm:ss A"),
            updated_at:moment.utc().format("MM/DD/YYYY HH:mm:ss A")
        };
        // body.Data.emailid=
        var Linkobj = new Link(obj);
        Linkobj.save(Linkobj, function (err, Linkresult) {
            var generatedlink = "https://admin.dolphino.tk/pages/resetpassword/" + Linkresult._id.toString();
            
            fs.readFile(__dirname + '/templates/reset.html', function read(err, bufcontent) {
                var content = bufcontent.toString();
                content = content.replace("$$action_url$$", generatedlink);
             // email = "pankajchauhan665@gmail.com";
                var mailObject = common.emailer.GetMailObject(email, "Reset Pasword Email", content, null, null)
                common.emailer.sendEmail(mailObject, function (res) {
                    //console.log(res);
                });
            });

        });

    }
    this.SENDPASSWORDLINKSTUDENT = function (email,parentEmail) {

        //get the email id 
        var obj = {
            emailid: email,
            created_at: moment.utc().format("MM/DD/YYYY HH:mm:ss A"),
            updated_at: moment.utc().format("MM/DD/YYYY HH:mm:ss A")
        };
        // body.Data.emailid=
        var Linkobj = new Link(obj);
        Linkobj.save(Linkobj, function (err, Linkresult) {
            var generatedlink = "https://admin.dolphino.tk/pages/resetpassword/" + Linkresult._id.toString();

            fs.readFile(__dirname + '/templates/reset.html', function read(err, bufcontent) {
                var content = bufcontent.toString();
                content = content.replace("$$action_url$$", generatedlink);
                // email = "pankajchauhan665@gmail.com";
                var mailObject = common.emailer.GetMailObject(parentEmail, "Reset Pasword Email", content, null, null)
                common.emailer.sendEmail(mailObject, function (res) {
                    //console.log(res);
                });
            });

        });

    }
    this.SENDMESSAGE = function (number, text) {
        console.log("in sms funection");
        AWS.config.region = 'us-west-2';
        AWS.config.update({
            accessKeyId: "AKIAJFTJVTD6OL7MJBJQ",
            secretAccessKey: "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",
        });
        //AWS.config.update({
        //    accessKeyId: "AKIAJITRY62ADMCJJRVQ",
        //    secretAccessKey: "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",
        //});
        console.log("after funection");
        var sns = new AWS.SNS();
        var params = {
            Message: text,
            MessageStructure: "",
            PhoneNumber: number,
            Subject: 'your subject'
        };
        console.log("before funection");
        //sns.publish(params, function (err, data) {
        //    if (err) console.log(err, err.stack); // an error occurred
        //    else {
        //        console.log(data);
        //    }
        //});

    }

    //this.SENDMESSAGE = function (number,text,image) {
    //    var Bynumber = '8582951487';
    //    // Twilio Credentials
    //    const accountSid = 'AC888ec274fb35d16e5a2eff44b6018fdd';
    //    const authToken = 'c6b3da4e1e3709fe9b89738fe95890ba';
    //    // require the Twilio module and create a REST client
    //    const client = require('twilio')(accountSid, authToken);
    //    var messageobj = {};
    //    if (image) {
    //        messageobj = {
    //            to: number,
    //            from: Bynumber,
    //            body: text,
    //            mediaUrl: image,
    //        }
    //    } else {
    //        messageobj = {
    //            to: number,
    //            from: Bynumber,
    //            body: text,

    //        }
    //    }
    //    client.messages
    //        .create(messageobj)
    //        .then((message) =>
    //            console.log(message)
    //        ).catch((messagerrere) =>
    //            console.log(messagerrere)
    //        );

    //}


    this.READNOTIFICATION = function (body, res, resCallback) {
        // if (body.Data) {
        //     var unReadNotification = _.filter(body.Data, function (notif) { return body.Data.isRead == false });
        //     for (var i = 0; i <= this.unReadNotification.length; i++) {
        //         this.unReadNotification[i].isRead = true;

        //     }
        //    }
        ////var NotificationObj = new Notification(body.Data);
        //// NotificationObj.save(NotificationObj, function (err, logresult) {
        ////     console.log(logresult);
        //// });

        var toadd = [];
        for (var ccon = 0; ccon < body.Data.notificationIds.length; ccon++) {

            toadd.push(mongoose.Types.ObjectId(body.Data.notificationIds[ccon]));
        }

        Notification.find({ _id: { $in: toadd } }, function (err, result) {
            if (result && result.length > 0) {
                for (var groupCounter = 0; groupCounter < result.length; groupCounter++) {
                    var notobj = result[groupCounter];
                    notobj.isRead = true;
                    notobj.save(notobj)
                }
            }
            resCallback(res, null, { MSG: "Update success" });
        });
    }
    this.READNOTIFICATIONBYID = function (body, res, resCallback) {
        //var toadd = [];
        //for (var ccon = 0; ccon < body.Data.notificationIds.length; ccon++) {

        //    toadd.push(mongoose.Types.ObjectId(body.Data.notificationIds[ccon]));
        //}

        Notification.findById(body.Data.ID, function (err, result) {
            if (result) {
               // for (var groupCounter = 0; groupCounter < result.length; groupCounter++) {
                  //  var notobj = result[groupCounter];
                result.isRead = true;
                result.save();
               // }
            }
            resCallback(res, null, { MSG: "Update success" });
        });
    }

    // this.FORGATEPASSWORD = function (body, res, resCallback) {
    //     this.SENDPASSWORDLINK(body.Data.Email);
    //     resCallback(res, null, { MSG: "success" });
    // }


    this.CLEARNOTIFICATION = function (body, res, resCallback) {
        var toadd = [];
        for (var ccon = 0; ccon < body.Data.notificationIds.length; ccon++) {
            toadd.push(mongoose.Types.ObjectId(body.Data.notificationIds[ccon]));
        }

        Notification.find({ _id: { $in: toadd } }, function (err, result) {
            if (result && result.length > 0) {
                for (var groupCounter = 0; groupCounter < result.length; groupCounter++) {
                    var notobj = result[groupCounter];
                    notobj.isActive = false;
                    notobj.save(notobj)
                }
            }
            resCallback(res, null, { MSG: "Clear success" });
        });
    }


}

