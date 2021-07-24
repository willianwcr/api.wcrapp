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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;