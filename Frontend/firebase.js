
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLL9visSHrnimnwnNAbd2Cgvdn_j01naU",
  authDomain: "interview-ai-95e37.firebaseapp.com",
  projectId: "interview-ai-95e37",
  storageBucket: "interview-ai-95e37.firebasestorage.app",
  messagingSenderId: "62482229169",
  appId: "1:62482229169:web:2a03ad10999455c560ff90",
  measurementId: "G-4Z7LX6FF6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup };
// const analytics = getAnalytics(app);