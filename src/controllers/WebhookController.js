const express = require('express');

const Webhook = require('../models/Webhook');

const router = express.Router();

router.all('/', async (req, res) => {
    Webhook.create({
        data : JSON.stringify(req.body),
        url: req.originalUrl
    });
    res.send(req.body);
})

module.exports = router;