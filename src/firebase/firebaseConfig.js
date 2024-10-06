import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyA6sE3ieYtNmyqZX_RUBYqaWljOIBeuANQ",
    authDomain: "task-management-b3e57.firebaseapp.com",
    projectId: "task-management-b3e57",
    storageBucket: "task-management-b3e57.appspot.com",
    messagingSenderId: "214664072144",
    appId: "1:214664072144:web:2840cc0f9d99a6b93087d5"
};
const app=initializeApp(firebaseConfig)
const auth=getAuth(app)
export {app,auth};
