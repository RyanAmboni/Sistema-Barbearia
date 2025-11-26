const db = require('../db');

/**
 * Endpoint para obter KPIs (Número de Agendamentos e Receita Mensal).
 * Requer o mês e o ano como parâmetros de query.
 * Requer que o usuário logado seja 'barbeiro'.
 */
exports.getKpis = async (req, res) => {
  try {
    const { mes, ano } = req.query;

    if (!mes || !ano) {
      return res.status(400).json({ message: 'Missing "mes" and "ano" query parameters.' });
    }

    // 1. Verificação de permissão (apenas 'barbeiro' pode ver estes KPIs)
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (!userResult.rowCount || userResult.rows[0].role !== 'barbeiro') {
      return res.status(403).json({ message: 'Not allowed to view KPIs' });
    }

    // 2. Definindo o intervalo de datas (início e fim do mês)
    // Usamos $mes - 1 porque o Date object usa 0 para Janeiro
    const mesNumero = parseInt(mes, 10);
    const anoNumero = parseInt(ano, 10);
    
    // Início do mês (ex: 2025-11-01 00:00:00)
    const dataInicio = new Date(anoNumero, mesNumero - 1, 1);
    // Início do próximo mês (ex: 2025-12-01 00:00:00). 
    // É mais eficiente buscar até o início do próximo mês.
    const dataFim = new Date(anoNumero, mesNumero, 1);

    if (Number.isNaN(dataInicio.getTime()) || Number.isNaN(dataFim.getTime())) {
        return res.status(400).json({ message: 'Invalid month or year.' });
    }

    // --- KPI 1: Número de Agendamentos (Total) ---
    // Considera todos os agendamentos que foram 'scheduled' ou 'completed' no mês
    const appointmentsResult = await db.query(
        `SELECT COUNT(id) AS count
         FROM appointments 
         WHERE scheduled_at >= $1 AND scheduled_at < $2 
         AND status IN ('scheduled', 'completed')`,
        [dataInicio.toISOString(), dataFim.toISOString()]
    );
    const numAgendamentos = parseInt(appointmentsResult.rows[0].count, 10);


    // --- KPI 2: Receita Mensal (Dinheiro Recebido) ---
    // Soma o preço dos serviços APENAS para agendamentos CONCLUÍDOS ('completed') no mês
    const revenueResult = await db.query(
        `SELECT SUM(s.price) AS total_revenue
         FROM appointments a
         JOIN services s ON s.id = a.service_id
         WHERE a.scheduled_at >= $1 AND a.scheduled_at < $2
         AND a.status = 'completed'`, // Filtra apenas o que foi CONCLUÍDO/PAGO
        [dataInicio.toISOString(), dataFim.toISOString()]
    );
    
    const receitaMensal = Number(revenueResult.rows[0].total_revenue) || 0;
    
    // --- Retorno dos KPIs ---
    return res.json({
      mes,
      ano,
      numAgendamentos,
      receitaMensal: parseFloat(receitaMensal.toFixed(2)), // Garante 2 casas decimais
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};