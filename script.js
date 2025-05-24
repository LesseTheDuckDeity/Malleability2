// Global variables
let currentDate = new Date();
let selectedDate = new Date();
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let userXP = parseInt(localStorage.getItem('userXP')) || 0;
let userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" }
];

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getDateKey(date) {
    return date.toISOString().split('T')[0];
}

function calculateXPForLevel(level) {
    // Each level requires 100 more XP than the previous
    // Level 1: 100 XP, Level 2: 200 XP, Level 3: 300 XP, etc.
    // Total XP needed = 100 + 200 + 300 + ... + (level * 100)
    // Formula: sum from i=1 to level of (i * 100) = 100 * level * (level + 1) / 2
    return level * (level + 1) * 50; // Simplified: 100 * level * (level + 1) / 2
}

function updateXPDisplay() {
    const currentLevelElement = document.getElementById('current-level');
    const currentXPElement = document.getElementById('current-xp');
    const xpNeededElement = document.getElementById('xp-needed');
    const xpProgressElement = document.getElementById('xp-progress');
    
    const xpForCurrentLevel = calculateXPForLevel(userLevel - 1);
    const xpForNextLevel = calculateXPForLevel(userLevel);
    const xpInCurrentLevel = userXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    
    currentLevelElement.textContent = userLevel;
    currentXPElement.textContent = xpInCurrentLevel;
    xpNeededElement.textContent = xpNeededForNextLevel;
    
    const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
    xpProgressElement.style.width = `${Math.min(progressPercentage, 100)}%`;
    
    // Check if user leveled up
    if (userXP >= xpForNextLevel) {
        userLevel++;
        localStorage.setItem('userLevel', userLevel);
        updateXPDisplay(); // Recursive call to update for new level
        
        // Show level up notification with celebratory styling
        showLevelUpNotification();
    }
}

function showLevelUpNotification() {
    // Create a more attractive level up notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 40px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        animation: levelUpPulse 0.6s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <div>Level Up!</div>
        <div style="font-size: 18px; margin-top: 10px;">You've reached Level ${userLevel}!</div>
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes levelUpPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Navigation functionality
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all menu items and pages
            menuItems.forEach(mi => mi.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked menu item
            item.classList.add('active');
            
            // Show corresponding page
            const pageId = item.getAttribute('data-page');
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
}

// Task management functionality
function initTaskManagement() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const currentDateElement = document.getElementById('current-date');
    
    // Display current date
    currentDateElement.textContent = formatDate(selectedDate);
    
    // Add task functionality
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const dateKey = getDateKey(selectedDate);
            if (!tasks[dateKey]) {
                tasks[dateKey] = [];
            }
            
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks[dateKey].push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
            updateCalendar(); // Update calendar to show task indicator
        }
    }
    
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Render tasks for selected date
    function renderTasks() {
        const dateKey = getDateKey(selectedDate);
        const dayTasks = tasks[dateKey] || [];
        
        if (dayTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-tasks">No tasks for today!</li>';
            return;
        }
        
        tasksList.innerHTML = dayTasks.map(task => `
            <li class="task-item">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" data-task-id="${task.id}"></div>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <button class="task-delete" data-task-id="${task.id}">×</button>
            </li>
        `).join('');
        
        // Add event listeners for checkboxes and delete buttons
        tasksList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                toggleTask(taskId);
            });
        });
        
        tasksList.querySelectorAll('.task-delete').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                deleteTask(taskId);
            });
        });
    }
    
    function toggleTask(taskId) {
        const dateKey = getDateKey(selectedDate);
        const task = tasks[dateKey].find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }
    
    function deleteTask(taskId) {
        const dateKey = getDateKey(selectedDate);
        if (tasks[dateKey]) {
            tasks[dateKey] = tasks[dateKey].filter(t => t.id !== taskId);
            if (tasks[dateKey].length === 0) {
                delete tasks[dateKey];
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateCalendar();
        }
    }
    
    // Initial render
    renderTasks();
}

// Calendar functionality
function initCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonth = document.getElementById('calendar-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        calendarMonth.textContent = currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Generate calendar days
        const today = new Date();
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            // Add classes for styling
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Check if day has tasks
            const dateKey = getDateKey(date);
            if (tasks[dateKey] && tasks[dateKey].length > 0) {
                dayElement.classList.add('has-tasks');
            }
            
            // Add click handler
            dayElement.addEventListener('click', () => {
                selectedDate = new Date(date);
                document.getElementById('current-date').textContent = formatDate(selectedDate);
                
                // Re-render tasks for selected date
                const taskInput = document.getElementById('task-input');
                const addTaskBtn = document.getElementById('add-task-btn');
                const tasksList = document.getElementById('tasks-list');
                
                renderTasksForDate(selectedDate);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function renderTasksForDate(date) {
        const dateKey = getDateKey(date);
        const dayTasks = tasks[dateKey] || [];
        const tasksList = document.getElementById('tasks-list');
        
        if (dayTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-tasks">No tasks for this day!</li>';
            return;
        }
        
        tasksList.innerHTML = dayTasks.map(task => `
            <li class="task-item">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" data-task-id="${task.id}"></div>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <button class="task-delete" data-task-id="${task.id}">×</button>
            </li>
        `).join('');
        
        // Re-add event listeners
        tasksList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                const task = tasks[dateKey].find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasksForDate(date);
                }
            });
        });
        
        tasksList.querySelectorAll('.task-delete').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                tasks[dateKey] = tasks[dateKey].filter(t => t.id !== taskId);
                if (tasks[dateKey].length === 0) {
                    delete tasks[dateKey];
                }
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasksForDate(date);
                updateCalendar();
            });
        });
    }
    
    // Navigation buttons
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    
    // Initial render
    updateCalendar();
    
    // Make updateCalendar globally accessible
    window.updateCalendar = updateCalendar;
}

