const API_BASE = 'http://localhost:8082';

// --- State Management ---
let state = {
    user: null,
    token: localStorage.getItem('token'),
    tasks: []
};

// --- DOM Elements ---
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleAuth = document.getElementById('toggle-auth');
const toggleAuthBack = document.getElementById('toggle-auth-back');
const logoutBtn = document.getElementById('logout-btn');
const tasksList = document.getElementById('tasks-list');
const newTaskInput = document.getElementById('new-task-title');
const addTaskBtn = document.getElementById('add-task-btn');
const userDisplayEmail = document.getElementById('user-display-email');
const taskStats = document.getElementById('task-stats');
const toastEl = document.getElementById('toast');

// --- Initialization ---
function init() {
    if (state.token) {
        showDashboard();
        fetchTasks();
    } else {
        showAuth();
    }
}

// --- Auth Functions ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            state.token = data.token;
            localStorage.setItem('token', state.token);
            showDashboard();
            fetchTasks();
            showToast('Welcome back!', 'success');
        } else {
            const error = await response.text();
            showToast(error || 'Login failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            showToast('Registration successful! Please login.', 'success');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            const error = await response.text();
            showToast(error || 'Registration failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

function handleLogout() {
    state.token = null;
    localStorage.removeItem('token');
    showAuth();
    showToast('Logged out successfully', 'success');
}

// --- Task Functions ---
async function fetchTasks() {
    try {
        const response = await fetch(`${API_BASE}/todos`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            state.tasks = await response.json();
            renderTasks();
        } else if (response.status === 403) {
            handleLogout();
        }
    } catch (err) {
        showToast('Failed to fetch tasks', 'error');
    }
}

async function addTask() {
    const title = newTaskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/todos/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
                title: title,
                description: 'Task added from web dashboard',
                completed: false
            })
        });

        if (response.ok) {
            const newTask = await response.json();
            state.tasks.push(newTask);
            newTaskInput.value = '';
            renderTasks();
            showToast('Task added successfully', 'success');
        }
    } catch (err) {
        showToast('Failed to add task', 'error');
    }
}

async function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
                ...task,
                completed: !task.completed
            })
        });

        if (response.ok) {
            task.completed = !task.completed;
            renderTasks();
        }
    } catch (err) {
        showToast('Update failed', 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            state.tasks = state.tasks.filter(t => t.id !== id);
            renderTasks();
            showToast('Task deleted', 'success');
        }
    } catch (err) {
        showToast('Delete failed', 'error');
    }
}

// --- UI Helpers ---
function renderTasks() {
    tasksList.innerHTML = '';
    
    if (state.tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        taskStats.textContent = 'You have 0 tasks pending';
        return;
    }

    state.tasks.forEach(task => {
        const el = document.createElement('div');
        el.className = `task-item glass ${task.completed ? 'completed' : ''}`;
        el.innerHTML = `
            <span>${task.title}</span>
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})" class="btn-sm btn-done">${task.completed ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${task.id})" class="btn-sm btn-delete">Delete</button>
            </div>
        `;
        tasksList.appendChild(el);
    });

    const pending = state.tasks.filter(t => !t.completed).length;
    taskStats.textContent = `You have ${pending} task${pending !== 1 ? 's' : ''} pending`;
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showToast(message, type) {
    toastEl.textContent = message;
    toastEl.className = `toast ${type}`;
    toastEl.classList.remove('hidden');
    setTimeout(() => toastEl.classList.add('hidden'), 3000);
}

// --- Event Listeners ---
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

toggleAuthBack.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Run Init
init();
