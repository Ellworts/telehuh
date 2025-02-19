import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-config';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import avatarsData from '../../data/avatars.json';
import './profile.css';

const db = getFirestore();

function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [userPic, setUserPic] = useState('');
  const [error, setError] = useState('');
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);

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

  const handleSave = async () => {
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          name: nickname,
          bio: bio,
          userPic: userPic
        });
        window.location.reload(); // Reload the page after saving
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
      <div className="profile-pic">
        <img src={userPic} alt="User Avatar" />
        <button className="change-avatar-button" onClick={() => setShowAvatarGrid(!showAvatarGrid)}>Change Avatar</button>
        {showAvatarGrid && (
          <div className="avatar-grid">
            {avatarsData.avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index}`}
                onClick={() => handleAvatarChange(avatar)}
              />
            ))}
          </div>
        )}
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
  );
}

export default Profile;