import React from 'react';
import UserInfo from './UserInfo';
import '../App.css';

function Header({ user }) {
  return (
    <header className="header">
      <UserInfo user={user} />
    </header>
  );
}

export default Header;
