import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import './App.scss';
import AuthForm from './pages/auth/auth-page';
import Profile from './pages/profile/profile';
import Header from './components/Header'; // Import Header component
import MyPage from './pages/my-page/my-page';


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
        {isAuthenticated && <Header user={user} />}
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/my-page" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyPage /></PrivateRoute>} />
          <Route path='/edit' element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default App;
