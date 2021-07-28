const mongoose = require('../database');

const SlackTeam = new mongoose.Schema({
    team_id: {
        type: String
    },
    team_domain: {
        type: String
    }
});

const UserSchema = new mongoose.Schema({
    slack: {
        user_id: {
            type: String
        },
        user_name: {
            type: String
        },
        teams: [SlackTeam]
    },
    figma: {
        user_id : {
            type: String
        },
        email : {
            type: String
        },
        handle : {
            type: String
        },
        img_url : {
            type: String
        },
        token: {
            access_token : {
                type: String
            },
            refresh_token : {
                type: String
            },
            expires_id : {
                type: String
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;