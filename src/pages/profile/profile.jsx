import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase/firebase-config';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import avatarsData from '../../data/avatars.json';
import './profile.scss';

const db = getFirestore();

function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [userPic, setUserPic] = useState('');
  const [hoveredAvatar, setHoveredAvatar] = useState(''); // New state for hovered avatar
  const [error, setError] = useState('');
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);
  const avatarGridRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setNickname(userData.name);
          setBio(userData.bio);
          setEmail(userData.email);
          setUserPic(userData.userPic);
        }
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const avatarGrid = document.querySelector('.avatar-grid');
    if (avatarGrid) {
      if (showAvatarGrid) {
        avatarGrid.style.maxHeight = '300px';
        avatarGrid.style.opacity = 1;
      } else {
        avatarGrid.style.maxHeight = '0';
        avatarGrid.style.opacity = 0;
      }
    }
  }, [showAvatarGrid]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarGridRef.current && !avatarGridRef.current.contains(event.target)) {
        setShowAvatarGrid(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [avatarGridRef]);

  const handleSave = async () => {
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          name: nickname,
          bio: bio,
          userPic: userPic
        });
        navigate('/my-page');
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      }
    }
  };

  const handleAvatarChange = async (avatarUrl) => {
    setUserPic(avatarUrl);
    setShowAvatarGrid(false);
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-grid">
        <div className="avatar-card">
          <div className="profile-pic">
            <img src={hoveredAvatar || userPic} alt="User Avatar" className="avatar-image" loading="lazy" />
          </div>
          <button className="change-avatar-button" onClick={() => setShowAvatarGrid(!showAvatarGrid)}>Change Avatar</button>
          <div className="avatar-grid" ref={avatarGridRef}>
            {avatarsData.avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index}`}
                onMouseEnter={() => setHoveredAvatar(avatar)}
                onMouseLeave={() => setHoveredAvatar('')}
                onClick={() => handleAvatarChange(avatar)}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="profile-info">
          <label>
            Nickname:
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ resize: 'none' }}
            />
          </label>
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ resize: 'none' }}
            />
          </label>
          <label>Email: {email}</label>
          {error && <p className="error">{error}</p>}
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;