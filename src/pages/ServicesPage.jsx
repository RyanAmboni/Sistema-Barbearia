import React from 'react';

function ServiceCard({ title, imageSrc, onNavigate }) {
  return (
    <div className="service-card">
      <h2>{title}</h2>
      <div className="image-placeholder">
        <img src={imageSrc} alt={title} />
      </div>
      <button className="btn btn-red" onClick={() => onNavigate('agendamento')}>
        AGENDE AGORA
      </button>
    </div>
  );
}

function ServicesPage({ onNavigate }) {
  return (
    <div className="page-content">
      <h1 className="page-title">SERVIÇOS</h1>
      <div className="services-container">
        <ServiceCard 
          title="CORTE DE CABELO" 
          imageSrc="/CorteCabelo.jpg" 
          onNavigate={onNavigate} 
        />
        <ServiceCard 
          title="CORTE DE BARBA" 
          imageSrc="/CorteBarba.jpg" 
          onNavigate={onNavigate} 
        />
        <ServiceCard 
          title="SOBRANCELHAS" 
          imageSrc="/CorteSobrancelha.jpeg" 
          onNavigate={onNavigate} 
        />
      </div>
    </div>
  );
}

export default ServicesPage;