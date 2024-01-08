import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBttQ7njK3U7wjYPRyA_WEm62_CcTJYuF0",
  authDomain: "sistemachamado-33b5a.firebaseapp.com",
  projectId: "sistemachamado-33b5a",
  storageBucket: "sistemachamado-33b5a.appspot.com",
  messagingSenderId: "23292644027",
  appId: "1:23292644027:web:a6ca3e460b498d09c8f79e",
  measurementId: "G-EDB4PQLY35"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);



export { auth, db, storage }