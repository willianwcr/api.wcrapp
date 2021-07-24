const FigmaServices = require('../services/FigmaServices');

const SlackMessages = [];

SlackMessages.figmaSignin = {
	"blocks": [
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
					"url": FigmaServices.generateOAuth()
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Após completar o login, um código de 6 dígitos será mostrado na sua tela. Para completar o cadastro basta clicar no botão abaixo e preencher esse código.",
				"emoji": true
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Digitar código",
						"emoji": true
					},
					"action_id": "figma_signin_code"
				}
			]
		}
	]
};

module.exports = SlackMessages;