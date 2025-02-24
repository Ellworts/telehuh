import React from 'react';

function UserMenu({ onLogout, onEditProfile }) {
  return (
    <div className="user-menu" style={{ position: 'absolute', top: '40px', right: '0', backgroundColor: '#282c34', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <div onClick={onEditProfile} style={{ cursor: 'pointer', marginBottom: '10px', fontSize: '0.8em', color: '#fff' }}>
        Edit Profile
      </div>
      <div onClick={onLogout} style={{ cursor: 'pointer', fontSize: '0.8em', color: '#fff' }}>
        Logout
      </div>
    </div>
  );
}

export default UserMenu;
