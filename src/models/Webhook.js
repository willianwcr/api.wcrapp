const mongoose = require('../database');

const WebhookSchema = new mongoose.Schema({
    data: {
        type: 'String',
        require: false,
    },
    url: {
        type: 'String',
        require: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Webhook = mongoose.model('Webhook', WebhookSchema);

module.exports = Webhook;