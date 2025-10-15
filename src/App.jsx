import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AppointmentPage from './pages/AppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function App() {
  const [appState, setAppState] = useState({
    isLoggedIn: false,
    currentPage: 'login',
    user: null,
  });

  const navigate = (page) => {
    setAppState(prevState => ({ ...prevState, currentPage: page }));
  };

  const handleLogin = (userData) => {
    setAppState({ isLoggedIn: true, currentPage: 'inicio', user: userData });
  };
  
  const handleLogout = () => {
    setAppState({ isLoggedIn: false, currentPage: 'login', user: null });
  };

  const renderContent = () => {
    const { isLoggedIn, currentPage, user } = appState;

    if (!isLoggedIn) {
      switch (currentPage) {
        case 'createAccount':
          return <CreateAccountPage onNavigate={navigate} />;
        case 'forgotPassword':
          return <ForgotPasswordPage onNavigate={navigate} />;
        default:
          return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      }
    }

    switch (currentPage) {
      case 'inicio':
        return <HomePage onNavigate={navigate} />;
      case 'servicos':
        return <ServicesPage onNavigate={navigate} />;
      case 'agendamento':
        return <AppointmentPage />;
      case 'meusHorarios':
        return <MyAppointmentsPage />;
      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {appState.isLoggedIn && <Header user={appState.user} currentPage={appState.currentPage} setCurrentPage={navigate} />}
      <main className="page-container">
        {renderContent()}
      </main>
    </>
  );
}

export default App;