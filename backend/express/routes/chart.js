const express = require('express');

const chartController = require('../controllers/chart');

const router = express.Router();

router.get('/gross_volume', chartController.getGrossVolume);

module.exports = router;
