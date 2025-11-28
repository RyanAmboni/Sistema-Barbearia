import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

function CreateAccountPage({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/api/auth/register', { name: fullName, email, password });
      toast.success('Conta criada com sucesso!');
      onNavigate('login');
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao criar conta.';
      
      if (err?.status === 409) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      } else if (err?.status === 400) {
        errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      } else if (err?.status === 500) {
        if (err?.error) {
          errorMessage = `Erro no servidor: ${err.error}`;
        } else if (err?.message && err.message.includes('configuration')) {
          errorMessage = 'Erro de configuração do servidor. Entre em contato com o suporte.';
        } else {
          errorMessage = 'Erro ao criar conta. Verifique sua conexão e tente novamente.';
        }
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error) {
        errorMessage = err.error;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="account-form-container">
      <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">NOME COMPLETO:</label>
          <input type="text" id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
          <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">SENHA:</label>
          <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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