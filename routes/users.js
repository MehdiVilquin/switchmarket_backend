const express = require('express');
const router = express.Router();

// Import des controllers authController et userController et du middleware auth
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, userController.getMe);

module.exports = router;
