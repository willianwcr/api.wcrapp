const express = require('express');

const router = express.Router();

const SlackController = require('../controllers/SlackController');

router.all('/webhook', SlackController.webhook);
router.all('/interactivity', SlackController.interactivity);
router.use('/command/figma', SlackController.commandFigma);
router.get('/oauth', SlackController.oauth);
router.get('/startup', SlackController.startup);

module.exports = router;