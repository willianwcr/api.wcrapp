const debug = require('debug')('wcrapp:routes:figma');
const express = require('express');
const Figma = require('figma-js');
const got = require('got');

const router = express.Router();

const FigmaController = require('../controllers/FigmaController');

router.all('/webhook', FigmaController.webhook);
router.get('/oauth/callback', FigmaController.oauthCallback);
router.get('/oauth', FigmaController.oauth);

module.exports = router;