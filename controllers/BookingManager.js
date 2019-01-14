var common = require('../helper/common.js');
var mongoose = require('mongoose');



module.exports = function () {
    //setting default value
    var Core = require('../Core/core.js')
    var fs = require('fs');
    var ObjectId = require('mongodb').ObjectId;
    var Rentable = common.mongoose.model('Rentable');
    var User = common.mongoose.model('User');
    var RentableBooking = common.mongoose.model('RentableBooking');
    var CustomError = require('../core/custom-error');
    function generatePassword(val) {
        var d = new Date().getTime();
        var stringgen;
        if (val == '1') {
            stringgen = 'xxxxxx';
        } else if (val == '2') {
            stringgen = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx';
        } else if (val == '3') {
            stringgen = 'xxxxxxxx';
        }
        var uuid = stringgen.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    async function getCollection(bookedby) {
        var getUser = await User.findById(bookedby);
        var getRentable = await Rentable.findById(rentabeid);
        if (getUser && getRentable) {

        }
    }




    this.ADDBOOKING = async function (data, options) {
        var email =[]
        var action_url = generatePassword('1');
        var userresult = await User.findById(data.bookedby)
        email.push(userresult.email);
        var rentableresult = await Rentable.findById(data.rentableid).populate('owner_id')
        email.push(rentableresult.owner_id.email);
        var addbooking = new RentableBooking(data);
        let addresult = await addbooking.save();
        if (addresult) {
           
            await common.SENDEMAIL(email[0], '/templates/bookedby.html', { action_url: action_url }, '');
            await common.SENDEMAIL(email[1], '/templates/bookedto.html', { bookedby: data.bookedby }, '');
            
            return addresult;
        }
        else {
            throw new CustomError("PRE002");
        }
    }

    this.UPDATEBOOKINGSTATUS = async function (data, options) {
        var action_url = generatePassword('1');
        var updateresult = await RentableBooking.findByIdAndUpdate(data.Id, {
            $set: {
                bookingstatus: data.bookingstatus
            }
        },
            {
                new: true
            });
        if (updateresult) {
            await common.SENDEMAIL(userresult.email, '/templates/reset.html', { action_url: action_url }, '');
            return updateresult
        }
        else {
            throw new CustomError("PRE002")
        }
    }


    this.GETBOOKINGBYID = async function (data, options) {
        var bookingresult = await RentableBooking.findById(data.Id).populate('rentableid bookedby');
        if (bookingresult) {
            return bookingresult
        }
        else {
            return {};
        }
    }

    this.GETBOOKING = async function (data, options) {
        var bookingresult = await RentableBooking.find().populate('rentableid bookedby');
        if (bookingresult) {
            return bookingresult
        }
        else {
            return [];
        }
    }

    this.GETBOOKINGBYUSERID = async function (data, options) {
        var bookingresult = await RentableBooking.find({ "bookedby": data.bookedby }).populate('rentableid bookedby');
        if (bookingresult) {
            return bookingresult
        }
        else {
            return [];
        }
    }
}