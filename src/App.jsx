import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './App.css';
import AuthForm from './pages/auth/auth-page';
import Profile from './pages/profile/profile';

const db = getFirestore();

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
        {isAuthenticated && <UserInfo user={user} />}
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/edit" element={isAuthenticated ? <Profile /> : <AuthForm />} />
        </Routes>
      </div>
    </Router>
  );
}

function UserInfo({ user }) {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const logoutIcon = document.querySelector('.logout-icon');
    if (logoutIcon) {
      if (showLogout) {
        logoutIcon.style.maxHeight = '20px';
        logoutIcon.style.opacity = 1;
      } else {
        logoutIcon.style.maxHeight = '0';
        logoutIcon.style.opacity = 0;
      }
    }
  }, [showLogout]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="user-info" style={{ position: 'absolute', top: '10px', right: '25px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div onClick={() => setShowLogout(!showLogout)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {userData.userPic && <img src={userData.userPic} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />}
        <span>{userData.name}</span>
      </div>
      <div className="logout-icon" onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '40px', fontSize: '0.8em', maxHeight: '0', overflow: 'hidden', transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out', opacity: 0 }}>
        Logout
      </div>
    </div>
  );
}

export default App;
