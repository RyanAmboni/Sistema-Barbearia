import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function ProfilePage({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    toast.success('Senha alterada com sucesso!');
    setIsChangingPassword(false);
  };

  const ActiveForm = () => {
    if (isEditing) {
      return (
        <form onSubmit={handleProfileSave} className="profile-form">
          <h3>Editar Perfil</h3>
          <div className="form-group">
            <label htmlFor="name">NOME:</label>
            <input type="text" id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">EMAIL:</label>
            <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} />
          </div>
          <div className="form-actions-profile">
            <button type="submit" className="btn btn-red">Salvar Alterações</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </form>
      );
    }
    if (isChangingPassword) {
      return (
        <form onSubmit={handlePasswordSave} className="profile-form">
          <h3>Alterar Senha</h3>
          <div className="form-group">
            <label htmlFor="currentPassword">SENHA ATUAL:</label>
            <input type="password" id="currentPassword" required />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">NOVA SENHA:</label>
            <input type="password" id="newPassword" required />
          </div>
          <div className="form-actions-profile">
            <button type="submit" className="btn btn-red">Salvar Senha</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsChangingPassword(false)}>Cancelar</button>
          </div>
        </form>
      );
    }
    return null;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{profileData.name.charAt(0)}</div>
        <h2>{profileData.name}</h2>
        <p>{profileData.email}</p>
      </div>

      <div className="profile-body">
        {isEditing || isChangingPassword ? (
          <ActiveForm />
        ) : (
          <div className="profile-menu">
            <button className="btn-profile-action" onClick={() => setIsEditing(true)}>Editar Perfil</button>
            <button className="btn-profile-action" onClick={() => setIsChangingPassword(true)}>Alterar Senha</button>
            <div className="appointment-summary">
              <p><strong>Próximo Agendamento:</strong> 15/10/2025 - 18:30 (Cabelo+Barba)</p>
            </div>
            <button className="btn btn-logout" onClick={onLogout}>Sair da Conta</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;