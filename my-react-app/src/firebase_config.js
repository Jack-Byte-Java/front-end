
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {

    apiKey: "AIzaSyAjsjjF1po7dbXUq-Nr11j-7qicjliWlrA",
  
    authDomain: "backend-basics-d1569.firebaseapp.com",
  
    projectId: "backend-basics-d1569",
  
    storageBucket: "backend-basics-d1569.appspot.com",
  
    messagingSenderId: "834911012527",
  
    appId: "1:834911012527:web:c11b43a8078f34e2e5365a",
  
    measurementId: "G-B3BH1YH7PG"
  
  };
  

  
  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);

  export const storage = getStorage(app);

  export const auth = getAuth(app);