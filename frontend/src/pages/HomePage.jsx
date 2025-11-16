import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div className="home-content">
      <div className="main-image-placeholder">
        <img src="/ImagemInicial.jpg" alt="Barbeiro Cortando Cabelo" />
      </div>
      <h1 className="welcome-title">BEM VINDO A EXECUTIVE CABELO & CIA</h1>
      <div className="main-buttons-container">
        <button className="btn btn-red" onClick={() => onNavigate('agendamento')}>
          AGENDE SEU HORÁRIO AGORA
        </button>
        <button className="btn btn-red" onClick={() => onNavigate('meusHorarios')}>
          MEUS HORARIOS
        </button>
        <button className="btn btn-red" onClick={() => onNavigate('servicos')}>
          CONHEÇA NOSSOS SERVIÇOS
        </button>
      </div>
      <div className="social-media">
        <p>ENTRE EM CONTATO PELAS NOSSAS REDES SOCIAIS</p>
        <div className="social-icons">
          {/* As classes foram adicionadas de volta aqui */}
          <a href="https://www.instagram.com/executive_001?igsh=MTFmYWRlN255MXM1bQ==" target="_blank" rel="noopener noreferrer" className="icon-instagram"></a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="icon-whatsapp"></a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;