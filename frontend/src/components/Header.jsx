import React from "react";

function Header({
  user,
  currentPage,
  setCurrentPage,
  activeModule,
  setActiveModule,
}) {
  const userInitial =
    user && user.name ? user.name.charAt(0).toUpperCase() : "?";
  const isBarbeiro = user && user.role === "barbeiro";
  const isBarbeiroPage = currentPage === "horariosBarbeiro";

  return (
    <header className="header">
      <nav className="navbar">
        {!isBarbeiro && (
          <div className="menu-buttons">
            <button
              className={currentPage === "inicio" ? "active" : ""}
              onClick={() => setCurrentPage("inicio")}
            >
              Início
            </button>
            <button
              className={currentPage === "servicos" ? "active" : ""}
              onClick={() => setCurrentPage("servicos")}
            >
              Serviços
            </button>
            <button
              className={currentPage === "agendamento" ? "active" : ""}
              onClick={() => setCurrentPage("agendamento")}
            >
              Agendamento
            </button>
            <button
              className={currentPage === "meusHorarios" ? "active" : ""}
              onClick={() => setCurrentPage("meusHorarios")}
            >
              Meus Horários
            </button>
          </div>
        )}
        <div className="user-icon" onClick={() => setCurrentPage("profile")}>
          <span>{userInitial}</span>
        </div>
      </nav>
      {isBarbeiro && isBarbeiroPage && (
        <div className="module-tabs-header">
          <button
            className={`module-tab-header ${
              activeModule === "agenda" ? "active" : ""
            }`}
            onClick={() => setActiveModule("agenda")}
          >
            AGENDA
          </button>
          {/* Adicionar mais módulos aqui no futuro */}
        </div>
      )}
    </header>
  );
}

export default Header;
