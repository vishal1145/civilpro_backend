var mongoose = require('mongoose');
var RentableSchema = new mongoose.Schema({
    title:String,
    description:String,
    type:{
        type:String,
        enum:['Apartment','Equipment'],
        default:String
    },
    latitude:String,
    longitude:String,
    price:Number,
    bed:Number,
    image:String,
    amenities:[{
        type:String
    }],
    reviews:[
        {
            userid:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
            star:Number,
            comment:String,
            created_at: { type: Date, default: Date.now }
        }
    ],
    owner_id:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'New' }
    
});

mongoose.model('Rentable', RentableSchema);

