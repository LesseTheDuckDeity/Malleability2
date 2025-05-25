// Home page dashboard functionality
class DashboardManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
        ];
        
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.initializeTasks();
        this.initializeCalendar();
        this.initializeXPSystem();
        this.initializeQuotes();
        this.updateCurrentDate();
    }

    // Tasks System
    initializeTasks() {
        const taskInput = document.getElementById('task-input');
        const addTaskBtn = document.getElementById('add-task-btn');
        
        if (taskInput && addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.addTask());
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask();
                }
            });
        }

        this.loadTasks();
    }

    addTask() {
        const taskInput = document.getElementById('task-input');
        const taskText = taskInput.value.trim();
        
        if (!taskText) return;
        
        const task = {
            id: MalleabilityApp.generateId(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.saveTask(task);
        this.displayTasks();
        taskInput.value = '';
        
        showMessage('Task added successfully!', 'success', 2000);
    }

    saveTask(task) {
        const dateKey = this.formatDateKey(this.selectedDate);
        const tasks = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        
        if (!tasks[dateKey]) {
            tasks[dateKey] = [];
        }
        
        tasks[dateKey].push(task);
        MalleabilityApp.saveToStorage('malleability_tasks', tasks);
    }

    loadTasks() {
        this.displayTasks();
    }

    displayTasks() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

        const dateKey = this.formatDateKey(this.selectedDate);
        const tasks = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        const dayTasks = tasks[dateKey] || [];
        
        if (dayTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-tasks">No tasks for this day</li>';
            return;
        }
        
        tasksList.innerHTML = dayTasks.map(task => `
            <li class="task-item">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                         onclick="dashboard.toggleTask('${task.id}')"></div>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <button class="task-delete" onclick="dashboard.deleteTask('${task.id}')" 
                        title="Delete task">×</button>
            </li>
        `).join('');
    }

    toggleTask(taskId) {
        const dateKey = this.formatDateKey(this.selectedDate);
        const tasks = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        
        if (tasks[dateKey]) {
            const task = tasks[dateKey].find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                MalleabilityApp.saveToStorage('malleability_tasks', tasks);
                this.displayTasks();
                this.updateCalendar();
                
                if (task.completed) {
                    showMessage('Task completed! 🎉', 'success', 2000);
                }
            }
        }
    }

    deleteTask(taskId) {
        const dateKey = this.formatDateKey(this.selectedDate);
        const tasks = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        
        if (tasks[dateKey]) {
            tasks[dateKey] = tasks[dateKey].filter(t => t.id !== taskId);
            if (tasks[dateKey].length === 0) {
                delete tasks[dateKey];
            }
            MalleabilityApp.saveToStorage('malleability_tasks', tasks);
            this.displayTasks();
            this.updateCalendar();
            
            showMessage('Task deleted', 'info', 2000);
        }
    }

    // Calendar System
    initializeCalendar() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.updateCalendar();
            });
            
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.updateCalendar();
            });
        }
        
        this.updateCalendar();
    }

    updateCalendar() {
        const monthElement = document.getElementById('calendar-month');
        const gridElement = document.getElementById('calendar-grid');
        
        if (!monthElement || !gridElement) return;
        
        // Update month display
        monthElement.textContent = this.currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        
        // Generate calendar grid
        this.generateCalendarGrid(gridElement);
    }

    generateCalendarGrid(gridElement) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // First day of the month and how many days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Days from previous month
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        let html = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Previous month's trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isToday(date);
            const isSelected = this.isSameDate(date, this.selectedDate);
            const hasTasks = this.dateHasTasks(date);
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasTasks) classes += ' has-tasks';
            
            html += `<div class="${classes}" onclick="dashboard.selectDate(${year}, ${month}, ${day})">${day}</div>`;
        }
        
        // Next month's leading days
        const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
        
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        gridElement.innerHTML = html;
    }

    selectDate(year, month, day) {
        this.selectedDate = new Date(year, month, day);
        this.updateCurrentDate();
        this.displayTasks();
        this.updateCalendar();
    }

    isToday(date) {
        const today = new Date();
        return this.isSameDate(date, today);
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    dateHasTasks(date) {
        const dateKey = this.formatDateKey(date);
        const tasks = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        return tasks[dateKey] && tasks[dateKey].length > 0;
    }

    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = MalleabilityApp.formatDate(this.selectedDate);
        }
    }

    // XP System
    initializeXPSystem() {
        const xpBtns = document.querySelectorAll('.xp-btn');
        const resetBtn = document.getElementById('reset-level');
        
        xpBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const xpValue = parseInt(btn.getAttribute('data-xp'));
                this.addXP(xpValue);
            });
        });
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetLevel());
        }
        
        this.loadXPData();
    }

    loadXPData() {
        const xpData = MalleabilityApp.loadFromStorage('malleability_xp', { level: 1, xp: 0 });
        this.updateXPDisplay(xpData.level, xpData.xp);
    }

    addXP(amount) {
        const xpData = MalleabilityApp.loadFromStorage('malleability_xp', { level: 1, xp: 0 });
        const oldLevel = xpData.level;
        
        xpData.xp += amount;
        
        // Check for level up
        while (xpData.xp >= this.getXPNeededForLevel(xpData.level + 1)) {
            xpData.level++;
        }
        
        MalleabilityApp.saveToStorage('malleability_xp', xpData);
        this.updateXPDisplay(xpData.level, xpData.xp);
        
        if (xpData.level > oldLevel) {
            this.showLevelUpAnimation(xpData.level);
        }
        
        showMessage(`+${amount} XP earned!`, 'success', 2000);
    }

    getXPNeededForLevel(level) {
        return level * (level + 1) * 50;
    }

    updateXPDisplay(level, currentXP) {
        const levelElement = document.getElementById('current-level');
        const xpElement = document.getElementById('current-xp');
        const xpNeededElement = document.getElementById('xp-needed');
        const progressElement = document.getElementById('xp-progress');
        
        if (levelElement) levelElement.textContent = level;
        if (xpElement) xpElement.textContent = currentXP;
        
        const xpNeeded = this.getXPNeededForLevel(level + 1);
        const xpForCurrentLevel = this.getXPNeededForLevel(level);
        const xpInCurrentLevel = currentXP - xpForCurrentLevel;
        const xpNeededForNext = xpNeeded - xpForCurrentLevel;
        
        if (xpNeededElement) xpNeededElement.textContent = xpNeeded;
        
        if (progressElement) {
            const progressPercent = (xpInCurrentLevel / xpNeededForNext) * 100;
            progressElement.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
        }
    }

    showLevelUpAnimation(newLevel) {
        showMessage(`🎉 Level Up! You reached Level ${newLevel}!`, 'success', 4000);
        
        // Add a celebration effect
        const levelElement = document.getElementById('current-level');
        if (levelElement) {
            levelElement.style.animation = 'none';
            setTimeout(() => {
                levelElement.style.animation = 'pulse 0.6s ease-in-out 3';
            }, 10);
        }
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset your level? This cannot be undone.')) {
            const xpData = { level: 1, xp: 0 };
            MalleabilityApp.saveToStorage('malleability_xp', xpData);
            this.updateXPDisplay(1, 0);
            showMessage('Level reset to 1', 'info');
        }
    }

    // Quotes System
    initializeQuotes() {
        const newQuoteBtn = document.getElementById('new-quote-btn');
        const addQuoteBtn = document.getElementById('add-quote-btn');
        const saveQuoteBtn = document.getElementById('save-quote-btn');
        const cancelQuoteBtn = document.getElementById('cancel-quote-btn');
        const deleteQuoteBtn = document.getElementById('delete-quote-btn');
        
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => this.showRandomQuote());
        }
        
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => this.showAddQuoteForm());
        }
        
        if (saveQuoteBtn) {
            saveQuoteBtn.addEventListener('click', () => this.saveCustomQuote());
        }
        
        if (cancelQuoteBtn) {
            cancelQuoteBtn.addEventListener('click', () => this.hideAddQuoteForm());
        }
        
        if (deleteQuoteBtn) {
            deleteQuoteBtn.addEventListener('click', () => this.deleteSelectedQuote());
        }
        
        this.loadQuotes();
        this.showRandomQuote();
    }

    loadQuotes() {
        const customQuotes = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);
        this.allQuotes = [...this.quotes, ...customQuotes];
        this.updateQuoteSelector();
    }

    updateQuoteSelector() {
        const selector = document.getElementById('quote-selector');
        if (!selector) return;
        
        const customQuotes = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);
        
        selector.innerHTML = '<option value="">Select a quote to manage...</option>';
        customQuotes.forEach((quote, index) => {
            const truncatedText = quote.text.length > 50 ? 
                quote.text.substring(0, 50) + '...' : quote.text;
            selector.innerHTML += `<option value="${index}">${truncatedText}</option>`;
        });
    }

    showRandomQuote() {
        if (this.allQuotes.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * this.allQuotes.length);
        const quote = this.allQuotes[randomIndex];
        
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        if (quoteText) quoteText.textContent = quote.text;
        if (quoteAuthor) quoteAuthor.textContent = quote.author;
    }

    showAddQuoteForm() {
        const form = document.getElementById('add-quote-form');
        if (form) {
            form.classList.remove('hidden');
            document.getElementById('quote-input').focus();
        }
    }

    hideAddQuoteForm() {
        const form = document.getElementById('add-quote-form');
        if (form) {
            form.classList.add('hidden');
            document.getElementById('quote-input').value = '';
            document.getElementById('author-input').value = '';
        }
    }

    saveCustomQuote() {
        const quoteInput = document.getElementById('quote-input');
        const authorInput = document.getElementById('author-input');
        
        const quoteText = quoteInput.value.trim();
        const authorText = authorInput.value.trim();
        
        if (!quoteText || !authorText) {
            showMessage('Please fill in both quote and author fields', 'error');
            return;
        }
        
        const customQuotes = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);
        const newQuote = { text: quoteText, author: authorText };
        
        customQuotes.push(newQuote);
        MalleabilityApp.saveToStorage('malleability_custom_quotes', customQuotes);
        
        this.loadQuotes();
        this.hideAddQuoteForm();
        showMessage('Custom quote added successfully!', 'success');
    }

    deleteSelectedQuote() {
        const selector = document.getElementById('quote-selector');
        const selectedIndex = selector.value;
        
        if (selectedIndex === '') {
            showMessage('Please select a quote to delete', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this quote?')) {
            const customQuotes = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);
            customQuotes.splice(parseInt(selectedIndex), 1);
            MalleabilityApp.saveToStorage('malleability_custom_quotes', customQuotes);
            
            this.loadQuotes();
            selector.value = '';
            showMessage('Quote deleted successfully', 'success');
        }
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new DashboardManager();
});

// Add CSS animation for level up effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style); 