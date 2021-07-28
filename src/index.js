require('dotenv').config();
require('debug').enable('*');
const debug = require('debug')('wcrapp:server');
const express = require('express');
const { createMessageAdapter } = require('@slack/interactive-messages');
const { WebClient } = require('@slack/web-api');

const app = express();

const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
app.use('/slack/actions', slackInteractions.expressMiddleware());
require('./services/SlackInteractionsServices')(slackInteractions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));
   
app.listen(8080, () => {
    debug('Server running');
});