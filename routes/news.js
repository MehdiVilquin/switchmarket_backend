const express = require('express');
const router = express.Router();
const { fetchNews } = require('../controllers/newsController');

router.get('/', fetchNews);

module.exports = router;
