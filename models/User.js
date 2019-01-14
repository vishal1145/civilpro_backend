var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);
var newSchema = new Schema({
  'email': { type: String },  
  'password' : { type: String },
  'linkedin_id' : { type: String },
  'facebook_id' : { type: String },
  'gmail_id' : { type: String },
  'profile_flag' : { type: Boolean,default: false },
  'otp' : { type: Number },
  'verification_status': { type: Boolean,default: false },
  'ios_device_id': { type: Array, default: [] },
  'android_device_id': { type: Array, default: [] },
  'user_id' : { type: Number },
  'first_name': { type: String },
  'last_name' : { type: String },
  'country': { type: Schema.Types.Number, ref: 'Country'},
  'city': { type: Number },
  'phone_code' : { type: Number },
  'phone' : { type: Number },
  'role_type' : { type: String },
  'level' : { type: Number },
  'profession': { type: Array },
  'gender': { type: Schema.Types.Number, ref: 'Gender'},
  'profile_photo': { type: String },
  'height' : { type: Number },
  'hair_type' :  { type: Schema.Types.Number, ref: 'Hair_type'},
  'hair_color' :  { type: Schema.Types.Number, ref: 'Hair_color'},
  'eye' :  { type: Schema.Types.Number, ref: 'Eye_color'},
  'chest': { type: Schema.Types.String },
  'bust_size' : { type: Number },
  'waist' : { type: Number },
  'hips' : { type: Number },
  'cup_size' : { type: Number },
  'dress_size' : { type: Number },
  'shoe_size' : { type: Number },
  'tattoo' : { type: Boolean },
  'ethinicity' : { type: String },
  'dob' : { type: Date },
  'location': {
      type: { type: String },
      coordinates: []
    },
  'longitude' : { type: Number },
  'latitude' : { type: Number },
  'bio' : { type: String },
  'instagram' : { type: String },
  'video' : { type: String },
  'image' : { type: String },
  'portfolio' : { type: String },
  'polaroids' : { type: String },
  'contact_details' : { type: String },
  'agency_name': { type: String },
  'agency_address' : { type: String },
  'category' : { type: Number },
  'logo' : { type: String },
  'website' : { type: String },
  'company_name' : { type: String },
  'casting_schedule' : { type: String },
  'favourite' : { type: Array },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

// newSchema.pre('save', function(next){
//   this.updatedAt = Date.now();
//   next();
// });

// newSchema.pre('update', function() {
//   this.update({}, { $set: { updatedAt: Date.now() } });
// });

// newSchema.pre('findOneAndUpdate', function() {
//   this.update({}, { $set: { updatedAt: Date.now() } });
// });

// newSchema.plugin(autoIncrement.plugin, {
//    model: 'User',
//    field: '_id',
//    startAt: 1,
//    incrementBy: 1
// });

module.exports = mongoose.model('User', newSchema);
