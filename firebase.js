import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB0g-nPJzqrg8zsYBIErPHhj33xI4mpkSw',
  authDomain: 'signin-160403.firebaseapp.com',
  databaseURL: 'https://signin-160403.firebaseio.com',
  projectId: 'signin-160403',
  storageBucket: 'signin-160403.appspot.com',
  messagingSenderId: '1063527434846',
  appId: '1:1063527434846:web:c62dbd3646cde0a6',
};
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
