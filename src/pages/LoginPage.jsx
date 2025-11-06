import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.94 5.94 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288.822.822.083.083.083.083a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829zm-3.175.707.707.707.083.083a3.5 3.5 0 0 0 4.474 4.474l.823-.823a2.5 2.5 0 0 1-2.829-2.829l-.822-.822-.083-.083z"/>
    <path d="M.53 1.47a.5.5 0 0 1 .707 0l14 14a.5.5 0 0 1-.707.707l-14-14a.5.5 0 0 1 0-.707z"/>
  </svg>
);

function LoginPage({ onLogin, onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/api/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login realizado');
        onLogin(data.user || {});
      }
    } catch (err) {
      toast.error(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="login-layout">
      <div className="login-image-placeholder">
        <svg viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
      <div className="login-form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-MAIL:</label>
            <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">SENHA:</label>
            <div className="password-wrapper">
              <input type={showPassword ? 'text' : 'password'} id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <a href="#" onClick={() => onNavigate('forgotPassword')} className="forgot-password">Esqueceu a senha?</a>
          <div className="form-actions">
            {/* A MUDANÇA FOI AQUI: de btn-primary para btn-red */}
            <button type="submit" className="btn btn-red">Entrar</button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('createAccount')}>
              Crie sua conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;