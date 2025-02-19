import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import './App.css';
import AuthForm from './pages/auth/auth-page';
import Profile from './pages/profile/profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <LogoutIcon />}
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <AuthForm />} />
        </Routes>
      </div>
    </Router>
  );
}

function LogoutIcon() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="logout-icon" onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/logout/logout-original.svg" alt="Logout" style={{ width: '26px', height: '26px' }} />
    </div>
  );
}

export default App;
