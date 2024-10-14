import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { app, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(app);
let todo = document.getElementById("toDoList");
let inProgress = document.getElementById("inProgressList");
let done = document.getElementById("doneList");
let addTaskButton = document.getElementById("addTaskButton");
let input = document.getElementById("addInput");
let containers = document.querySelectorAll(".container-item");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadContent(user.uid);
    } else {
        console.error("User not signed in");
    }
});

async function loadContent(userId) {
    todo.innerHTML = "";
    inProgress.innerHTML = "";
    done.innerHTML = "";

    const toDoQuery = query(collection(db, "ToDo"), where("userId", "==", userId));
    const inProgressQuery = query(collection(db, "InProgress"), where("userId", "==", userId));
    const doneQuery = query(collection(db, "Done"), where("userId", "==", userId));

    try {
        const toDoSnapshot = await getDocs(toDoQuery);
        toDoSnapshot.forEach(doc => {
            const taskValue = doc.data().task;
            addNewTask(taskValue, todo, doc.id, "ToDo");
        });

        const inProgressSnapshot = await getDocs(inProgressQuery);
        inProgressSnapshot.forEach(doc => {
            const taskValue = doc.data().task;
            addNewTask(taskValue, inProgress, doc.id, "InProgress");
        });

        const doneSnapshot = await getDocs(doneQuery);
        doneSnapshot.forEach(doc => {
            const taskValue = doc.data().task;
            addNewTask(taskValue, done, doc.id, "Done");
        });
    } catch (error) {
        console.error("Error loading data: ", error);
    }
}

async function addTaskToFirestore(taskValue) {
    const currentUser = auth.currentUser;
    try {
        await addDoc(collection(db, "ToDo"), {
            task: taskValue,
            userId: currentUser.uid
        });
        loadContent(currentUser.uid);
    } catch (error) {
        console.error("Error adding task in database: ", error);
    }
}

async function deleteTaskFromFirestore(taskId, collectionName) {
    try {
        await deleteDoc(doc(db, collectionName, taskId));
        loadContent(auth.currentUser.uid);
    } catch (error) {
        console.error("Error deleting task from database: ", error);
    }
}

async function addNewTask(taskValue, state, docId, collectionName) {
    const newTask = document.createElement("li");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = taskValue;
    const btn = document.createElement("button");
    btn.classList.add("btnDelete");
    btn.innerText = "Delete";
    btn.addEventListener("click", async function (e) {
        e.preventDefault();
        await deleteTaskFromFirestore(docId, collectionName);
        newTask.remove();
    });
    newTask.appendChild(btn);
    newTask.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text", docId);
        e.dataTransfer.setData("collection", collectionName);
        newTask.classList.add("dragStyle");
    });
    newTask.addEventListener("dragend", function () {
        newTask.classList.remove("dragStyle");
    });
    state.appendChild(newTask);
}

addTaskButton.addEventListener("click", async function (e) {
    e.preventDefault();
    const value = input.value;
    if (!value) {
        return;
    }
    await addTaskToFirestore(value);
    input.value = "";
});

containers.forEach(container => {
    container.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
    container.addEventListener("drop", async function (e) {
        e.preventDefault();
        let draggedElement = document.querySelector(".dragStyle");
        if (draggedElement) {
            const taskId = e.dataTransfer.getData("text");
            const oldCollectionName = e.dataTransfer.getData("collection");
            const ulList = container.querySelector("ul");
            const updatedCollectionName = ulList.dataset.collection;
            if (oldCollectionName !== updatedCollectionName) {
                const taskValue = draggedElement.innerText.replace("Delete", "").trim();
                await deleteTaskFromFirestore(taskId, oldCollectionName);
                await addDoc(collection(db, updatedCollectionName), { task: taskValue, userId: auth.currentUser.uid });
            }
        }
    });
});
