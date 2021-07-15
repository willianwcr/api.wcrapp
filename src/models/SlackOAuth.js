const mongoose = require('../database');

const SlackOAuthSchema = new mongoose.Schema({
    app_id: {
        type: 'String',
    },
    authed_user_id: {
        type: 'String',
    },
    authed_user_scope: {
        type: 'String',
    },
    authed_user_access_token: {
        type: 'String',
    },
    authed_user_token_type: {
        type: 'String',
    },
    scope: {
        type: 'String',
    },
    token_type: {
        type: 'String',
    },
    access_token: {
        type: 'String',
    },
    bot_user_id: {
        type: 'String',
    },
    team_id: {
        type: 'String',
    },
    team_name: {
        type: 'String',
    },
    enterprise: {
        type: 'String',
    },
    is_enterprise_install: {
        type: 'String',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SlackOAuth = mongoose.model('SlackOAuth', SlackOAuthSchema);

module.exports = SlackOAuth;