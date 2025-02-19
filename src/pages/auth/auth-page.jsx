import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './auth-page.css';

const db = getFirestore();

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/edit');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const createUserDocument = async (user, isGoogleSignIn = false) => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          name: isGoogleSignIn ? user.displayName : user.email,
          bio: '',
          email: user.email,
          userPic: 'https://cdn.discordapp.com/attachments/1190422512153133187/1341814821552918549/default-avatar.jpg?ex=67b75def&is=67b60c6f&hm=ebb4825cdc90635b046b924a384f94b7659160bf9a63f2d425fd39671c831122&'
        });
      }
    } catch (err) {
      console.error("Error creating user document:", err);
      setError("Failed to create user document");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user);
      window.location.reload(); // Reload the page after login
    } catch (err) {
      console.error("Error during login:", err);
      setError('Invalid email/password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user);
      window.location.reload(); // Reload the page after registration
    } catch (err) {
      console.error("Error during registration:", err);
      setError('Invalid email/password');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await createUserDocument(userCredential.user, true);
      window.location.reload(); // Reload the page after Google sign-in
    } catch (err) {
      console.error("Error during Google sign-in:", err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="background"></div>
      <div className="auth-container">
        {isRegistering ? (
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Register</button>
            <button type="button" onClick={() => setIsRegistering(false)}>Already have an account? Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
            <button type="button" onClick={() => setIsRegistering(true)}>New here? Register</button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div onClick={handleGoogleSignIn} style={{ cursor: 'pointer' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" alt="Google Sign In" style={{ width: '26px', height: '26px' }} />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthForm;