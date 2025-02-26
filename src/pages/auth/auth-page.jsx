import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './auth-page.scss';

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
        navigate('/my-page');
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
          userPic: 'https://i.imgur.com/sgrdLah.jpeg'
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
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
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