// XP System functionality
function initXPSystem() {
    const xpButtons = document.querySelectorAll('.xp-btn');
    const resetButton = document.getElementById('reset-level');
    
    xpButtons.forEach(button => {
        button.addEventListener('click', () => {
            const xpGain = parseInt(button.getAttribute('data-xp'));
            userXP += xpGain;
            localStorage.setItem('userXP', userXP);
            updateXPDisplay();
            
            // Show XP gain animation/notification
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your level and XP? This action cannot be undone.')) {
            userXP = 0;
            userLevel = 1;
            localStorage.setItem('userXP', userXP);
            localStorage.setItem('userLevel', userLevel);
            updateXPDisplay();
        }
    });
    
    // Initial display update
    updateXPDisplay();
}

// Motivational Quotes functionality
function initQuotes() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const addQuoteBtn = document.getElementById('add-quote-btn');
    const addQuoteForm = document.getElementById('add-quote-form');
    const quoteInput = document.getElementById('quote-input');
    const authorInput = document.getElementById('author-input');
    const saveQuoteBtn = document.getElementById('save-quote-btn');
    const cancelQuoteBtn = document.getElementById('cancel-quote-btn');
    const quoteSelector = document.getElementById('quote-selector');
    const deleteQuoteBtn = document.getElementById('delete-quote-btn');
    
    let currentQuoteIndex = 0;
    
    function updateQuoteSelector() {
        // Clear existing options (keep the first placeholder option)
        quoteSelector.innerHTML = '<option value="">Select a quote to manage...</option>';
        
        // Add all quotes to the dropdown
        quotes.forEach((quote, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${quote.text.substring(0, 50)}${quote.text.length > 50 ? '...' : ''} - ${quote.author}`;
            quoteSelector.appendChild(option);
        });
    }
    
    function displayRandomQuote() {
        if (quotes.length > 0) {
            currentQuoteIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[currentQuoteIndex];
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
            
            // Update selector to show current quote
            quoteSelector.value = currentQuoteIndex;
        } else {
            quoteText.textContent = "No quotes available. Add some quotes to get inspired!";
            quoteAuthor.textContent = "";
            quoteSelector.value = "";
        }
    }
    
    function displayQuoteByIndex(index) {
        if (quotes[index]) {
            currentQuoteIndex = index;
            const quote = quotes[currentQuoteIndex];
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
        }
    }
    
    function showAddQuoteForm() {
        addQuoteForm.classList.remove('hidden');
        quoteInput.focus();
    }
    
    function hideAddQuoteForm() {
        addQuoteForm.classList.add('hidden');
        quoteInput.value = '';
        authorInput.value = '';
    }
    
    function saveNewQuote() {
        const text = quoteInput.value.trim();
        const author = authorInput.value.trim();
        
        if (text && author) {
            quotes.push({ text, author });
            localStorage.setItem('quotes', JSON.stringify(quotes));
            hideAddQuoteForm();
            updateQuoteSelector();
            
            // Display the newly added quote
            currentQuoteIndex = quotes.length - 1;
            quoteText.textContent = text;
            quoteAuthor.textContent = author;
            quoteSelector.value = currentQuoteIndex;
            
            // Show success feedback
            showQuoteNotification('Quote added successfully! 📝', '#48bb78');
        } else {
            showQuoteNotification('Please enter both quote text and author. ⚠️', '#f56565');
        }
    }
    
    function deleteSelectedQuote() {
        const selectedIndex = parseInt(quoteSelector.value);
        
        if (selectedIndex !== '' && !isNaN(selectedIndex) && quotes[selectedIndex]) {
            if (confirm(`Are you sure you want to delete this quote?\n\n"${quotes[selectedIndex].text}" - ${quotes[selectedIndex].author}`)) {
                quotes.splice(selectedIndex, 1);
                localStorage.setItem('quotes', JSON.stringify(quotes));
                updateQuoteSelector();
                
                // Display a random quote or show empty state
                if (quotes.length > 0) {
                    displayRandomQuote();
                } else {
                    quoteText.textContent = "No quotes available. Add some quotes to get inspired!";
                    quoteAuthor.textContent = "";
                }
                
                showQuoteNotification('Quote deleted successfully! 🗑️', '#f56565');
            }
        } else {
            showQuoteNotification('Please select a quote to delete. 📝', '#f59e0b');
        }
    }
    
    function showQuoteNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Event listeners
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    addQuoteBtn.addEventListener('click', showAddQuoteForm);
    cancelQuoteBtn.addEventListener('click', hideAddQuoteForm);
    saveQuoteBtn.addEventListener('click', saveNewQuote);
    deleteQuoteBtn.addEventListener('click', deleteSelectedQuote);
    
    // Quote selector change event
    quoteSelector.addEventListener('change', (e) => {
        const selectedIndex = parseInt(e.target.value);
        if (!isNaN(selectedIndex) && quotes[selectedIndex]) {
            displayQuoteByIndex(selectedIndex);
        }
    });
    
    // Handle Enter key in quote form
    quoteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authorInput.focus();
        }
    });
    
    authorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveNewQuote();
        }
    });
    
    // Initial setup
    updateQuoteSelector();
    displayRandomQuote();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTaskManagement();
    initCalendar();
    initXPSystem();
    initQuotes();
}); 