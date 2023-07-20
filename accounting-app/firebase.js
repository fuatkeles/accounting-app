// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2PX1Oi8EHgLVjgR7snrXSj5oAgrKENoI",
  authDomain: "accounting-app-3faba.firebaseapp.com",
  projectId: "accounting-app-3faba",
  storageBucket: "accounting-app-3faba.appspot.com",
  messagingSenderId: "368535314470",
  appId: "1:368535314470:web:ada788f1b4969aef0306e7",
  measurementId: "G-HGB8E7GWJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db};