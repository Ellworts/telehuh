import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8Uwh4TA7khrJz-F5qdPgE0OGjYdti6I4",
  authDomain: "huhcord.firebaseapp.com",
  projectId: "huhcord",
  storageBucket: "huhcord.appspot.com",
  messagingSenderId: "729933104215",
  appId: "1:729933104215:web:4a2ac250743bc241604f12",
  measurementId: "G-Y578EZCP98"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);



// Экспорты сервисов
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);