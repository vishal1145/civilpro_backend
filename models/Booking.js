var mongoose = require('mongoose');

var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);
var newSchema = new Schema({
	'booked_to' : { type: Schema.Types.Number, ref: 'User' },
	'booked_by' : { type: Schema.Types.Number, ref: 'User' },
	'start_date':  { type: Date },
	'end_date' :  { type: Date },
	'time': { type: String },
	'city' : { type: Number },
	'team' : { type: Array },
	'currency' : { type: String },
	'job_note' : { type: String },
	'fee_rate' : { type: Number },
	'quantity' : { type: Number },
	'taxes' : { type: String },
	'right' : { type: String },
	'createdAt': { type: Date, default: Date.now },
	'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.plugin(autoIncrement.plugin, {
   model: 'Booking',
   field: '_id',
   startAt: 1,
   incrementBy: 1
});

module.exports = mongoose.model('Booking', newSchema);

