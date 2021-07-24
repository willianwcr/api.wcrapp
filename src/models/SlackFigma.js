const mongoose = require('../database');

const SlackFigmaSchema = new mongoose.Schema({
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

const SlackFigma = mongoose.model('SlackFigma', SlackFigmaSchema);

module.exports = SlackFigma;