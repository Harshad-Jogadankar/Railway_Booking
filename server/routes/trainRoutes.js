const express = require('express');
const trainController = require('../controllers/trainController');
const router = express.Router();

router.post('/search', trainController.searchTrains);
router.post('/bookTrain', trainController.bookTrain);

module.exports = router;
