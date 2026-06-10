import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

export async function registerUser(email, password, displayName, role) {
  const validRole = (role === "commissioner") ? "commissioner" : "player";
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  const userData = {
    displayName: displayName,
    email: email,
    role: validRole,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, "users", uid), userData);
  const verify = await getDoc(doc(db, "users", uid));
  if (!verify.exists() || verify.data().role !== validRole) {
    await setDoc(doc(db, "users", uid), userData);
  }
  return cred.user;
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? { uid: user.uid, ...snap.data() } : null;
}

export function onAuthReady(callback) {
  onAuthStateChanged(auth, callback);
}

export function requireAuth(redirectTo = "index.html") {
  onAuthStateChanged(auth, user => {
    if (!user) window.location.href = redirectTo;
  });
}

export function requireCommissioner() {
  onAuthStateChanged(auth, async user => {
    if (!user) { window.location.href = "index.html"; return; }
    const profile = await getCurrentUserProfile();
    if (!profile || profile.role !== "commissioner") {
      window.location.href = "dashboard.html";
    }
  });
}
