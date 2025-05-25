// Simple State Management for Malleability App
class StateManager {
    constructor() {
        this.state = {
            user: null,
            tasks: [],
            quotes: [],
            subjects: [],
            topics: {},
            loading: false,
            notifications: []
        };
        this.listeners = {};
        this.api = null; // Will be set by main app
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        };
    }

    // Update state and notify listeners
    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                callback(value, oldValue);
            });
        }
    }

    // Get current state value
    getState(key) {
        return this.state[key];
    }

    // Update nested state (e.g., topics by subject)
    updateNestedState(key, nestedKey, value) {
        if (!this.state[key]) {
            this.state[key] = {};
        }
        this.state[key][nestedKey] = value;
        
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                callback(this.state[key], this.state[key]);
            });
        }
    }

    // Async actions with loading states
    async performAction(actionName, asyncFn) {
        this.setState('loading', true);
        try {
            const result = await asyncFn();
            this.addNotification(`${actionName} completed successfully`, 'success');
            return result;
        } catch (error) {
            this.addNotification(`${actionName} failed: ${error.message}`, 'error');
            throw error;
        } finally {
            this.setState('loading', false);
        }
    }

    // Notification system
    addNotification(message, type = 'info', duration = 5000) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            timestamp: new Date()
        };
        
        const notifications = [...this.state.notifications, notification];
        this.setState('notifications', notifications);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, duration);
        }
        
        return notification.id;
    }

    removeNotification(id) {
        const notifications = this.state.notifications.filter(n => n.id !== id);
        this.setState('notifications', notifications);
    }

    // User management
    async loadUser() {
        return this.performAction('Load user', async () => {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                this.setState('user', data.user);
                return data.user;
            }
            throw new Error('Failed to load user');
        });
    }

    async updateUserProgress(xpGained) {
        return this.performAction('Update progress', async () => {
            const response = await fetch('/api/user/progress', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ xp_gained: xpGained })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.setState('user', { 
                    ...this.state.user, 
                    xp: result.xp, 
                    level: result.level 
                });
                return result;
            }
            throw new Error('Failed to update progress');
        });
    }

    // Task management
    async loadTasks() {
        return this.performAction('Load tasks', async () => {
            const response = await fetch('/api/tasks');
            if (response.ok) {
                const data = await response.json();
                this.setState('tasks', data.tasks);
                return data.tasks;
            }
            throw new Error('Failed to load tasks');
        });
    }

    async createTask(taskData) {
        return this.performAction('Create task', async () => {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            
            if (response.ok) {
                const result = await response.json();
                // Reload tasks to get updated list
                await this.loadTasks();
                return result;
            }
            throw new Error('Failed to create task');
        });
    }

    async updateTask(taskId, taskData) {
        return this.performAction('Update task', async () => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            
            if (response.ok) {
                await this.loadTasks();
                return await response.json();
            }
            throw new Error('Failed to update task');
        });
    }

    async deleteTask(taskId) {
        return this.performAction('Delete task', async () => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await this.loadTasks();
                return await response.json();
            }
            throw new Error('Failed to delete task');
        });
    }

    // Subject and topic management
    async loadSubjects() {
        return this.performAction('Load subjects', async () => {
            const response = await fetch('/api/subjects');
            if (response.ok) {
                const data = await response.json();
                this.setState('subjects', data.subjects);
                return data.subjects;
            }
            throw new Error('Failed to load subjects');
        });
    }

    async loadTopics(subjectId) {
        return this.performAction('Load topics', async () => {
            const response = await fetch(`/api/subjects/${subjectId}/topics`);
            if (response.ok) {
                const data = await response.json();
                this.updateNestedState('topics', subjectId, data.topics);
                return data.topics;
            }
            throw new Error('Failed to load topics');
        });
    }

    // Quote management
    async loadQuotes() {
        return this.performAction('Load quotes', async () => {
            const response = await fetch('/api/quotes');
            if (response.ok) {
                const data = await response.json();
                this.setState('quotes', data.quotes);
                return data.quotes;
            }
            throw new Error('Failed to load quotes');
        });
    }

    async createQuote(quoteData) {
        return this.performAction('Create quote', async () => {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteData)
            });
            
            if (response.ok) {
                await this.loadQuotes();
                return await response.json();
            }
            throw new Error('Failed to create quote');
        });
    }

    async deleteQuote(quoteId) {
        return this.performAction('Delete quote', async () => {
            const response = await fetch(`/api/quotes/${quoteId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await this.loadQuotes();
                return await response.json();
            }
            throw new Error('Failed to delete quote');
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
} else {
    window.StateManager = StateManager;
} 