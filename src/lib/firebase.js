// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD39X4dYEPfeVnl4tzsZPsjtYBPza7J0oI",
  authDomain: "sitechs-tasks.firebaseapp.com",
  projectId: "sitechs-tasks",
  storageBucket: "sitechs-tasks.firebasestorage.app",
  messagingSenderId: "500155414880",
  appId: "1:500155414880:web:ef8ff27ed7cf7fb8224605",
  measurementId: "G-C1YK426TM7"
};

// בדיקה אם אנחנו בסביבת דפדפן
let app, auth, db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  console.log("Using mock Firebase services");
  // מוק לשירותי פיירבייס
  app = null;
  auth = null;
  db = null;
}

export { auth, db };
export default app;