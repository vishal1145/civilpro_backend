
var common = function (config) {
    config = config;//require('../config/config.js');
    constants = require('../config/constants.js');
    helpers = require('../helper/helper.js');
    emailer = require('../helper/mail.js');
    //mail = common.config.mail();
    crypto = require('crypto');
    pbkdf2 = require('pbkdf2');
    jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    jwts = require('jwt-simple'); // used to create, sign, and verify tokens
    
    path = require("path");
    moment = require("moment");
    async = require("async");
    nodemailer = require('nodemailer')
    smtpTransport = require('nodemailer-smtp-transport');
    flash = require('connect-flash');
    validator = require('validator');
    mongoose = require('mongoose');
    passport = require('passport');
    io = require('socket.io');
}
common.mongoose = require('mongoose');
common.emailer = require('../helper/mail.js');
var Rentable = common.mongoose.model('Rentable');
var User = common.mongoose.model('User');
var RentableBooking = common.mongoose.model('RentableBooking');
var CustomError = require('../Core/custom-error');
common.getFullName = function (user) {
    var name="";
    if (user.firstname)
        name = user.firstname;
    if(user.lastname)
        name = name+" "+ user.lastname;
    return name;
}
common.replaceContent = function (content, type, sourcedata) {
    for (var p in sourcedata) {
        content = content.replace("$$" + p + "$$", sourcedata[p]);
    }
    return content;
}
common.getSubject = function (type) {

    return "Loop Account Activation Email";
}
common.SENDEMAIL = function (email, templateurl, sourcedata, type) {
    var fs = require('fs');
    fs.readFile("../artist-link/controllers"+ templateurl, function read(err, bufcontent) {
        var content = bufcontent.toString();
        //content = content.replace("$$action_url$$", generatedlink);
        content = common.replaceContent(content, type, sourcedata);
        subject = common.getSubject(type);
        var mailObject = common.emailer.GetMailObject(email, subject, content, null, null)
        console.log(mailObject);
        common.emailer.sendEmail(mailObject, function (res) {
        });
    });
}



     
    common.checkIdentities =async function(identities){    

    for(var c =0;c<identities.length;c++)            {
        if(identities[c].type === 'Rentable'){
            var isExist = await Rentable.findById(identities[c].value);
            if(!isExist)
            return new CustomError("ACC008")
        }else if(identities[c].type === 'User'){
            var isExist = await User.findById(identities[c].value);
            if(!isExist)
            return new CustomError("ACC008")
        }
        else if(identities[c].type === 'RentableBooking'){
            var isExist = await RentableBooking.findById(identities[c].value);
            if(!isExist)
            return new CustomError("ACC008")
        }
    }

    return true;
    
}

common.validateIds =async function(param){
    
    var jsons = [
        { process_id: 'RentableBooking', method_id : 'ADDBOOKING' , identities :[
            { type : 'Rentable' , prop : 'rentableid' },
            {type : 'User' , prop:'bookedby'}
        ]},
        { process_id: 'RentableBooking', method_id : 'UPDATEBOOKINGSTATUS' , identities :[
            { type : 'RentableBooking' , prop : 'Id' }
        ]},
        { process_id: 'Rentable', method_id : 'ADDRENTABLE' , identities :[
            { type : 'User' , prop : 'ownedby' }
        ]},
        { process_id: 'Rentable', method_id : 'ADDREVIEW' , identities :[
            { type : 'User' , prop : 'userid' },
            { type : 'Rentable' , prop : 'Id'}
        ]}
    ];

    for(var jcounter =0;jcounter<jsons.length;jcounter++){
        if(jsons[jcounter].process_id == param.process_id && jsons[jcounter].method_id == param.method_id){
            var identities = jsons[jcounter].identities;
            for(var idsCounter =0;idsCounter<identities.length;idsCounter++){
                identities[idsCounter].value = param.request_object[identities[idsCounter].prop];
            }
            await common.checkIdentities(identities);
        }
    }
    return true;
}

module.exports = common;
