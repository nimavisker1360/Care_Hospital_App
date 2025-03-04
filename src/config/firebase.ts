import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC6YwRlm4b8XZgp8I5DickMULUIJc5Hv5Q",
  authDomain: "shey-hospital-n.firebaseapp.com",
  projectId: "shey-hospital-n",
  storageBucket: "shey-hospital-n.appspot.com",
  messagingSenderId: "850100876158",
  appId: "1:850100876158:web:a3f51af4549b5a3333392f",
  measurementId: "G-8GK7HPC6RQ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
