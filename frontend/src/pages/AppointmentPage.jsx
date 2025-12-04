import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

const staticServices = [
  { id: 1, name: 'Cabelo', price: 40 },
  { id: 2, name: 'Barba', price: 20 },
  { id: 3, name: 'Cabelo + Barba', price: 55 },
  { id: 4, name: 'Sombrancelha', price: 15 },
  { id: 5, name: 'Cabelo + Sombrancelha', price: 50 },
  { id: 6, name: 'Barba + Sombrancelha', price: 30 },
  { id: 7, name: 'Barba + Sombrancelha + Cabelo', price: 65 },
];

const generateTimeSlots = (selectedDate) => {
  const slots = [];
  const dayOfWeek = selectedDate ? new Date(selectedDate).getUTCDay() : -1;

  if (dayOfWeek === 6) { // Sábado
    for (let h = 9; h < 12; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  } else { // Segunda a Sexta
    for (let h = 9; h < 12; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    for (let h = 14; h < 20; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
};

function AppointmentPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedService, setSelectedService] = useState(''); // will store service id
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingServices(true);
    api.get('/api/services').then(data => {
      if (mounted && Array.isArray(data) && data.length) {
        console.log('Serviços carregados da API:', data);
        setServices(data);
      } else if (mounted) {
        // Se não houver serviços na API, usar fallback estático
        console.warn('Nenhum serviço encontrado na API, usando fallback');
        setServices(staticServices);
      }
    }).catch((err) => {
      console.error('Erro ao carregar serviços:', err);
      // Usar fallback estático apenas em caso de erro
      if (mounted) {
        setServices(staticServices);
        toast.error('Não foi possível carregar os serviços. Usando lista padrão.');
      }
    }).finally(() => {
      if (mounted) {
        setLoadingServices(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Buscar horários ocupados quando a data mudar
  useEffect(() => {
    if (!date) {
      setOccupiedSlots([]);
      return;
    }

    let mounted = true;
    setLoadingSlots(true);
    api.get(`/api/appointments/occupied-slots?date=${date}`)
      .then(data => {
        if (mounted && data.occupiedSlots) {
          setOccupiedSlots(data.occupiedSlots);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar horários ocupados:', err);
        if (mounted) {
          setOccupiedSlots([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoadingSlots(false);
        }
      });

    return () => { mounted = false; };
  }, [date]);

  const timeSlots = useMemo(() => {
    const allSlots = generateTimeSlots(date);
    // Filtrar horários ocupados
    return allSlots.filter(slot => !occupiedSlots.includes(slot));
  }, [date, occupiedSlots]);
  
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate.getUTCDay() === 0) {
      toast.error('Agendamentos não estão disponíveis aos domingos.');
      setDate('');
    } else {
      setDate(e.target.value);
    }
    setTime('');
    setOccupiedSlots([]); // Limpar slots ocupados ao mudar data
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const serviceDetails = services.find(s => String(s.id) === String(selectedService));
    if (!date || !time || !serviceDetails) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Envia o horário exatamente como selecionado (sem ajuste automático de fuso)
      const scheduledAt = `${date}T${time}:00Z`;

      await api.post('/api/appointments', {
        serviceId: serviceDetails.id,
        scheduledAt,
      });
      toast.success(`Agendamento de ${serviceDetails.name} confirmado!`);
      // Recarregar horários ocupados para atualizar a lista
      if (date) {
        const data = await api.get(`/api/appointments/occupied-slots?date=${date}`);
        if (data.occupiedSlots) {
          setOccupiedSlots(data.occupiedSlots);
        }
      }
      setTime('');
      setSelectedService('');
    } catch (err) {
      if (err.status === 409) {
        toast.error('Este horário já está ocupado. Por favor, selecione outro horário.');
        // Recarregar horários ocupados
        if (date) {
          try {
            const data = await api.get(`/api/appointments/occupied-slots?date=${date}`);
            if (data.occupiedSlots) {
              setOccupiedSlots(data.occupiedSlots);
            }
          } catch (reloadErr) {
            console.error('Erro ao recarregar horários:', reloadErr);
          }
        }
      } else {
        toast.error(err.message || 'Erro ao criar agendamento');
      }
    }
  };

  const currentPrice = services.find(s => String(s.id) === String(selectedService))?.price || 0;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-container">
      <div className="appointment-form-wrapper">
        <h1 className="page-title">AGENDAMENTO</h1>
        <form id="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="data-agendamento">DATA:</label>
            <input type="date" id="data-agendamento" min={today} value={date} onChange={handleDateChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="horario-disponivel">HORÁRIOS DISPONÍVEIS:</label>
            <select id="horario-disponivel" value={time} onChange={(e) => setTime(e.target.value)} required disabled={!date || loadingSlots}>
              <option value="">
                {loadingSlots 
                  ? 'Carregando horários...' 
                  : date 
                    ? timeSlots.length === 0 
                      ? 'Nenhum horário disponível para esta data' 
                      : 'Selecione um horário' 
                    : 'Selecione uma data primeiro'}
              </option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="servico-agendamento">SERVIÇO:</label>
            <select id="servico-agendamento" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required disabled={loadingServices || services.length === 0}>
              <option value="">{loadingServices ? 'Carregando serviços...' : services.length === 0 ? 'Nenhum serviço disponível' : 'Selecione um serviço'}</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="price-display">
            Valor: <span>R$ {currentPrice},00</span>
          </div>
          <button type="submit" className="btn btn-confirm">CONFIRMAR AGENDAMENTO</button>
        </form>
      </div>
      <div className="appointment-image-placeholder">
        <img src="/logodeteladelogin.jpg" alt="Logo da Barbearia" />
      </div>
    </div>
  );
}

export default AppointmentPage;
