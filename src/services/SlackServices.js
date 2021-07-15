const { WebClient } = require('@slack/web-api');

const Slack = new WebClient(process.env.SLACK_TOKEN);

module.exports = class SlackServices{

    static async sendMessage(channel, text){
        await Slack.chat.postMessage({
          channel, text
        });
    }

}