import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVY3KKc_cfgzAq27p7HDx2S69V7XKC46w",
  authDomain: "reservasi-meja.firebaseapp.com",
  projectId: "reservasi-meja",
  storageBucket: "reservasi-meja.firebasestorage.app",
  messagingSenderId: "732591078055",
  appId: "1:732591078055:web:178b70ae247733d259f982"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


