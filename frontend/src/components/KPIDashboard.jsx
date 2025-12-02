import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function KPIDashboard() {
  const [summary, setSummary] = useState({
    totalMarcados: 0,
    totalConcluidos: 0,
    receitaTotal: 0,
    ticketMedio: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/kpi/summary');
      setSummary({
        totalMarcados: response?.totalMarcados || 0,
        totalConcluidos: response?.totalConcluidos || 0,
        receitaTotal: response?.receitaTotal || 0,
        ticketMedio: response?.ticketMedio || 0,
      });
      toast.success('KPIs atualizados', { autoClose: 1200 });
    } catch (err) {
      console.error('Erro ao buscar KPIs simples:', err);
      toast.error(err.message || 'Erro ao carregar KPIs. Verifique o servidor.');
      setSummary({
        totalMarcados: 0,
        totalConcluidos: 0,
        receitaTotal: 0,
        ticketMedio: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="kpi-dashboard-module">
      <div className="kpi-header">
        <h2 className="kpi-title">ESTATÍSTICAS</h2>
        <button onClick={fetchSummary} className="btn-next-month">
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="kpi-loading">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <div className="kpi-container">
          <div className="kpi-card appointments-card">
            <p className="kpi-card-title">Total Marcados</p>
            <p className="kpi-card-value">{summary.totalMarcados}</p>
            <p className="kpi-card-description">
              Agendamentos ativos (marcados/aceitos/concluídos)
            </p>
          </div>

          <div className="kpi-card revenue-card">
            <p className="kpi-card-title">Total Concluídos</p>
            <p className="kpi-card-value">{summary.totalConcluidos}</p>
            <p className="kpi-card-description">Serviços finalizados</p>
          </div>

          <div className="kpi-card revenue-card">
            <p className="kpi-card-title">Dinheiro Recebido</p>
            <p className="kpi-card-value">R$ {formatCurrency(summary.receitaTotal)}</p>
            <p className="kpi-card-description">Soma dos serviços concluídos</p>
          </div>

          <div className="kpi-card average-ticket-card">
            <p className="kpi-card-title">Ticket Médio</p>
            <p className="kpi-card-value">R$ {formatCurrency(summary.ticketMedio)}</p>
            <p className="kpi-card-description">
              Receita total ÷ agendamentos concluídos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPIDashboard;
