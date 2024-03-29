var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);
var newSchema = new Schema({
  'profession_id': { type: Number },
  'parent_id': { type: Number },
  'category_title': { type: String },
  'gender_type': { type: Number }
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
   model: 'Profession',
   field: '_id',
   startAt: 1,
   incrementBy: 1
});


module.exports = mongoose.model('Profession', newSchema);