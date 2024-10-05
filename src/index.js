import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA6sE3ieYtNmyqZX_RUBYqaWljOIBeuANQ",
    authDomain: "task-management-b3e57.firebaseapp.com",
    projectId: "task-management-b3e57",
    storageBucket: "task-management-b3e57.appspot.com",
    messagingSenderId: "214664072144",
    appId: "1:214664072144:web:2840cc0f9d99a6b93087d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let todo = document.getElementById("toDoList");
let inProgress = document.getElementById("inProgressList");
let done = document.getElementById("doneList");
let addTaskButton = document.getElementById("addTaskButton");
let input = document.getElementById("addInput");
let containers = document.querySelectorAll(".container-item")

loadContent();

async function loadContent() {
    todo.innerHTML = ""
    inProgress.innerHTML = ""
    done.innerHTML = ""
    try {
        const toDoSnapshot = await getDocs(collection(db, "ToDo"))
        toDoSnapshot.forEach(doc => {
            const taskValue = doc.data().task
            addNewTask(taskValue, todo, doc.id, "ToDo")
        });
        const inProgressSnapsot = await getDocs(collection(db, "InProgress"))
        inProgressSnapsot.forEach(doc => {
            const taskValue = doc.data().task
            addNewTask(taskValue, inProgress, doc.id, "InProgress")
        });
        const doneSnapshot = await getDocs(collection(db, "Done"))
        doneSnapshot.forEach(doc => {
            const taskValue = doc.data().task
            addNewTask(taskValue, done, doc.id, "Done")
        })
    } catch (error) {
        console.error("Error loading data: ", error);
    }
}

async function addTaskToFirestore(taskValue) {
    try {
        await addDoc(collection(db, "ToDo"), {
            task: taskValue,
        })
        loadContent()
    } catch (error) {
        console.error("Error adding task in database: ", error)
    }
}

async function deleteTaskFromFirestore(taskId, collectionName) {
    try {
        await deleteDoc(doc(db, collectionName, taskId))
        loadContent()
    } catch (error) {
        console.error("Error deleting task from database: ", error)
    }
}

async function addNewTask(taskValue, state, docId, collectionName) {
    const newTask = document.createElement("li")
    newTask.classList.add("task")
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = taskValue;
    const btn = document.createElement("button")
    btn.classList.add("btnDelete")
    btn.innerText = "Delete"
    btn.addEventListener("click", async function (e) {
        e.preventDefault()
        await deleteTaskFromFirestore(docId, collectionName)
        newTask.remove()
    })
    newTask.appendChild(btn)
    newTask.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text", docId)
        e.dataTransfer.setData("collection", collectionName)
        newTask.classList.add("dragStyle")
    })
    newTask.addEventListener("dragend", function () {
        newTask.classList.remove("dragStyle")
    })
    state.appendChild(newTask)
}

addTaskButton.addEventListener("click", async function (e) {
    e.preventDefault()
    const value = input.value
    if (!value) {
        return
    }
    await addTaskToFirestore(value)
    input.value = ""
})

containers.forEach(container => {
    container.addEventListener("dragover", function (e) {
        e.preventDefault()
    })
    container.addEventListener("drop", async function (e) {
        e.preventDefault()
        let draggedElement = document.querySelector(".dragStyle")
        if (draggedElement) {
            const taskId = e.dataTransfer.getData("text")
            const oldCollectionName = e.dataTransfer.getData("collection")
            const ulList = container.querySelector("ul")
            const updatedCollectionName = ulList.dataset.collection
            if (oldCollectionName !== updatedCollectionName) {
                const taskValue = draggedElement.innerText.replace("Delete", "").trim()
                await deleteTaskFromFirestore(taskId, oldCollectionName)
                await addDoc(collection(db, updatedCollectionName), { task: taskValue })
                
            }
        }
    })
})
const signOutUser = async () => {
    try {
        await signOut(auth);

    } catch (error) {
        console.error("Error signing out:", error.message);
    }
}
const signOutButton = document.getElementById('signOutButton');
signOutButton.addEventListener('click', signOutUser);