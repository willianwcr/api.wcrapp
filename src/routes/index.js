const debug = require('debug')('wcrapp:routes');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        ok: "true",
    });
})
router.use('/webhook', require('../controllers/WebhookController'));
router.use('/figma', require('../routes/figma.routes'));
router.use('/slack', require('../routes/slack.routes'));

module.exports = router;