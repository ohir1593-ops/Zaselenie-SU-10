import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ВАЖНО: замените значения ниже на конфигурацию вашего проекта Firebase.
// Найти их можно в Firebase Console -> Настройки проекта -> Общие -> Ваши приложения -> SDK setup and configuration.
const firebaseConfig = {
  apiKey: 'ВАШ_API_KEY',
  authDomain: 'ВАШ_PROJECT_ID.firebaseapp.com',
  projectId: 'ВАШ_PROJECT_ID',
  storageBucket: 'ВАШ_PROJECT_ID.appspot.com',
  messagingSenderId: 'ВАШ_SENDER_ID',
  appId: 'ВАШ_APP_ID'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
