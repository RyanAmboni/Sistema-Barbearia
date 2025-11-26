import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api'; // Importa a instância do axios/fetch configurada

// Variáveis para buscar o Mês e Ano atual
const CURRENT_MONTH = new Date().getMonth() + 1; // 1 = Janeiro
const CURRENT_YEAR = new Date().getFullYear();

function KPIDashboard() {
  const [agendamentos, setAgendamentos] = useState(0);
  const [receita, setReceita] = useState(0.00);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(CURRENT_MONTH);
  const [ano, setAno] = useState(CURRENT_YEAR);

  // Função para buscar os KPIs na API
  const fetchKpis = useCallback(async (selectedMonth, selectedYear) => {
    setLoading(true);
    
    try {
      // Faz a requisição ao endpoint do Node.js
      const response = await api.get(`/api/kpi?mes=${selectedMonth}&ano=${selectedYear}`);
      
      setAgendamentos(response.numAgendamentos);
      setReceita(response.receitaMensal);
      toast.success(`KPIs de ${selectedMonth}/${selectedYear} carregados!`, { autoClose: 1500 });
      
    } catch (err) {
      console.error("Erro ao buscar KPIs:", err);
      toast.error(err.message || "Erro ao carregar KPIs. Verifique o servidor.");
      setAgendamentos(0);
      setReceita(0.00);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Executa a busca sempre que o Mês ou Ano mudar
  useEffect(() => {
    fetchKpis(mes, ano);
  }, [mes, ano, fetchKpis]);

  // Função para mudar o mês/ano (simplesmente avança ou volta 1 mês)
  const handleMonthChange = (direction) => {
      let newMonth = mes + direction;
      let newYear = ano;
      
      if (newMonth < 1) {
          newMonth = 12;
          newYear -= 1;
      } else if (newMonth > 12) {
          newMonth = 1;
          newYear += 1;
      }
      
      setMes(newMonth);
      setAno(newYear);
  };
    
  // Cálculo do Ticket Médio
  const ticketMedio = agendamentos > 0 ? (receita / agendamentos) : 0;
  
  // Formatadores
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const monthName = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });

  return (
    <div className="kpi-dashboard-module">
      <div className="kpi-header">
        <h2 className="kpi-title">ESTATÍSTICAS</h2>
        <div className="kpi-date-selector">
          <button onClick={() => handleMonthChange(-1)} className="btn-prev-month">
            &lt; Mês Anterior
          </button>
          <span className="current-period">
            {monthName.toUpperCase()} / {ano}
          </span>
          <button onClick={() => handleMonthChange(1)} className="btn-next-month">
            Próximo Mês &gt;
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="kpi-loading">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <div className="kpi-container">
          {/* Cartão 1: Número de Agendamentos */}
          <div className="kpi-card appointments-card">
            <p className="kpi-card-title">Agendamentos Válidos</p>
            <p className="kpi-card-value">{agendamentos}</p>
            <p className="kpi-card-description">Agendamentos no período </p>
          </div>

          {/* Cartão 2: Receita Mensal */}
          <div className="kpi-card revenue-card">
            <p className="kpi-card-title">Dinheiro Recebido</p>
            <p className="kpi-card-value">R$ {formatCurrency(receita)}</p>
            <p className="kpi-card-description">Soma dos serviços com status completo</p>
          </div>

          {/* Cartão 3: Ticket Médio (Derivado) */}
          <div className="kpi-card average-ticket-card">
            <p className="kpi-card-title">Ticket Médio</p>
            <p className="kpi-card-value">R$ {formatCurrency(ticketMedio)}</p>
            <p className="kpi-card-description">Receita Total / Agendamentos Válidos</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPIDashboard;