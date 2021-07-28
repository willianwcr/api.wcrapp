const FigmaServices = require('../services/FigmaServices');

const SlackMessages = [];

SlackMessages.figmaSignin = (url) => {
	return {"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Você ainda não conectou sua conta do Figma. Para fazer isto basta clicar no botão abaixo e fazer o login:"
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"style": "primary",
					"text": {
						"type": "plain_text",
						"text": "Conectar Figma",
						"emoji": true
					},
					"action_id": "figma_signin",
					"url": url
				}
			]
		}
	]}
};

SlackMessages.figmaSigninSuccess = (name, email, image_url) => {
	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "Você conectou com sucesso sua conta do Figma:"
				}
			},
			{
				"type": "context",
				"elements": [
					{
						"type": "image",
						"image_url": image_url,
						"alt_text": "cute cat"
					},
					{
						"type": "mrkdwn",
						"text": name+" ("+email+")"
					}
				]
			}
		]
	};
}

module.exports = SlackMessages;