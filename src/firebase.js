import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig.js'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// IndexedDB (la persistance par défaut) plante avec "database is closing" sur Safari/iOS
// quand l'onglet passe en arrière-plan — localStorage est plus stable pour ce cas d'usage.
setPersistence(auth, browserLocalPersistence)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
