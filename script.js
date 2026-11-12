/*
Task creation (everyday tasks), 
 - Task description 
 - Daily tasks (recurring) (ex. read for 30 minutes, 1 hour of LeetCode)

Task Display: 
 - Tasks change colour depending on how upcoming they are
 - Different ways to sort the tasks / Due date, importance + due date, categorically
 - Category of tasks (can create categories as well)
 - Show overdue tasks

 - 2 ways to sort the "boxes"
    1: Categories
    2: Upcoming, Today, recently completed, daily

Separate calendar section depicting tasks on dates
Task completion history

Nice to have: 
 - Productivity dashboard with statistics
 - Undo deletion
*/ 

/*
Todo: 
 - Error checking for valid inputs
 - Make a formula to determine the priority + time due to determine color of the task 
 - recurring / daily tasks
 - Depending on priority, add tasks to today's tasks
 - NO TASKS TO SEE HERE! 
 - add recurring tasks below daily tasks
 - remove today, upcoming, and daily tabs and combine them into "all tasks"
 - completed daily tasks need to be reset the next day 
 - serach


*/ 

const taskPage = document.getElementById("taskPage"); 
const reminderPage = document.getElementById("reminderPage"); 
const taskNameInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("priorityTasks"); 
const taskDate = document.getElementById("taskDate"); 
const addButton = document.getElementById("addButton");
const sortSelect = document.getElementById("sortTasks"); 
const taskList = document.getElementById("taskList");
const recurringTask = document.getElementById("recurringTask");
const tasksHeader = document.getElementById("tasksHeader");  
const recurringCheck= document.getElementById("recurringCheck");
const addTaskHeader =document.getElementById("addTaskHeader"); 
const notesList = document.getAnimations("notesList"); 
const taskTime = document.getElementById("taskTime"); 
const taskDescription = document.getElementById("taskDescription"); 
const addTaskBar = document.getElementById("addTaskBar"); 

// localStorage.removeItem("tasks"); 
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 
let currentView = "all"; 
// let notes = [
//     {
//         id : crypto.randomUUID(), 
//         title: "Linear Algebra Review", 
//         content: "Review next chapter", 
//         dataCreated :new Date(). toISOString() 
//     }
// ]

// function saveNotes() {
//     localStorage.setItem("notes", JSON.stringify(notes)); 
// }

recurringCheck.classList.add("hidden"); 

updateActiveButton(document.getElementById("allTasksButton")); 

// TOPBAR
function setupTopButtons(buttonId, header, view) {
    const button = document.getElementById(buttonId); 
    button.addEventListener("click", () => {
        currentView = view; 
        tasksHeader.textContent = header; 
        updateActiveButton(document.getElementById(buttonId)); 
        console.log(buttonId); 
        if (buttonId === "dailyButton") {
            // removing date 
            taskDate.classList.add("hidden"); 
            // revealing the daily task check
            recurringCheck.classList.remove("hidden");  
            // TODO NEED TO REMOVE AND ADD OTHER FEATURES ALONGSIDE DAILY TASK            
            // const dateLabel = addTaskBar.querySelector(`label[for=${"taskDate"}]`).remove(); 
            // removing DUE DATE from SORT BY 
            removeCategory("date");
            
            addTaskHeader.textContent = "Add a Daily Task"; 
            console.log(addTaskHeader.textContent); 
        } else {
            // any other button removes the daily task feature
            recurringCheck.classList.add("hidden"); 
            // revealing date selector
            taskDate.classList.remove("hidden"); 
            // adding due date back into SORT BY if necessary 
            addCategory("date"); 
            addTaskHeader.textContent = "Add a Task";    
        }
        // removing entire task interface on the reminder screen
        if (buttonId === "reminderButton") {
            console.log(taskPage); 
            console.log(reminderPage); 
            taskPage.classList.add("hidden"); 
            reminderPage.classList.remove("hidden"); 
        } else {
            taskPage.classList.remove("hidden"); 
            reminderPage.classList.add("hidden"); 
            renderTasks(); 
        }
        // removing the add task bar 
        if (buttonId === "completedButton" || buttonId === "todayButton" || buttonId === "upcomingButton") {
            addTaskBar.classList.add("hidden"); 
        } else {
            addTaskBar.classList.remove("hidden"); 
        }
        renderTasks(); 
    })
}

