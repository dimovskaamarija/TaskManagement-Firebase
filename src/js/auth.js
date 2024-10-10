import { auth, app } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@firebase/auth';
import { setDoc, doc, getDoc, getFirestore } from '@firebase/firestore';

const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const signInButton = document.getElementById('signInButton');
    const signUpButton = document.getElementById('signUpButton');
    const signOutButton = document.getElementById('signOutButton');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (signInButton) signInButton.style.display = 'none';
            if (signUpButton) signUpButton.style.display = 'none';
            if (signOutButton) signOutButton.style.display = 'block';
        } else {
            if (signInButton) signInButton.style.display = 'block';
            if (signUpButton) signUpButton.style.display = 'block';
            if (signOutButton) signOutButton.style.display = 'none';
        }
    });

    if (signOutButton) {
        signOutButton.addEventListener('click', signOutUser);
    }
});

const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error.message);
    }
};


const signUp = async (event) => {
    event.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        await setDoc(doc(db, "users", user.uid), {
            email: email,
        });
        window.location.href = "../templates/signIn.html";
    } catch (error) {
        console.error("Error while registering user:", error.message);
    }
};


const signIn = async (event) => {
    console.log("start");
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data:", userData);
            window.location.href = '../templates/index.html';
        } else {
            console.error("No user document found!");
        }
    } catch (error) {
        console.error("Error signing in:", error.message);
        const confirmRedirect = window.confirm("No account found with provided credentials. Sign up first?");
        if (confirmRedirect) {
            window.location.href = '../templates/signUp.html';
        }
    }
};




document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById('signUpButtonClick');
    const signInButton = document.getElementById('signInButtonClick');

    signUpButton?.addEventListener('click', signUp);
    signInButton?.addEventListener('click', signIn);
});
