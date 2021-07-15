const express = require('express');
const Figma = require('figma-js');
const got = require('got');

const router = express.Router();

const FigmaController = require('../controllers/FigmaController');

router.all('/webhook', FigmaController.webhook);
router.get('/oauth/callback', FigmaController.getOAuthToken);
router.get('/oauth', FigmaController.oauth);

module.exports = router;