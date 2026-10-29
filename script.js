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
 - Make a formula to determine the priority + time due to determine color of the task 
 - BRIGHT RED when task is overdue 
 - checkmark / crossout for completion
*/ 

const taskNameInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("priorityTasks"); 
const taskDate = document.getElementById("taskDate"); 
const addButton = document.getElementById("addButton");
const sortSelect = document.getElementById("sortTasks"); 
const taskList = document.getElementById("taskList");

// localStorage.removeItem("tasks"); 
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 

// Adds functionality to the button 
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

function createTaskCard(task) {
    const card = document.createElement("div"); 
    card.classList.add("task-card"); 

    const checkbox = document.createElement("input"); 
    checkbox.type = "checkbox"; 
    checkbox.checked = task.completed; 

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked; 
        saveTasks(); 
        renderTasks(); 
    })

    const title = document.createElement("h2"); 
    title.textContent = task.title; 

    if (task.completed) {
        title.classList.add("completed"); 
    }

    const dueDate = document.createElement("p"); 
    dueDate.textContent = `Due: ${task.dueDate}`; 

    const priority = document.createElement("p"); 
    priority.textContent = `Priority: ${task.priority}`; 

    const completion = document.createElement("p"); 
    completion.textContent = task.completed ? "Completed" : "Not Completed"; 
    
    card.appendChild(checkbox); 
    card.appendChild(title); 
    card.appendChild(dueDate); 
    card.appendChild(priority); 
    card.appendChild(completion); 
    return card;  
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
    const taskList = document.getElementById("taskList"); 
    taskList.innerHTML = ""; 
    const sortedTasks = [...tasks]; 
    console.log(sortSelect.value); 
    if (sortSelect.value === "priority") {
        // a and b represent two elements => b-a means higher priorities come first
        // => is the shorthand way to write a function
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
    sortedTasks.forEach(task => {
        const card = createTaskCard(task); 
        taskList.appendChild(card); 
    })
}

updateDate(); 

renderTasks(); 

// function removeObjectStyleTasks() {
//     // 1. Retrieve the tasks array from localStorage
//     let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//     // 2. Filter: Keep a task ONLY if both priority and date are strings
//     let cleanTasks = tasks.filter(task => {
//         const isPriorityString = typeof task.priority === 'string';
//         const isDateString = typeof task.date === 'string';

//         // Keep the task only if both values are valid strings
//         return isPriorityString && isDateString;
//     });

//     // 3. Save the repaired array back to localStorage
//     localStorage.setItem("tasks", JSON.stringify(cleanTasks));

//     // Print results to your console
//     console.log(`Cleanup complete! Kept ${cleanTasks.length} valid tasks. Removed ${tasks.length - cleanTasks.length} broken object-style tasks.`);
// }

console.log(tasks); 