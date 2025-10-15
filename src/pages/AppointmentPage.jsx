import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';

const services = [
  { name: 'Cabelo', price: 40 },
  { name: 'Barba', price: 20 },
  { name: 'Cabelo + Barba', price: 55 },
  { name: 'Sobrancelha', price: 15 },
  { name: 'Cabelo + Sobrancelha', price: 50 },
  { name: 'Barba + Sobrancelha', price: 30 },
  { name: 'Barba + Sobrancelha + Cabelo', price: 65 },
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
  const [selectedService, setSelectedService] = useState('');

  const timeSlots = useMemo(() => generateTimeSlots(date), [date]);
  
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate.getUTCDay() === 0) {
      toast.error('Agendamentos não estão disponíveis aos domingos.');
      setDate('');
    } else {
      setDate(e.target.value);
    }
    setTime('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const serviceDetails = services.find(s => s.name === selectedService);
    if (!date || !time || !serviceDetails) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    toast.success(`Agendamento de ${serviceDetails.name} confirmado!`);
    setDate('');
    setTime('');
    setSelectedService('');
  };

  const currentPrice = services.find(s => s.name === selectedService)?.price || 0;
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
            <select id="horario-disponivel" value={time} onChange={(e) => setTime(e.target.value)} required disabled={!date}>
              <option value="">{date ? 'Selecione um horário' : 'Selecione uma data primeiro'}</option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="servico-agendamento">SERVIÇO:</label>
            <select id="servico-agendamento" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
              <option value="">Selecione um serviço</option>
              {services.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="price-display">
            Valor: <span>R$ {currentPrice},00</span>
          </div>
          <button type="submit" className="btn btn-confirm">CONFIRMAR AGENDAMENTO</button>
        </form>
      </div>
      <div className="appointment-image-placeholder">
        <svg viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
    </div>
  );
}

export default AppointmentPage;