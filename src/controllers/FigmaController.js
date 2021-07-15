const Figma = require('figma-js');
const got = require('got');
const Webhook = require('../models/Webhook');

const FigmaServices = require('../services/FigmaServices');

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

    static async getOAuthToken(req, res){
        const result = await got.post('https://www.figma.com/api/oauth/token', {
            searchParams: {
                client_id : process.env.FIGMA_CLIENT_ID,
                client_secret : process.env.FIGMA_CLIENT_SECRET,
                redirect_uri : process.env.BASE_URL+'/figma/oauth/callback',
                code : req.query.code,
                grant_type : 'authorization_code',
            }
        });

        console.log(result.body);

        res.send(result.body);
    }
}