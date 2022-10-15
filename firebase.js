// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAONHNqnzwwAgQfcmp5jr_kgt15bTEtUfQ",
  authDomain: "fishdoc-337de.firebaseapp.com",
  projectId: "fishdoc-337de",
  storageBucket: "fishdoc-337de.appspot.com",
  messagingSenderId: "189028634790",
  appId: "1:189028634790:web:11742d81b78dc2dd3d6467"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else{
    app = firebase.app();
}

const auth = firebase.auth();

export { auth, firebase };