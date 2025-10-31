import React, { useEffect, useState } from 'react';
import { api } from '../api';

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
  const [services, setServices] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/api/services').then(data => {
      if (mounted) setServices(data || []);
    }).catch(() => {
      // ignore, keep static fallback
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="page-content">
      <h1 className="page-title">SERVIÇOS</h1>
      <div className="services-container">
        {services.length === 0 ? (
          // fallback to original static cards
          <>
            <ServiceCard title="CORTE DE CABELO" imageSrc="/CorteCabelo.jpg" onNavigate={onNavigate} />
            <ServiceCard title="CORTE DE BARBA" imageSrc="/CorteBarba.jpg" onNavigate={onNavigate} />
            <ServiceCard title="SOBRANCELHAS" imageSrc="/CorteSobrancelha.jpeg" onNavigate={onNavigate} />
          </>
        ) : (
          services.map(s => (
            <div key={s.id} className="service-card">
              <h2>{s.name}</h2>
              <div className="image-placeholder">
                <img src="/CorteCabelo.jpg" alt={s.name} />
              </div>
              <div className="service-price">R$ {s.price}</div>
              <button className="btn btn-red" onClick={() => onNavigate('agendamento')}>
                AGENDE AGORA
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ServicesPage;