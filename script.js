// =============================================
//  Student Task Manager - script.js
//  Feature 1: Task creation, completion, deletion
//  and localStorage persistence.
// =============================================

// Load existing tasks from localStorage on page load
let tasks = loadTasksFromStorage();

// Render tasks when the page first opens
renderTasks();

// Allow pressing Enter key in the input field to add a task
document.getElementById('taskInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// -----------------------------------------------
// addTask()
// Reads the input field, creates a new task object,
// saves it, and re-renders the task list.
// -----------------------------------------------
function addTask() {
  const input = document.getElementById('taskInput');
  const taskName = input.value.trim();

  if (taskName === '') {
    alert('Please enter a task before adding.');
    return;
  }

  // Create a task object with a unique id
  const newTask = {
    id: Date.now(),        // use timestamp as a simple unique ID
    name: taskName,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToStorage(tasks);
  renderTasks();

  // Clear the input field after adding
  input.value = '';
  input.focus();
}

// -----------------------------------------------
// toggleTask(id)
// Flips the completed state of a task and saves.
// -----------------------------------------------
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasksToStorage(tasks);
  renderTasks();
}

// -----------------------------------------------
// deleteTask(id)
// Removes a task by its id and saves.
// -----------------------------------------------
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasksToStorage(tasks);
  renderTasks();
}

// -----------------------------------------------
// renderTasks()
// Clears the task list in the DOM and re-builds
// it from the current tasks array.
// -----------------------------------------------
function renderTasks() {
  const taskList = document.getElementById('taskList');
  const emptyMessage = document.getElementById('emptyMessage');

  // Clear the existing list
  taskList.innerHTML = '';

  updateStats();

  if (tasks.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  // Build a list item for each task
  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    li.innerHTML =
      '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleTask(' + task.id + ')" />' +
      '<span class="task-name">' + escapeHtml(task.name) + '</span>' +
      '<button class="delete-btn" onclick="deleteTask(' + task.id + ')" title="Delete task">&#x1F5D1;</button>';

    taskList.appendChild(li);
  });
}

// -----------------------------------------------
// updateStats()
// Calculates totals from the current tasks array and
// updates the visible statistic cards.
// -----------------------------------------------
function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const pendingTasks = totalTasks - completedTasks;

  document.getElementById('totalTasks').textContent = totalTasks;
  document.getElementById('completedTasks').textContent = completedTasks;
  document.getElementById('pendingTasks').textContent = pendingTasks;
}

// -----------------------------------------------
// saveTasksToStorage(tasks)
// Converts the tasks array to JSON and stores it
// in the browser localStorage.
// -----------------------------------------------
function saveTasksToStorage(tasks) {
  localStorage.setItem('studentTasks', JSON.stringify(tasks));
}

// -----------------------------------------------
// loadTasksFromStorage()
// Reads tasks from localStorage. Returns an empty
// array if nothing is stored yet.
// -----------------------------------------------
function loadTasksFromStorage() {
  const stored = localStorage.getItem('studentTasks');
  return stored ? JSON.parse(stored) : [];
}

// -----------------------------------------------
// escapeHtml(text)
// Prevents XSS by escaping special HTML characters
// before inserting user input into the DOM.
// -----------------------------------------------
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"'"'"']/g, function (char) { return map[char]; });
}

// -----------------------------------------------
// Theme (Dark / Light Mode)
// Reads saved preference from localStorage on load
// and wires up the toggle button.
// -----------------------------------------------

// toggleTheme()
// Switches between light and dark mode and persists the choice.
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  if (next === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  localStorage.setItem('studentTheme', next);
  updateToggleLabel(next);
}

// updateToggleLabel(theme)
// Updates the toggle button text and icon to match the active theme.
function updateToggleLabel(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Sync the button label with whatever theme is currently active
// (set by the inline <head> script before paint).
updateToggleLabel(
  document.documentElement.getAttribute('data-theme') || 'light'
);

