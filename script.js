const getStartedBtn = document.getElementById('getStartedBtn');
const container = document.querySelector('.container');

// Only run this on index.html if the button exists
if (getStartedBtn && container) {
  getStartedBtn.addEventListener('click', () => {
    container.scrollIntoView({ behavior: "smooth" });
  });
}



const taskInput = document.getElementById("taskText");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const xpCount = document.getElementById("xpCount");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;

xpCount.textContent = xp;

window.addEventListener("DOMContentLoaded", () => {
  tasks.forEach(task => addTaskToDOM(task));
});

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Enter a task!");
    return;
  }

  const time = document.getElementById("taskTime").value;
const task = { text, time, completed: false };
  tasks.push(task);
  saveTasks();
  addTaskToDOM(task);
  taskInput.value = "";
});


function addTaskToDOM(task) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");

 taskItem.innerHTML = `
  <label class="checkbox-label">
    <input type="checkbox" class="complete-checkbox" ${task.completed ? "checked" : ""} />
    <span class="task-desc" style="${task.completed ? 'text-decoration:line-through;color:#999;opacity:0.6;' : ''}">
      ${task.text} 
      ${task.time ? `<small style="color:#517efb;">🕒 ${task.time}</small>` : ''}
    </span>
  </label>
  <button class="delete-btn">🗑️</button>
`;

  taskList.appendChild(taskItem);
}

taskList.addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  const index = Array.from(taskList.children).indexOf(item);


  if (e.target.classList.contains("complete-checkbox")) {
    const span = item.querySelector(".task-desc");
    tasks[index].completed = e.target.checked;

    if (e.target.checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "#999";
      item.style.opacity = "0.6";
      xp += 10;
    } else {
      span.style.textDecoration = "none";
      span.style.color = "";
      item.style.opacity = "1";
      xp -= 10;
    }

    xpCount.textContent = xp;
    saveTasks();
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    item.remove();
    saveTasks();
  }
});


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("xp", xp);
}
function checkReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: "HH:MM"

  tasks.forEach((task, index) => {
    if (task.time === currentTime && !task.notified && !task.completed) {
      alert(`⏰ Reminder: ${task.text}`);
      task.notified = true;
      saveTasks();
    }
  });
}
function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed)
    ) {
      addTaskToDOM(task, index);
    }
  });
}
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filterType = btn.getAttribute("data-filter");
    renderTasks(filterType);
    filterButtons.forEach((b) => b.classList.remove("active"));
btn.classList.add("active");
  });
});


setInterval(checkReminders, 60000);


const darkToggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkToggle.textContent = "☀️";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    darkToggle.textContent = "☀️";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkToggle.textContent = "🌙";
  }
});