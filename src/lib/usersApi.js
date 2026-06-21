import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { ACCESS_STATUS } from './constants';

// users/{uid}: { name, email, role: 'admin'|'user', accessStatus: 'pending'|'approved'|'rejected', createdAt }

export async function createUserProfile(uid, { name, email }) {
  const ref = doc(db, 'users', uid);
  // Первый зарегистрированный пользователь в системе автоматически становится администратором
  // и сразу получает доступ — иначе некому будет одобрять остальных.
  const usersSnap = await getDoc(doc(db, 'meta', 'usersCount'));
  const isFirstUser = !usersSnap.exists();

  await setDoc(ref, {
    name,
    email,
    role: isFirstUser ? 'admin' : 'user',
    accessStatus: isFirstUser ? ACCESS_STATUS.approved : ACCESS_STATUS.pending,
    createdAt: new Date().toISOString()
  });

  if (isFirstUser) {
    await setDoc(doc(db, 'meta', 'usersCount'), { initialized: true });
  }

  return isFirstUser;
}

export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeUserProfile(uid, callback) {
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export function subscribeAllUsers(callback) {
  const ref = collection(db, 'users');
  const q = query(ref, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function setUserAccessStatus(uid, accessStatus) {
  const ref = doc(db, 'users', uid);
  return updateDoc(ref, { accessStatus });
}

export async function setUserRole(uid, role) {
  const ref = doc(db, 'users', uid);
  return updateDoc(ref, { role });
}
