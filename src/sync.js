import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from './firebase.js'

export function signIn() {
  return signInWithPopup(auth, googleProvider)
}

export function signOutUser() {
  return signOut(auth)
}

function stateDocRef(uid) {
  return doc(db, 'users', uid, 'data', 'main')
}

// Écoute les changements distants (déclenché aussi depuis d'autres appareils connectés
// au même compte). Retourne la fonction pour se désabonner.
export function subscribeToState(uid, callback) {
  return onSnapshot(stateDocRef(uid), (snap) => {
    callback(snap.exists() ? snap.data() : null)
  })
}

export function pushState(uid, state) {
  return setDoc(stateDocRef(uid), state)
}
