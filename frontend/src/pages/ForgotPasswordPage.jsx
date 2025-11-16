import React from 'react';
import { toast } from 'react-toastify';

function ForgotPasswordPage({ onNavigate }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    toast.info('Um link de recuperação foi enviado para o seu e-mail.');
    onNavigate('login');
  };

  return (
    <div className="account-form-container">
      <h1>Recuperar Senha</h1>
      <p className="form-description">Digite seu e-mail para receber um link de recuperação.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-MAIL:</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Enviar Link</button>
          <a href="#" onClick={() => onNavigate('login')} className="back-link">Voltar para o Login</a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;