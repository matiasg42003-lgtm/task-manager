
import { useState } from 'react';
import './App.css';

import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <main className="auth-page">
        <p role="status">Comprobando sesión...</p>
      </main>
    );
  }

  if (user) {
    return <TasksPage />;
  }

  if (showRegister) {
    return (
      <RegisterPage
        onSwitchToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <LoginPage
      onSwitchToRegister={() => setShowRegister(true)}
    />
  );
}

export default App;
