import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebase-config';

const db = getFirestore();

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
    <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
      <div onClick={() => setShowLogout(!showLogout)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {userData.userPic && <img src={userData.userPic} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />}
        <span>{userData.name}</span>
      </div>
      <div className="logout-icon" onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '20px', fontSize: '0.8em', maxHeight: '0', overflow: 'hidden', transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out', opacity: 0, backgroundColor: '#282c34', padding: '5px', borderRadius: '5px' }}> 
        Logout
      </div>
    </div>
  );
}

export default UserInfo;
