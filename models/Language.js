var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);
var newSchema = new Schema({
  'id': { type: Number },
  'name': { type: String }
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
   model: 'Language',
   field: '_id',
   startAt: 1,
   incrementBy: 1
});


module.exports = mongoose.model('Language', newSchema);
