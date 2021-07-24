const got = require('got');

// Import Models
const SlackOAuth = require('../models/SlackOAuth');
const Webhook = require('../models/Webhook');
const SlackFigma = require('../models/SlackFigma');

// Import Services
const FigmaServices = require('../services/FigmaServices');
const SlackServices = require('../services/SlackServices');

module.exports = class SlackController{

    static async webhook(req, res){
        Webhook.create({
            data : JSON.stringify(req.body),
            url: req.originalUrl
        });
        res.send(req.body);
    }

    static interactivity(req, res){
        console.log(req.body);
        res.send(req.body);
    }

    static commandFigma(req, res){
        console.log(req.body);

        // Check if the user already have signed in
        try{

        }catch(err){

        }
    }

    static button(req, res){
        // Example interactive messages
        const interactiveButtons = {
            text: 'The terms of service for this app are _not really_ here: <https://unsplash.com/photos/bmmcfZqSjBU>',
            response_type: 'in_channel',
            attachments: [{
            text: 'Do you accept the terms of service?',
            callback_id: 'accept_tos',
            actions: [
                {
                name: 'accept_tos',
                text: 'Yes',
                value: 'accept',
                type: 'button',
                style: 'primary',
                },
                {
                name: 'accept_tos',
                text: 'No',
                value: 'deny',
                type: 'button',
                style: 'danger',
                },
            ],
            }],
        };
        res.json(interactiveButtons);
    }

    static async oauth(req, res){
        
    }

    static async startup(req, res){
        try{
            const searchParams = new URLSearchParams({
                client_id : process.env.SLACK_CLIENT_ID,
                client_secret : process.env.SLACK_CLIENT_SECRET,
                code : req.query.code,
                redirect_uri : process.env.BASE_URL+'/slack/startup',
            });
            let oauth = await got.post('https://slack.com/api/oauth.v2.access', {searchParams, responseType: 'json'});
            oauth = oauth.body;
            if(oauth.ok){
                const oauthDB = SlackOAuth.create({
                    app_id : oauth.app_id,
                    authed_user_id : oauth.authed_user.id,
                    authed_user_scope : oauth.authed_user.scope,
                    authed_user_access_token : oauth.authed_user.access_token,
                    authed_user_token_type : oauth.authed_user.token_type,
                    scope : oauth.scope,
                    token_type : oauth.token_type,
                    access_token : oauth.access_token,
                    bot_user_id : oauth.bot_user_id,
                    team_id : oauth.team_id,
                    team_name : oauth.team_name,
                    enterprise : oauth.enterprise,
                    is_enterprise_install : oauth.is_enterprise_install,
                });
                res.send(oauthDB);
            }else{
                res.send({
                    ok: false,
                    error: oauth.error
                });
            }
        }catch(err){
            res.send({
                ok: false,
                error: err
            });
        }
    }

}