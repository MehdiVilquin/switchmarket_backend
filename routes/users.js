const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.get('/me', auth, (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
