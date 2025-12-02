const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpi.controller');
const auth = require('../middleware/auth.middleware');
const barbeiroMiddleware = require('../middleware/barbeiro.middleware');

// Endpoint para buscar todos os KPIs (somente barbeiro/admin)
router.get('/', auth, barbeiroMiddleware, kpiController.getKpis);
router.get('/summary', auth, barbeiroMiddleware, kpiController.getSummary);

module.exports = router;
