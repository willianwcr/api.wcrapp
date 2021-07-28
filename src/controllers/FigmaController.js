const debug = require('debug')('wcrapp:controller:figma');
const got = require('got');
const Figma = require('figma-api');
const Webhook = require('../models/Webhook');

// Init JWT
var jwt = require('jsonwebtoken');

// Import Models
const User = require('../models/User');

// Import Services
const FigmaServices = require('../services/FigmaServices');
const SlackServices = require('../services/SlackServices');

// Import Slack Messages
const SlackMessages = require('../messages/SlackMessages');

module.exports = class FigmaController{
    static async webhook(req, res){
        console.log(req.body);
        Webhook.create({
            data : JSON.stringify(req.body),
            url: req.originalUrl
        });
        res.send(req.body);
    }

    static oauth(req, res){
        res.send(FigmaServices.generateOAuth());
    }

    static async getOAuthToken(code){
        debug('Calling Figma OAuth API');
        const result = await got.post('https://www.figma.com/api/oauth/token', {
            searchParams: {
                client_id : process.env.FIGMA_CLIENT_ID,
                client_secret : process.env.FIGMA_CLIENT_SECRET,
                redirect_uri : process.env.BASE_URL+'/figma/oauth/callback',
                code : code,
                grant_type : 'authorization_code',
            }
        });

        return JSON.parse(result.body);
    }

    static async oauthCallback(req, res){
        // Get access_token
        const oauth = await FigmaController.getOAuthToken(req.query.code);

        // Decode JWT
        var {user_id} = jwt.verify(req.query.state, process.env.JWT_SECRET);

        // Get user information
        const figmaUser = await new Figma.Api({
            oAuthToken : oauth.access_token
        }).getMe();

        var slackUser = await User.findById(user_id, (err, result) => {
            if(err){
                // Erro ao pesquisar usuário no banco de dados
                // Retornar mensagem de erro ao usuário
            }else{
                slackUser = result;
            }
        });

        // Save access_token to BD
        User.updateOne({
            _id : user_id
        }, {
            figma : {
                user_id : oauth.user_id,
                email : figmaUser.email,
                handle : figmaUser.handle,
                img_url : figmaUser.img_url,
                token : {
                    access_token : oauth.access_token,
                    refresh_token : oauth.refresh_token,
                    expires_in : oauth.expires_in
                }
            }
        }, async (err, result) => {
            if(err){
                // Erro ao atualizar cadastro do usuário
                // Retornar mensagem de erro ao usuário
            }else{
                // Enviar mensagem de sucesso
                SlackServices.sendMessage(slackUser.slack.user_id, SlackMessages.figmaSigninSuccess(figmaUser.handle, figmaUser.email, figmaUser.img_url));

                // Redirecionar usuário de volta ao Slack
                res.redirect('https://slack.com/app_redirect?app='+process.env.SLACK_APP_ID);
            }
        });
    }
}