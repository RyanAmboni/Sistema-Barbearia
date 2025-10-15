import React from 'react';

function Header({ user, currentPage, setCurrentPage }) {
  const userInitial = user && user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className="header">
      <nav className="navbar">
        <div className="menu-buttons">
          <button className={currentPage === 'inicio' ? 'active' : ''} onClick={() => setCurrentPage('inicio')}>
            Início
          </button>
          <button className={currentPage === 'servicos' ? 'active' : ''} onClick={() => setCurrentPage('servicos')}>
            Serviços
          </button>
          <button className={currentPage === 'agendamento' ? 'active' : ''} onClick={() => setCurrentPage('agendamento')}>
            Agendamento
          </button>
          <button className={currentPage === 'meusHorarios' ? 'active' : ''} onClick={() => setCurrentPage('meusHorarios')}>
            Meus Horários
          </button>
        </div>
        <div className="user-icon" onClick={() => setCurrentPage('profile')}>
          <span>{userInitial}</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;