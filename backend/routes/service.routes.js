const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', serviceController.list);
router.post('/', auth, serviceController.create);
router.put('/:id', auth, serviceController.update);
router.delete('/:id', auth, serviceController.remove);

module.exports = router;
