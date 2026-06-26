let tasks = [];

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const saveStatus = document.getElementById("save-status");

window.addEventListener("DOMContentLoaded", () => {
    tasks = JSON.parse(localStorage.getItem("dashboard_tasks")) || [];
    renderTasks();
    restoreNotes();

    noteTitle.addEventListener("input", saveNotes);
    noteBody.addEventListener("input", saveNotes);
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        done: false
    };

    tasks.push(newTask);
    syncTaskStorage();
    taskInput.value = "";
});

taskList.addEventListener("click", (e) => {
    const liRow = e.target.closest("li");
    if (!liRow) return;
    
    const targetId = Number(liRow.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== targetId);
        syncTaskStorage();
    } 
    else if (e.target.classList.contains("task-checkbox")) {
        const selectedTask = tasks.find(t => t.id === targetId);
        if (selectedTask) {
            selectedTask.done = e.target.checked;
            syncTaskStorage();
        }
    }
});

function renderTasks() {
    taskList.innerHTML = "";
    
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center p-3 bg-slate-900 border border-slate-700 rounded-lg gap-2";
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
                <input type="checkbox" class="task-checkbox w-4 h-4 rounded bg-slate-800 border-slate-600 checked:bg-cyan-500 cursor-pointer" ${task.done ? "checked" : ""}>
                <span class="text-sm truncate ${task.done ? "line-through text-slate-500" : "text-slate-200"}">${task.text}</span>
            </div>
            <button class="delete-btn text-xs text-red-400 hover:text-red-300 font-bold tracking-wide transition shrink-0">Delete</button>
        `;
        taskList.appendChild(li);
    });

    updateCounters();
}

function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    
    document.getElementById("tasks-done").textContent = completed;
    document.getElementById("tasks-total").textContent = total;
}

function syncTaskStorage() {
    localStorage.setItem("dashboard_tasks", JSON.stringify(tasks));
    renderTasks();
}

function saveNotes() {
    saveStatus.textContent = "Saving...";
    
    localStorage.setItem("note_title_data", noteTitle.innerText);
    localStorage.setItem("note_body_data", noteBody.innerText);
    
    setTimeout(() => {
        saveStatus.textContent = "Saved";
    }, 400);
}

function restoreNotes() {
    const savedTitle = localStorage.getItem("note_title_data");
    const savedBody = localStorage.getItem("note_body_data");
    
    if (savedTitle !== null) {
        noteTitle.innerText = savedTitle;
    } else {
        noteTitle.innerText = "Untitled Note";
    }

    if (savedBody !== null) {
        noteBody.innerText = savedBody;
    } else {
        noteBody.innerText = "Write assignment briefs or ideas here...";
    }

    noteTitle.addEventListener("focus", () => {
        if (noteTitle.innerText === "Untitled Note") {
            noteTitle.innerText = "";
        }
    });

    noteBody.addEventListener("focus", () => {
        if (noteBody.innerText === "Write assignment briefs or ideas here...") {
            noteBody.innerText = "";
        }
    });

    noteTitle.addEventListener("blur", () => {
        if (noteTitle.innerText.trim() === "") {
            noteTitle.innerText = "Untitled Note";
            saveNotes();
        }
    });

    noteBody.addEventListener("blur", () => {
        if (noteBody.innerText.trim() === "") {
            noteBody.innerText = "Write assignment briefs or ideas here...";
            saveNotes();
        }
    });
}