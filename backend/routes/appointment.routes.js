const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, appointmentController.create);
router.get('/', auth, appointmentController.listForUser);
router.delete('/:id', auth, appointmentController.cancel);

module.exports = router;
