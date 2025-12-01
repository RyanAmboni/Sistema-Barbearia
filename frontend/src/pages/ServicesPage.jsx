import React, { useEffect, useState } from 'react';
import { api } from '../api';

function ServiceCard({ title, imageSrc, price, onNavigate }) {
  return (
    <div className="service-card">
      <h2>{title}</h2>
      <div className="image-placeholder">
        <img src={imageSrc} alt={title} loading="lazy" />
      </div>
      {price && <div className="service-price">R$ {price.toFixed(2).replace('.', ',')}</div>}
      <button 
        className="btn btn-red" 
        onClick={() => onNavigate('agendamento')}
        aria-label={`Agendar ${title}`}
      >
        AGENDE AGORA
      </button>
    </div>
  );
}

// Função para mapear o nome do serviço para a imagem correta
function getServiceImage(serviceName) {
  if (!serviceName) return '/CorteCabelo.jpg';
  
  const name = serviceName.toLowerCase();
  
  // Serviços combinados - priorizar a imagem mais completa
  if (name.includes('barba') && name.includes('sombrancelha') && name.includes('cabelo')) {
    return '/CorteCabelo.jpg'; // Serviço completo
  } else if (name.includes('cabelo') && name.includes('barba')) {
    return '/CorteCabelo.jpg'; // Cabelo + Barba
  } else if (name.includes('cabelo') && name.includes('sombrancelha')) {
    return '/CorteCabelo.jpg'; // Cabelo + Sombrancelha
  } else if (name.includes('barba') && name.includes('sombrancelha')) {
    return '/CorteBarba.jpg'; // Barba + Sombrancelha
  } else if (name.includes('cabelo')) {
    return '/CorteCabelo.jpg';
  } else if (name.includes('barba')) {
    return '/CorteBarba.jpg';
  } else if (name.includes('sombrancelha')) {
    return '/CorteSombrancelha.jpg';
  }
  
  // Fallback padrão
  return '/CorteCabelo.jpg';
}

function ServicesPage({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchServices = async () => {
      try {
        const data = await api.get('/api/services');
        if (mounted) {
          setServices(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);
        if (mounted) {
          setError('Não foi possível carregar os serviços. Mostrando serviços padrão.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchServices();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  // Serviços padrão para fallback
  const defaultServices = [
    { id: 1, name: 'CORTE DE CABELO', price: 40.00, image: '/CorteCabelo.jpg' },
    { id: 2, name: 'CORTE DE BARBA', price: 30.00, image: '/CorteBarba.jpg' },
    { id: 3, name: 'SOMBRANCELHAS', price: 20.00, image: '/CorteSombrancelha.jpg' },
  ];

  const servicesToShow = services.length > 0 ? services : defaultServices;

  return (
    <div className="page-content">
      <h1 className="page-title">Nossos Serviços</h1>
      
      {error && (
        <div className="error-message" style={{
          textAlign: 'center', 
          color: '#ff6b6b', 
          padding: '1rem',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px',
          maxWidth: '800px',
          margin: '0 auto 2rem',
        }}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px' 
        }}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="services-container">
          {servicesToShow.map(service => (
            <ServiceCard 
              key={service.id} 
              title={service.name} 
              imageSrc={service.image || getServiceImage(service.name)} 
              price={service.price}
              onNavigate={onNavigate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesPage;