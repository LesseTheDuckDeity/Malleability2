// Home page dashboard functionality with API integration
class DashboardManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.state = null; // Will be set after app initialization
        this.initializeDashboard();
    }

    async initializeDashboard() {
        // Wait for app and state to be available
        await this.waitForApp();
        
        this.initializeCalendar();
        this.initializeXPSystem();
        this.updateCurrentDate();
        
        // Initialize with API data
        await this.initializeTasks();
        await this.initializeQuotes();
        
        // Update calendar after tasks are loaded to show task indicators
        this.updateCalendar();
    }

    async waitForApp() {
        return new Promise((resolve) => {
            const checkApp = () => {
                if (window.app && window.app.state) {
                    this.state = window.app.state;
                    resolve();
                } else {
                    setTimeout(checkApp, 50);
                }
            };
            checkApp();
        });
    }

    // Tasks System - API Integration
    async initializeTasks() {
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

        // Load tasks from API
        await this.loadTasks();
        
        // Subscribe to task updates
        if (this.state) {
            this.state.subscribe('tasks', (tasks) => {
                this.displayTasks(tasks);
                this.updateCalendar();
            });
        }
    }

    async addTask() {
        const taskInput = document.getElementById('task-input');
        const taskText = taskInput.value.trim();
        
        if (!taskText) return;
        
        const taskData = {
            title: taskText,
            description: '',
            due_date: this.formatDateForAPI(this.selectedDate),
            priority: 'Medium',
            completed: false
        };
        
        try {
            if (this.state) {
                await this.state.createTask(taskData);
                taskInput.value = '';
                // State will automatically trigger UI update via subscription
                window.app?.showMessage(`Task added to ${this.selectedDate.toLocaleDateString()}!`, 'success');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            window.app?.showMessage('Error adding task', 'error');
        }
    }

    async loadTasks() {
        try {
            if (this.state) {
                await this.state.loadTasks();
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            window.app?.showMessage('Error loading tasks', 'error');
        }
    }

    displayTasks(allTasks = null) {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

        // Get tasks for selected date
        const tasks = allTasks || this.state?.getState('tasks') || [];
        const selectedDateStr = this.formatDateForAPI(this.selectedDate);
        const dayTasks = tasks.filter(task => {
            const taskDate = task.due_date ? task.due_date.split('T')[0] : null;
            return taskDate === selectedDateStr;
        });
        
        if (dayTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-tasks">No tasks for this day</li>';
            return;
        }
        
        tasksList.innerHTML = dayTasks.map(task => `
            <li class="task-item">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                         onclick="dashboard.toggleTask(${task.id})"></div>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.title}</span>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-priority priority-${task.priority?.toLowerCase()}">${task.priority}</span>
                    </div>
                </div>
                <button class="task-delete" onclick="dashboard.deleteTask(${task.id})" 
                        title="Delete task">×</button>
            </li>
        `).join('');
    }

    async toggleTask(taskId) {
        try {
            if (this.state) {
                const tasks = this.state.getState('tasks');
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    await this.state.updateTask(taskId, { 
                        ...task, 
                        completed: !task.completed 
                    });
                    
                    if (!task.completed) {
                        // Task was just completed - add XP
                        this.addXP(10);
                        window.app?.showMessage('Task completed! +10 XP 🎉', 'success');
                    }
                }
            }
        } catch (error) {
            console.error('Error toggling task:', error);
            window.app?.showMessage('Error updating task', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            if (this.state) {
                await this.state.deleteTask(taskId);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            window.app?.showMessage('Error deleting task', 'error');
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
            html += `<div class="calendar-day prev-month">${day}</div>`;
        }
        
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isToday(date);
            const isSelected = this.isSameDate(date, this.selectedDate);
            const hasTasks = this.dateHasTasks(date);
            
            html += `<div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}" 
                          onclick="dashboard.selectDate(${year}, ${month}, ${day})">${day}</div>`;
        }
        
        // Next month's leading days
        const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day next-month">${day}</div>`;
        }
        
        gridElement.innerHTML = html;
    }

    selectDate(year, month, day) {
        this.selectedDate = new Date(year, month, day);
        this.updateCalendar();
        this.updateCurrentDate();
        this.displayTasks();
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
        const tasks = this.state?.getState('tasks') || [];
        const dateStr = this.formatDateForAPI(date);
        return tasks.some(task => {
            const taskDate = task.due_date ? task.due_date.split('T')[0] : null;
            return taskDate === dateStr;
        });
    }

    formatDateForAPI(date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    formatDateKey(date) {
        return date.toISOString().split('T')[0]; // Same as API format
    }

    updateCurrentDate() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const isToday = this.isToday(this.selectedDate);
            const dateText = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (isToday) {
                currentDateElement.innerHTML = `${dateText} <span style="color: #48bb78; font-weight: 600;">(Today)</span>`;
            } else {
                currentDateElement.innerHTML = `${dateText} <span style="color: #667eea; font-size: 0.9rem;">(Selected)</span>`;
            }
        }
    }

    // XP System - Enhanced with API integration
    initializeXPSystem() {
        const xpButtons = document.querySelectorAll('.xp-btn');
        const resetBtn = document.getElementById('reset-level');
        
        xpButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const xpAmount = parseInt(btn.getAttribute('data-xp'));
                this.addXP(xpAmount);
            });
        });
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetLevel());
        }
        
        this.loadXPData();
        
        // Subscribe to user updates for XP changes
        if (this.state) {
            this.state.subscribe('user', (user) => {
                if (user) {
                    this.updateXPDisplay(user.level, user.xp);
                }
            });
        }
    }

    loadXPData() {
        const user = this.state?.getState('user');
        if (user) {
            this.updateXPDisplay(user.level || 1, user.xp || 0);
        } else {
            // Fallback to localStorage if no user data
            const level = MalleabilityApp.loadFromStorage('malleability_level', 1);
            const xp = MalleabilityApp.loadFromStorage('malleability_xp', 0);
            this.updateXPDisplay(level, xp);
        }
    }

    async addXP(amount) {
        try {
            if (this.state) {
                const oldUser = this.state.getState('user');
                const result = await this.state.updateUserProgress(amount);
                
                // Check for level up
                if (result.level > (oldUser?.level || 1)) {
                    this.showLevelUpAnimation(result.level);
                }
            } else {
                // Fallback to localStorage
                const currentXP = MalleabilityApp.loadFromStorage('malleability_xp', 0);
                const currentLevel = MalleabilityApp.loadFromStorage('malleability_level', 1);
                
                const newXP = currentXP + amount;
                let newLevel = currentLevel;
                
                // Check for level up
                while (newXP >= this.getXPNeededForLevel(newLevel + 1)) {
                    newLevel++;
                }
                
                MalleabilityApp.saveToStorage('malleability_xp', newXP);
                MalleabilityApp.saveToStorage('malleability_level', newLevel);
                
                this.updateXPDisplay(newLevel, newXP);
                
                if (newLevel > currentLevel) {
                    this.showLevelUpAnimation(newLevel);
                }
                
                window.app?.showMessage(`+${amount} XP earned!`, 'success');
            }
        } catch (error) {
            console.error('Error adding XP:', error);
            window.app?.showMessage('Error updating XP', 'error');
        }
    }

    getXPNeededForLevel(level) {
        return (level - 1) * 100; // 0, 100, 200, 300, etc.
    }

    updateXPDisplay(level, currentXP) {
        const levelElement = document.getElementById('current-level');
        const xpElement = document.getElementById('current-xp');
        const xpNeededElement = document.getElementById('xp-needed');
        const progressElement = document.getElementById('xp-progress');
        
        if (levelElement) levelElement.textContent = level;
        if (xpElement) xpElement.textContent = currentXP;
        
        const xpForNextLevel = this.getXPNeededForLevel(level + 1);
        const xpForCurrentLevel = this.getXPNeededForLevel(level);
        const xpInCurrentLevel = currentXP - xpForCurrentLevel;
        const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
        
        if (xpNeededElement) xpNeededElement.textContent = xpForNextLevel;
        
        if (progressElement) {
            const progressPercent = (xpInCurrentLevel / xpNeededForNext) * 100;
            progressElement.style.width = `${Math.min(progressPercent, 100)}%`;
        }
    }

    showLevelUpAnimation(newLevel) {
        window.app?.showMessage(`🎉 Level Up! You reached Level ${newLevel}! 🎉`, 'success', 4000);
        
        // Add some visual celebration
        const xpWidget = document.querySelector('.xp-widget');
        if (xpWidget) {
            xpWidget.classList.add('level-up-celebration');
            setTimeout(() => {
                xpWidget.classList.remove('level-up-celebration');
            }, 2000);
        }
    }

    async resetLevel() {
        if (!confirm('Are you sure you want to reset your level and XP?')) return;
        
        try {
            if (this.state) {
                // Reset to 0 XP (which should set level to 1)
                const user = this.state.getState('user');
                if (user) {
                    await this.state.updateUserProgress(-user.xp);
                }
            } else {
                MalleabilityApp.saveToStorage('malleability_level', 1);
                MalleabilityApp.saveToStorage('malleability_xp', 0);
                this.updateXPDisplay(1, 0);
            }
            
            window.app?.showMessage('Level and XP reset!', 'info');
        } catch (error) {
            console.error('Error resetting level:', error);
            window.app?.showMessage('Error resetting level', 'error');
        }
    }

    // Quotes System - API Integration
    async initializeQuotes() {
        const newQuoteBtn = document.getElementById('new-quote-btn');
        const addQuoteBtn = document.getElementById('add-quote-btn');
        const deleteQuoteBtn = document.getElementById('delete-quote-btn');
        const saveQuoteBtn = document.getElementById('save-quote-btn');
        const cancelQuoteBtn = document.getElementById('cancel-quote-btn');
        
        if (newQuoteBtn) {
            newQuoteBtn.addEventListener('click', () => this.showRandomQuote());
        }
        
        if (addQuoteBtn) {
            addQuoteBtn.addEventListener('click', () => this.showAddQuoteForm());
        }
        
        if (deleteQuoteBtn) {
            deleteQuoteBtn.addEventListener('click', () => this.deleteSelectedQuote());
        }
        
        if (saveQuoteBtn) {
            saveQuoteBtn.addEventListener('click', () => this.saveCustomQuote());
        }
        
        if (cancelQuoteBtn) {
            cancelQuoteBtn.addEventListener('click', () => this.hideAddQuoteForm());
        }
        
        // Load quotes from API
        await this.loadQuotes();
        
        // Get quotes from state and display immediately
        const quotes = this.state?.getState('quotes') || [];
        this.updateQuoteSelector(quotes);
        if (quotes.length > 0) {
            this.showRandomQuote(quotes);
        } else {
            this.displayQuote("No quotes available. Add some quotes to get started!", "Malleability Team");
        }
        
        // Subscribe to quote updates for future changes
        if (this.state) {
            this.state.subscribe('quotes', (quotes) => {
                this.updateQuoteSelector(quotes);
                if (quotes.length > 0) {
                    this.showRandomQuote(quotes);
                }
            });
        }
    }

    async loadQuotes() {
        try {
            if (this.state) {
                await this.state.loadQuotes();
            }
        } catch (error) {
            console.error('Error loading quotes:', error);
            window.app?.showMessage('Error loading quotes', 'error');
        }
    }

    updateQuoteSelector(quotes = null) {
        const selector = document.getElementById('quote-selector');
        if (!selector) return;
        
        const allQuotes = quotes || this.state?.getState('quotes') || [];
        
        selector.innerHTML = '<option value="">Select a quote to manage...</option>';
        allQuotes.forEach((quote, index) => {
            const truncatedText = quote.text.length > 50 ? 
                quote.text.substring(0, 50) + '...' : quote.text;
            selector.innerHTML += `<option value="${quote.id}">${truncatedText} - ${quote.author}</option>`;
        });
    }

    showRandomQuote(quotes = null) {
        const allQuotes = quotes || this.state?.getState('quotes') || [];
        
        if (allQuotes.length === 0) {
            this.displayQuote("No quotes available. Add some quotes to get started!", "Malleability Team");
            return;
        }
        
        const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        this.displayQuote(randomQuote.text, randomQuote.author);
    }

    displayQuote(text, author) {
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        if (quoteText) quoteText.textContent = `"${text}"`;
        if (quoteAuthor) quoteAuthor.textContent = `— ${author}`;
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
        const quoteInput = document.getElementById('quote-input');
        const authorInput = document.getElementById('author-input');
        
        if (form) form.classList.add('hidden');
        if (quoteInput) quoteInput.value = '';
        if (authorInput) authorInput.value = '';
    }

    async saveCustomQuote() {
        const quoteInput = document.getElementById('quote-input');
        const authorInput = document.getElementById('author-input');
        
        const quoteText = quoteInput.value.trim();
        const authorName = authorInput.value.trim();
        
        if (!quoteText || !authorName) {
            window.app?.showMessage('Please fill in both quote and author fields', 'error');
            return;
        }
        
        const quoteData = {
            text: quoteText,
            author: authorName,
            category: 'custom'
        };
        
        try {
            if (this.state) {
                await this.state.createQuote(quoteData);
                this.hideAddQuoteForm();
                // State subscription will automatically update the UI
            }
        } catch (error) {
            console.error('Error saving quote:', error);
            window.app?.showMessage('Error saving quote', 'error');
        }
    }

    async deleteSelectedQuote() {
        const selector = document.getElementById('quote-selector');
        if (!selector || !selector.value) {
            window.app?.showMessage('Please select a quote to delete', 'error');
            return;
        }
        
        if (!confirm('Are you sure you want to delete this quote?')) return;
        
        try {
            if (this.state) {
                await this.state.deleteQuote(selector.value);
                selector.value = '';
                // State subscription will automatically update the UI
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            window.app?.showMessage('Error deleting quote', 'error');
        }
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to initialize before starting dashboard
    setTimeout(() => {
        dashboard = new DashboardManager();
        window.dashboard = dashboard; // Make it globally accessible for onclick handlers
    }, 300); // Increased timeout to ensure app is fully loaded
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