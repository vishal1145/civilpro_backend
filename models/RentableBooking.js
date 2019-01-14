var mongoose = require('mongoose');


var RentableBookingSchema = new mongoose.Schema({
    rentableid: { type: mongoose.Schema.Types.ObjectId,  ref:'Rentable'},
    tax:String,
    deliverycharge:Number,
    startdate :{type:Date},
    enddate:{type:Date},
    bookingstatus :{type:String,default:'New'},
    paymentstatus:{type:String,default:'unpaid'},
    bookedby:{ type: mongoose.Schema.Types.ObjectId,  ref:'User'},
    CreatedTime: { type: Date, default: Date.now },
 
});

mongoose.model('RentableBooking', RentableBookingSchema);