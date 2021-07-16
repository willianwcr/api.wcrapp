

module.exports = class FigmaServices{

    static generateOAuth(){
        const client_id = process.env.FIGMA_CLIENT_ID;
        const callback = process.env.BASE_URL+'/figma/oauth/callback';
        const scope = 'file_read';
        const state = '123';
        const response_type = 'code';
        const OAuthUrl = "https://www.figma.com/oauth?client_id="+client_id+"&redirect_uri="+callback+"&scope="+scope+"&state="+state+"&response_type="+response_type;
        return OAuthUrl;
    }

}