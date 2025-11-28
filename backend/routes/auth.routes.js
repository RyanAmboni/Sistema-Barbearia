const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Endpoint especial para criar o primeiro barbeiro (só funciona se não houver barbeiros)
router.post('/create-first-barbeiro', authController.createFirstBarbeiro);

module.exports = router;
