import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcOf5no9siqruMlbxLiuvWmM16EawUYO8",
  authDomain: "shopping-haul.firebaseapp.com",
  projectId: "shopping-haul",
  storageBucket: "shopping-haul.firebasestorage.app",
  messagingSenderId: "567597990431",
  appId: "1:567597990431:web:38d1ffac72eda23407cb2a",
  measurementId: "G-JGHK49J06G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
