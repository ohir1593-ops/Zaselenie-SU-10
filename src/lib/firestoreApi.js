import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

// Структура Firestore:
// projects/{projectId}                          — объект (ЖК)
// projects/{projectId}/corpuses/{corpusId}       — корпус
// projects/{projectId}/units/{unitId}            — помещение (плоская коллекция с полем corpusId для быстрой выборки)
// users/{uid}                                    — профиль пользователя, роль, статус доступа

export function subscribeCorpuses(projectId, callback) {
  const ref = collection(db, 'projects', projectId, 'corpuses');
  const q = query(ref, orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export function subscribeUnits(projectId, callback) {
  const ref = collection(db, 'projects', projectId, 'units');
  return onSnapshot(ref, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function createCorpus(projectId, name, isParking = false) {
  const ref = collection(db, 'projects', projectId, 'corpuses');
  const existing = await getDocs(ref);
  const order = existing.size;
  return addDoc(ref, {
    name,
    isParking,
    order,
    createdAt: serverTimestamp()
  });
}

export async function renameCorpus(projectId, corpusId, name) {
  const ref = doc(db, 'projects', projectId, 'corpuses', corpusId);
  return updateDoc(ref, { name });
}

export async function deleteCorpus(projectId, corpusId) {
  // Удаляем корпус и все его помещения батчем
  const batch = writeBatch(db);
  const corpusRef = doc(db, 'projects', projectId, 'corpuses', corpusId);
  batch.delete(corpusRef);

  const unitsRef = collection(db, 'projects', projectId, 'units');
  const snap = await getDocs(unitsRef);
  snap.docs.forEach((d) => {
    if (d.data().corpusId === corpusId) {
      batch.delete(d.ref);
    }
  });

  return batch.commit();
}

export async function addUnit(projectId, unit) {
  const ref = collection(db, 'projects', projectId, 'units');
  return addDoc(ref, {
    ...unit,
    status: unit.status || 'not_done',
    comment: unit.comment || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateUnit(projectId, unitId, patch) {
  const ref = doc(db, 'projects', projectId, 'units', unitId);
  return updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteUnit(projectId, unitId) {
  const ref = doc(db, 'projects', projectId, 'units', unitId);
  return deleteDoc(ref);
}

export async function deleteFloor(projectId, corpusId, floor) {
  const unitsRef = collection(db, 'projects', projectId, 'units');
  const snap = await getDocs(unitsRef);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.corpusId === corpusId && data.floor === floor) {
      batch.delete(d.ref);
    }
  });
  return batch.commit();
}

export async function ensureProjectExists(projectId, name) {
  const ref = doc(db, 'projects', projectId);
  return setDoc(ref, { name, createdAt: serverTimestamp() }, { merge: true });
}
