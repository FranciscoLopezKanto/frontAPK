import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyCuQh82lh4y32yr0wz03bczu1PASQvTfT8",
  authDomain: "nativeauth-2a8df.firebaseapp.com",
  projectId: "nativeauth-2a8df",
  storageBucket: "nativeauth-2a8df.appspot.com",
  messagingSenderId: "724105287735",
  appId: "1:724105287735:web:22b61460c4fc305d7d07b2",
  measurementId: "G-DHC4TC6VWE"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
