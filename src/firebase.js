import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyBi61E2WvU4M9XlN_Ja--ul7o9TquyOxZA",
    authDomain: "quizwhiz-85d6a.firebaseapp.com",
    projectId: "quizwhiz-85d6a",
    storageBucket: "quizwhiz-85d6a.firebasestorage.app",
    messagingSenderId: "381318063030",
    appId: "1:381318063030:web:9b415ef30753889e701717",
    measurementId: "G-54Q1QE5KSW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);