var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);
var newSchema = new Schema({
  'favourite_by': { type: Schema.Types.Number, ref: 'User' },
  'role_type': { type: String },
  'favourite_to': { type: Schema.Types.Number, ref: 'User' },
  'is_like': { type: Boolean }
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
   model: 'Favourite',
   field: '_id',
   startAt: 1,
   incrementBy: 1
});


module.exports = mongoose.model('Favourite', newSchema);
