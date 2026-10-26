/*
Task creation (everyday tasks), 
 - Remove Tasks,
 - Complete Tasks 
 - Edit Tasks
 - Due dates + times 
 - Task notes 
 - Rate it on a scale of importance 
 - Daily tasks (recurring) (ex. read for 30 minutes, 1 hour of LeetCode)

Task Display: 
 - Tasks change colour depending on how upcoming they are
 - Different ways to sort the tasks / Due date, importance + due date, categorically
 - Category of tasks (can create categories as well)
 - Show overdue tasks
 - Separate calendar section depicting tasks on dates
Task completion history
Search Tasks

Nice to have: 
 - Productivity dashboard with statistics
 - Undo deletion
*/ 

/*
Todo: 
 - Error checking for valid inputs

*/ 

const taskNameInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("priorityTasks"); 
const taskDate = document.getElementById("taskDate"); 
const addButton = document.getElementById("addButton");
const sortSelect = document.getElementById("sortTasks"); 
const taskList = document.getElementById("taskList");

// localStorage.removeItem("tasks"); 
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 

addButton.addEventListener("click", function() {
    const task = taskNameInput.value.trim();
    const priority = taskPriority.value; 
    const date = taskDate.value;
    if (task === "") {
        return;
    }
    const li = document.createElement("li");
    li.textContent = task;

    taskList.appendChild(li);
    taskNameInput.value = ""; 
    addTask(task, parseInt(priority), date); 
});

sortSelect.addEventListener("change", () => {
    renderTasks(); 
});

function updateDate() {
    const taskDate = document.getElementById("taskDate"); 
    const today = new Date(); 
    const yyyy= today.getFullYear(); 
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 0 is january 
    const dd = String(today.getDate()).padStart(2, '0'); 
    taskDate.value = `${yyyy}-${mm}-${dd}`; 
}

function addTask(title, priority, dueDate) {
    const task = {
        id: crypto.randomUUID(), 
        title: title, 
        priority: priority, 
        completed: false, 
        dueDate: dueDate
    }; 
    tasks.push(task); 
    saveTasks(); 
    renderTasks(); 
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id != id); 
}

function completeTask(id) {
    const task = tasks.find(task => task.id === id); 
    
    if (task) {
        task.completed = true; 
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

/* 
Alphabetical Sort
 - Priority sort (both high --> low and low --> high)
 - Due date 
*/ 

function renderTasks() {
    taskList.innerHTML = ""; 
    const sortedTasks = [...tasks]; 
    if (sortSelect.value === "priority") {
        sortedTasks.sort((a, b) => b.priority - a.priority); 
    } else if (sortSelect.value === "date") {
        sortedTasks.sort((a, b) => 
            a.dueDate.localeCompare(b.dueDate) 
        );
    } else if (sortSelect.value === "alphabetical") {
        sortedTasks.sort((a, b) => 
            a.title.localeCompare(b.title)
        );
    }

    tasks.forEach(task => {
        const li = document.createElement("li"); 
        li.textContent = task.title; 
        taskList.appendChild(li); 
    })
}

updateDate(); 

renderTasks(); 

function removeObjectStyleTasks() {
    // 1. Retrieve the tasks array from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // 2. Filter: Keep a task ONLY if both priority and date are strings
    let cleanTasks = tasks.filter(task => {
        const isPriorityString = typeof task.priority === 'string';
        const isDateString = typeof task.date === 'string';

        // Keep the task only if both values are valid strings
        return isPriorityString && isDateString;
    });

    // 3. Save the repaired array back to localStorage
    localStorage.setItem("tasks", JSON.stringify(cleanTasks));

    // Print results to your console
    console.log(`Cleanup complete! Kept ${cleanTasks.length} valid tasks. Removed ${tasks.length - cleanTasks.length} broken object-style tasks.`);
}

console.log(tasks); 