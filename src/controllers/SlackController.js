const got = require('got');
const SlackOAuth = require('../models/SlackOAuth');
const Webhook = require('../models/Webhook');

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
        res.send({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Olá 👋 eu sou o wcr.app. Para utilizar essa função, você primeiro precisa conectar seu Figma:"
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Conectar Figma",
                                "emoji": true
                            },
                            "value": "click_me_123",
                            "url": FigmaServices.generateOAuth()
                        }
                    ]
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Teste",
                                "emoji": true
                            },
                            "value": "click_me_123",
                            "action_id": "select_coffee"
                        }
                    ]
                },
            ]
        });
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