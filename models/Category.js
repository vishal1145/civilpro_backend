var mongoose = require('mongoose');


var CategorySchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['Client', 'Agency', 'Professionals', 'Apartment', 'Equipment']
    },
 
    parentid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    created_at: { type: Date, default: Date.now }
});

mongoose.model('Category', CategorySchema);
