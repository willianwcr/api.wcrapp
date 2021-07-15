const express = require('express');

const router = express.Router();

router.use('/webhook', require('../controllers/WebhookController'));
router.use('/figma', require('../routes/figma.routes'));
router.use('/slack', require('../routes/slack.routes'));

module.exports = router;