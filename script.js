
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // READ: Load and display existing tasks when page loads
    tasks.forEach(task => renderTask(task));
    
    // CREATE: Add new task functionality
    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };
        
        tasks.push(newTask);
        savedTasks();
        renderTask(newTask); // Display the new task immediately
        todoInput.value = "";
    });
    
    // Allow adding tasks by pressing Enter
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });
    
    // READ: Function to display/render a task in the DOM
    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <span class="task-text" ${task.completed ? 'style="text-decoration: line-through; opacity: 0.7;"' : ''}>${task.text}</span>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id})" class="complete-btn">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="editTask(${task.id})" class="edit-btn">Edit</button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
            </div>
        `;
        
        todoList.appendChild(li);
    }
    
    // CREATE/UPDATE: Function to save tasks to localStorage
    function savedTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // UPDATE: Toggle task completion status
    window.toggleComplete = function(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        savedTasks();
        refreshDisplay();
    }
    
    // UPDATE: Edit task text
    window.editTask = function(id) {
        const task = tasks.find(task => task.id === id);
        const newText = prompt('Edit task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, text: newText.trim() } : task
            );
            savedTasks();
            refreshDisplay();
        }
    }
    
    // DELETE: Remove task
    window.deleteTask = function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            savedTasks();
            refreshDisplay();
        }
    }
    
    // Utility function to refresh the display
    function refreshDisplay() {
        todoList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    }
});

