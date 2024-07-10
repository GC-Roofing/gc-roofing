import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { 
    getFunctions, 
    connectFunctionsEmulator 
} from 'firebase/functions';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSlceUnKSpUNjQaaQuBOPKsMX9iSP5hfE",
    authDomain: "gc-roofing.firebaseapp.com",
    projectId: "gc-roofing",
    storageBucket: "gc-roofing.appspot.com",
    messagingSenderId: "219394137012",
    appId: "1:219394137012:web:bba23d5827c9fa8eb4f0e1",
    measurementId: "G-XKEHW2RCRB"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);


export default firebase;
export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);
export const functions = getFunctions(firebase);


connectFunctionsEmulator(functions, "127.0.0.1", 5001);