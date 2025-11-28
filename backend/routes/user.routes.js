const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const barbeiroMiddleware = require('../middleware/barbeiro.middleware');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);

// Rotas protegidas - apenas barbeiros podem acessar
router.get('/all', auth, barbeiroMiddleware, userController.listUsers);
router.put('/role', auth, barbeiroMiddleware, userController.updateUserRole);

module.exports = router;
