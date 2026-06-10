import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9fP7NaKb9OWbxVZnPgeXmZoHCuQQJfBU",
  authDomain: "savant-trivia.firebaseapp.com",
  projectId: "savant-trivia",
  storageBucket: "savant-trivia.firebasestorage.app",
  messagingSenderId: "458812844849",
  appId: "1:458812844849:web:9b138df55ab01425579e10",
  measurementId: "G-FC3WM1DHNW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
