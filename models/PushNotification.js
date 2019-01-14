var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var PushNotificationSchema = new mongoose.Schema({
    title: String,
    type: String,
    text: String,
    image: String,
    notificationType: String,
    // linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    // byId: { type: mongoose.Schema.Types.ObjectId, ref: 'artist_user' },
    refData: {},
    targetId: String,
    status: { type: String, default: "New" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    count: { type: Number, default: 1 },
});

mongoose.model('PushNotification', PushNotificationSchema);