setupTopButtons("allTasksButton", "All Tasks", "all") ;
setupTopButtons("completedButton", "Completed Tasks", "completed"); 
setupTopButtons("upcomingButton", "Upcoming Tasks", "upcoming");
setupTopButtons("todayButton", "Today's Tasks", "today");
setupTopButtons("dailyButton", "Daily Tasks", "daily");
setupTopButtons("reminderButton", "Reminders", "reminder"); 

// Need functionality for the other buttons (Upcoming, daily, reminders, statistics)
function updateActiveButton(selectedButton) {
    document.querySelectorAll(".sidebar button").forEach(
        button => button.classList.remove("active")
    ); 
    console.log(selectedButton); 
    selectedButton.classList.add("active"); 
}

addButton.addEventListener("click", function() {
    const task = taskNameInput.value.trim();
    const priority = taskPriority.value; 
    const date = taskDate.value;
    // UPDATE THIS FOR RECURRING TASKS 
    const daily = (currentView === "daily") ? true : false; 
    console.log(daily); 
    if (task === "") {
        return;
    }
    const li = document.createElement("li");
    li.textContent = task;

    taskList.appendChild(li);
    taskNameInput.value = ""; 
    taskPriority.value = 0; 
    taskTime.value = ""; 
    updateDate();
    showNotification("Task created successfully!"); 
    addTask(task, parseInt(priority), date, daily); 
});

taskPriority.addEventListener("input", () => {
    if (taskPriority.value > 10) {
        taskPriority.value = 10; 
    }
    if (taskPriority.value < 1 && taskPriority.value !== "") {
        taskPriority.value = 1; 
    }

})

// need to exclude date sort on the daily page
sortSelect.addEventListener("change", () => {
    renderTasks(); 
});

function updateDate() {
    const taskDate = document.getElementById("taskDate"); 
    const today = new Date(); 
    const yyyy= today.getFullYear(); 
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 0 is january 
    const dd = String(today.getDate()).padStart(2, '0'); 
    if (taskDate.value != `${yyyy}-${mm}-${dd}`) {
        taskDate.value = `${yyyy}-${mm}-${dd}`; 
        return true; 
    }
    taskDate.value = `${yyyy}-${mm}-${dd}`; 
    return false; 
}

/* 
Alphabetical Sort
 - Priority sort (both high --> low and low --> high)
 - Due date 
*/ 
function renderTasks() {
    const taskList = document.getElementById("taskList"); 
    taskList.innerHTML = ""; 
    let visibleTasks = tasks; 
    // FILTERING BASED UPON RESPECTIVE PAGES
    if (currentView === "all") {
        visibleTasks = tasks.filter(task => !task.completed); 
    } else if (currentView === "completed") {
        visibleTasks = tasks.filter(task => task.completed); 
    } else if (currentView === "today") {
        visibleTasks = tasks.filter(task => taskDate.value === task.dueDate || task.daily === true); 
    } else if (currentView === "upcoming") {
        visibleTasks = tasks.filter(task => task.dueDate > taskDate.value && !task.completed); 
    } else if (currentView === "daily") {
        visibleTasks = tasks.filter(task => task.daily === true); 
    }

    // SORTING 
    if (sortSelect.value === "priority") {
        // a and b represent two elements => b-a means higher priorities come first
        // => is the shorthand way to write a function
        visibleTasks.sort((a, b) => b.priority - a.priority); 
    } else if (sortSelect.value === "date") {
        visibleTasks.sort((a, b) => 
            a.dueDate.localeCompare(b.dueDate) 
        );
    } else if (sortSelect.value === "alphabetical") {
        visibleTasks.sort((a, b) => 
            a.title.localeCompare(b.title)
        );
    }
    visibleTasks.forEach(task => {
        const card = createTaskCard(task); 
        taskList.appendChild(card); 
    })
}

