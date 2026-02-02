import firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyD1MvNhzmvN2sPXduJDdmOEjXgxnbAa1qk",
    authDomain: "gits-lintasarta.firebaseapp.com",
    databaseURL: "https://gits-lintasarta.firebaseio.com",
    projectId: "gits-lintasarta",
    storageBucket: "gits-lintasarta.appspot.com",
    messagingSenderId: "982939032240",
    appId: "1:982939032240:web:45d36e7f08f0e77c4eb975"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const db = firebase.firestore()
  const createuser = firebase.initializeApp(firebaseConfig,'createuser')
  const authCreate = firebase.auth(createuser)
  export {
      auth,
      db,
      authCreate
  }