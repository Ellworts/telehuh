import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import './App.css';
import AuthForm from './pages/auth/auth-page';
import Profile from './pages/profile/profile';
import Header from './components/Header'; // Import Header component


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header user={user} />} {/* Use Header component */}
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/edit" element={isAuthenticated ? <Profile /> : <AuthForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
