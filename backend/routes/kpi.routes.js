const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpi.controller');
const auth = require('../middleware/auth.middleware');

// Endpoint para buscar todos os KPIs (somente barbeiro/admin)
router.get('/', auth, kpiController.getKpis);

module.exports = router;