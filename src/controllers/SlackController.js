const debug = require('debug')('wcrapp:controller:slack');
const got = require('got');

// Init JWT
var jwt = require('jsonwebtoken');

// Import Models
const SlackOAuth = require('../models/SlackOAuth');
const Webhook = require('../models/Webhook');
const User = require('../models/User');

// Import Services
const FigmaServices = require('../services/FigmaServices');
const SlackServices = require('../services/SlackServices');

// Import Slack Messages
const SlackMessages = require('../messages/SlackMessages');

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

    static async commandFigma(req, res){

        // Check if the user already have signed in
        let userDB = await User.findOne({
            'slack.user_id' : req.body.user_id
        }, (err, result) => {
            if(result){
                // Usuário existe
                // Verificar se o usuário já tem o time cadastrado na conta
                if(result.slack.teams !== undefined || result.slack.teams.filter(e => e.team_id == req.body.team_id).length > 0){
                    // Time já está cadastrado na conta do usuário
                    // Verificar se o usuário já tem login no Figma
                    console.log(result.figma);
                    if(result.figma){
                        // Usuário já conectou a conta do Figma
                        // Enviar mensagens com comandos específicos
                        debug('User already signed with Figma');
                    }else{
                        // Usuário ainda não conectou a conta do Figma
                        debug('User still not have connected a Figma account');
                        // Gerar Login

                        // Generate Token
                         var token = jwt.sign({
                            user_id : result._id,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60)
                        }, process.env.JWT_SECRET);

                        // Generate Figma Login
                        var figmaLogin = FigmaServices.generateOAuth(token);

                        // Enviar mensagem de Login
                        return res.json(SlackMessages.figmaSignin(figmaLogin));
                    }
                }else{
                    // Time ainda não está cadastrado na conta do usuário
                    // Atualizar conta do usuário com o time
                    User.updateOne({
                        'slack.user_id' : req.body.user_id
                    },{
                        $push: {
                            'slack.teams': {
                                team_id: req.body.team_id,
                                team_domain: req.body.team_domain
                            }
                        }
                    }, async (err, result) => {
                        if(err){
                            // Erro ao atualizar cadastro
                            debug('Error updating user:', err);

                            // Return error to user
                        }else{
                            // Usuário atualizado com sucesso
                            debug('User updated successfully');
                            // Verificar se o usuário já tem login no Figma

                            // Generate Token
                            var token = await jwt.sign({
                                user_id : userDB._id,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60)
                            }, process.env.JWT_SECRET);

                            // Generate Figma Login
                            var figmaLogin = FigmaServices.generateOAuth(token);

                            // Enviar mensagem de Login
                            return res.json(SlackMessages.figmaSignin(figmaLogin));
                        }
                    });
                }
            }else{
                // Usuário não existe
                // Cadastrar o usuário no banco de dados
                User.create({
                    slack: {
                        user_id: req.body.user_id,
                        user_name: req.body.user_name,
                        teams: [
                            {
                                team_id: req.body.team_id,
                                team_domain: req.body.team_domain
                            }
                        ]
                    }   
                }, (err, result) => {
                    if(err){
                        // Erro ao cadastrar o usuário
                        debug('Error creating user:', err);

                        // Return error to user
                    }else{
                        // Usuário cadastrado com sucesso
                        debug('User created successfully with id:', result.id);
                        
                         // Generate Token
                         var token = jwt.sign({
                            user_id : result._id,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60)
                        }, process.env.JWT_SECRET);

                        // Generate Figma Login
                        var figmaLogin = FigmaServices.generateOAuth(token);

                        // Enviar mensagem de Login
                        return res.json(SlackMessages.figmaSignin(figmaLogin));
                    }
                });
            }
        });
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