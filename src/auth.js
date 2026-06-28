import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export let currentUser = null;

export function initAuthListener(onUserChangedCallback) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        onUserChangedCallback(user);
    });
}

export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Registration Error: ", error.message);
        throw error;
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error: ", error.message);
        throw error;
    }
}

export async function logoutUser() {
    await signOut(auth);
}