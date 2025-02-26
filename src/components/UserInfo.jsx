import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebase-config';
import UserMenu from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';

const db = getFirestore();

function UserInfo({ user }) {
  const [showMenu, setShowMenu] = useState(false);
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

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
    setShowMenu(false);
  };

  const editProfile = () => {
    navigate('/edit');
    setShowMenu(false);
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="user-info" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div onClick={() => setShowMenu(!showMenu)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        {userData.userPic && <img src={userData.userPic} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />}
        <span>{userData.name}</span>
      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 100, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UserMenu onLogout={handleLogout} onEditProfile={editProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserInfo;
