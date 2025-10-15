import React from 'react';
import { toast } from 'react-toastify';

function CreateAccountPage({ onNavigate }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success('Conta criada com sucesso!');
    onNavigate('login');
  };

  return (
    <div className="account-form-container">
      <h1>Criar Conta</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">NOME COMPLETO:</label>
          <input type="text" id="fullName" required />
        </div>
        <div className="form-group">
          <label htmlFor="dob">DATA NASCIMENTO:</label>
          <input type="date" id="dob" required />
        </div>
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input type="text" id="cpf" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-MAIL:</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">SENHA:</label>
          <input type="password" id="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">SEXO:</label>
          <select id="gender" required>
            <option value="">Selecione...</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Criar Conta</button>
          <a href="#" onClick={() => onNavigate('login')} className="back-link">Voltar para o Login</a>
        </div>
      </form>
    </div>
  );
}

export default CreateAccountPage;