const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares_helpers/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);

module.exports = router;
