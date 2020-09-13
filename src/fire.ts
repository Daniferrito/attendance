import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
var config = {
  apiKey: "AIzaSyBO1d9Cf43kzt4URJd65mQzUC8PZwewSBI",
  authDomain: "pasar-lista-75130.firebaseapp.com",
  databaseURL: "https://pasar-lista-75130.firebaseio.com",
  projectId: "pasar-lista-75130",
  storageBucket: "pasar-lista-75130.appspot.com",
  messagingSenderId: "292935936585",
  appId: "1:292935936585:web:26fa7a101a07cecb33ed98",
  measurementId: "G-TNTQPQE38K",
};
var fire = firebase.initializeApp(config);
export default fire;
