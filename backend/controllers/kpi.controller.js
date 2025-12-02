const supabase = require('../config/supabase');

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
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (userError || !user || user.role !== 'barbeiro') {
      return res.status(403).json({ message: 'Not allowed to view KPIs' });
    }

    // 2. Definindo o intervalo de datas (início e fim do mês)
    const mesNumero = parseInt(mes, 10);
    const anoNumero = parseInt(ano, 10);
    
    // Início do mês (ex: 2025-11-01 00:00:00)
    const dataInicio = new Date(anoNumero, mesNumero - 1, 1);
    // Início do próximo mês (ex: 2025-12-01 00:00:00)
    const dataFim = new Date(anoNumero, mesNumero, 1);

    if (Number.isNaN(dataInicio.getTime()) || Number.isNaN(dataFim.getTime())) {
        return res.status(400).json({ message: 'Invalid month or year.' });
    }

    // --- KPI 1: Número de Agendamentos (Total) ---
    const { count: numAgendamentos, error: countError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', dataInicio.toISOString())
      .lt('scheduled_at', dataFim.toISOString())
      .in('status', ['scheduled', 'completed']);

    if (countError) throw countError;

    // --- KPI 2: Receita Mensal (Dinheiro Recebido) ---
    // Buscar agendamentos concluídos com seus serviços
    const { data: completedAppointments, error: revenueError } = await supabase
      .from('appointments')
      .select(`
        id,
        services (
          price
        )
      `)
      .gte('scheduled_at', dataInicio.toISOString())
      .lt('scheduled_at', dataFim.toISOString())
      .eq('status', 'completed');

    if (revenueError) throw revenueError;

    // Calcular receita total
    const receitaMensal = completedAppointments?.reduce((total, appointment) => {
      const price = appointment.services?.price || 0;
      return total + Number(price);
    }, 0) || 0;
    
    // --- Retorno dos KPIs ---
    return res.json({
      mes,
      ano,
      numAgendamentos: numAgendamentos || 0,
      receitaMensal: parseFloat(receitaMensal.toFixed(2)), // Garante 2 casas decimais
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * KPIs simples: totais gerais de agendamentos e receita.
 */
exports.getSummary = async (req, res) => {
  try {
    // Garantir que apenas barbeiros enxerguem os KPIs
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (userError || !user || user.role !== 'barbeiro') {
      return res.status(403).json({ message: 'Not allowed to view KPIs' });
    }

    // Total de agendamentos marcados (estados ativos)
    const validStatuses = ['scheduled', 'accepted', 'completed'];
    const { count: totalMarcados, error: countMarkedError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .in('status', validStatuses);

    if (countMarkedError) throw countMarkedError;

    // Total de agendamentos concluídos
    const { count: totalConcluidos, error: countCompletedError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (countCompletedError) throw countCompletedError;

    // Receita total = soma dos preços dos serviços concluídos
    const { data: completedAppointments, error: revenueError } = await supabase
      .from('appointments')
      .select(`
        services (
          price
        )
      `)
      .eq('status', 'completed');

    if (revenueError) throw revenueError;

    const receitaTotal = (completedAppointments || []).reduce((total, appointment) => {
      const price = appointment.services?.price || 0;
      return total + Number(price);
    }, 0);

    const ticketMedio = (totalConcluidos || 0) > 0 ? receitaTotal / totalConcluidos : 0;

    return res.json({
      totalMarcados: totalMarcados || 0,
      totalConcluidos: totalConcluidos || 0,
      receitaTotal: Number(receitaTotal.toFixed(2)),
      ticketMedio: Number(ticketMedio.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
