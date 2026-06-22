import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, subscribeUserProfile } from '../lib/usersApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = ещё загружается
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    setProfileLoading(true);
    const unsub = subscribeUserProfile(firebaseUser.uid, (p) => {
      setProfile(p);
      setProfileLoading(false);
    });
    return unsub;
  }, [firebaseUser]);

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(cred.user.uid, { name, email });
  }

  async function logout() {
    await firebaseSignOut(auth);
  }

  const value = {
    firebaseUser,
    profile,
    loading: firebaseUser === undefined || (!!firebaseUser && profileLoading),
    isAdmin: profile?.role === 'admin',
    isApproved: true,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return ctx;
}
