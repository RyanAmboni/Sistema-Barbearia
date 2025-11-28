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
console.log('✅ Rotas registradas: /api/appointments');
app.use('/api/kpi', kpiRoutes); // ⬅️ NOVO: Habilita o endpoint /api/kpi

// Handler para rotas não encontradas
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

// Verificar se as variáveis do Supabase estão configuradas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Supabase environment variables not set. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Para desenvolvimento local
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Using Supabase: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  });
}

// Exportar para Vercel serverless
module.exports = app;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});