// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Для аутентификации
import { getAnalytics } from "firebase/analytics"; // Для аналитики (если нужна)

const firebaseConfig = {
  apiKey: "AIzaSyC8Uwh4TA7khrJz-F5qdPgE0OGjYdti6I4",
  authDomain: "huhcord.firebaseapp.com",
  projectId: "huhcord",
  storageBucket: "huhcord.firebasestorage.app",
  messagingSenderId: "729933104215",
  appId: "1:729933104215:web:4a2ac250743bc241604f12",
  measurementId: "G-Y578EZCP98"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Инициализация аутентификации
const auth = getAuth(app);

// Если нужна аналитика
const analytics = getAnalytics(app);

// Экспортируем объекты, чтобы использовать их в других файлах
export { auth, analytics };
