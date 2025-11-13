import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage,getDownloadURL,ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
//import { getDownloadURL, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCpApyK7ta7U8TKeQi6xv02XxheAatFgRM",
  authDomain: "creaty-media-eb176.firebaseapp.com",
  projectId: "creaty-media-eb176",
  storageBucket: "creaty-media-eb176.appspot.com",
  messagingSenderId: "789237885873",
  appId: "1:789237885873:web:9b7e86aa3075362c152b90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();

export const db = getFirestore(app);
export {getDownloadURL};

