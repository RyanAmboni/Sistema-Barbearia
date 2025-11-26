const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const kpiRoutes = require('./routes/kpi.routes'); // ⬅️ NOVO: Importa as rotas de KPI

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Sistema Barbearia API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/kpi', kpiRoutes); // ⬅️ NOVO: Habilita o endpoint /api/kpi

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    // Tenta conectar ao DB antes de iniciar o servidor
    await db.query('SELECT 1'); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start server, DB error:', err);
    process.exit(1);
  }
};

start();

module.exports = app;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});