function updateTask(task, property, value) {
    task[property] = value; 
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
    renderTasks(); 
}

function createTaskCard(task) {
    // today's date formatted for comparison
    const today = new Date().toISOString().split("T")[0];
    const card = document.createElement("div"); 
    card.classList.add("task-card"); 

    const checkbox = document.createElement("input"); 
    checkbox.type = "checkbox"; 
    checkbox.checked = task.completed; 

    const removeButton = document.createElement("button");
    removeButton.textContent = "X"; 
    removeButton.type = "remove"; 
    removeButton.addEventListener("click", () => {
        removeTask(task.id); 
        renderTasks(); 
        showNotification("Task removed!"); 
    })
    if (updateDate() === false && task.daily === true) {
        checkbox.checked = false; 
        task.completed = checkbox.checked; 
    }
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked; 
        saveTasks(); 
        renderTasks(); 
        showNotification("Task completed!"); 
    })
    const title = document.createElement("h2"); 
    title.textContent = task.title; 
    if (task.completed) {
        title.classList.add("completed"); 
    }
    const priority = document.createElement("input");
    priority.type = "number";  
    priority.value = `${task.priority}`; 
    priority.addEventListener("change", function() {
        // need to convert priority text content to a number
        updateTask(task, "priority", Number(priority.value)); 
    })
    let time = document.createElement("p"); 
    time.textContent = "No time set"; 
    if (task.time) {    
        console.log("task time exists"); 
        time = document.createElement("input"); 
        time.type = "time"; 
        time.value  = task.time;
        time.addEventListener("change", function() {
            updateTask(task, "time", time.value); 
        })
    }

    card.appendChild(checkbox); 
    card.appendChild(removeButton);
    card.appendChild(title); 
    if (currentView !== "daily" && task.daily !== true) {
        const dueDate = document.createElement("input"); 
        dueDate.type = "date"; 
        dueDate.value = `${task.dueDate}`; 
        dueDate.addEventListener("change", function() {
            updateTask(task, "dueDate", dueDate.value); 
        })
        card.appendChild(dueDate); // change
    } 
    card.appendChild(time); // change
    
    card.appendChild(priority); // change

    /*NEED TO ADD DESCRIPTION TO TASK CARD--NEXT ROW!*/ 
    // const description = document.createElement("p"); 
    // description.textContent = task.description; 
    // description.classList.add("task-description"); 
    // card.appendChild(description); 
    

    // adds today tag for css styling
    if (task.dueDate < today && !task.completed && !task.daily) {
        card.classList.add("overdue");
    }
    // card.style.justifyContent = "space-between"; 
    return card;  
}


// TASK INTERACTIONS
function addTask(title, priority, dueDate, daily, recurring) {
    const task = {
        id: crypto.randomUUID(), 
        title: title, 
        priority: priority, 
        completed: false, 
        dueDate: dueDate, 
        daily: daily, 
        recurring: false, 
        description: taskDescription.value, 
        time: taskTime.value // can't put a comma here
    }; 
    tasks.push(task); 
    saveTasks(); 
    renderTasks(); 
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id != id); 
}

function saveTasks() {
    // stores data in browser's local stoarge
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

// ADDING / REMOVING categories from SORT BY and date label
function removeCategory(category) {
    // searches the first HTML element matching a CSS selector inside another element
    const option = sortSelect.querySelector(`option[value="${category}"]`)
    if (option) {
        console.log("found"); 
        option.remove();
    }
}

function addCategory(category) {
    const existingOption = sortSelect.querySelector( `option[value="${category}"]`); 
    if (existingOption) return; 

    const option = document.createElement("option") ;
    option.value = category; 
    option.textContent = category; 
    sortSelect.appendChild(option); 
}
// Notes 

function renderNotes() {

}
// Notifications
function showNotification(message) {
    const notification = document.createElement("div"); 
    notification.classList.add("notification"); 
    notification.textContent = message; 
    document.body.appendChild(notification); 
    setTimeout(() => {
        notification.remove(); 
    }, 3000); 
}

updateDate(); 
renderTasks(); 

console.log(tasks); 