// Main JavaScript file with shared utilities and API integration
class MalleabilityApp {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = '';  // Since we're serving from same origin
        this.state = new StateManager(); // Initialize state manager
        this.initializeApp();
    }

    async initializeApp() {
        this.loadUserSession();
        this.initializeNavigation();
        this.initializeSharedComponents();
        this.initializeLearningTopics();
        await this.loadInitialData();
    }

    // API Integration
    async loadInitialData() {
        try {
            // Load user data from API
            await this.loadUserFromAPI();
            
            // Load subjects data if on relevant pages
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                await this.state.loadSubjects();
                // Note: quotes and tasks are loaded by DashboardManager to avoid timing conflicts
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    async loadUserFromAPI() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/user`);
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    this.currentUser = data.user;
                    this.state.setState('user', data.user);
                    this.updateUIForLoggedInUser();
                }
            }
        } catch (error) {
            console.error('Error loading user from API:', error);
        }
    }

    async loadSubjects() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/subjects`);
            if (response.ok) {
                const data = await response.json();
                return data.subjects || [];
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            return [];
        }
    }

    async loadTopics(subjectId) {
        try {
            console.log('📋 Loading topics for subject ID:', subjectId);
            const response = await fetch(`${this.apiBaseUrl}/api/subjects/${subjectId}/topics`);
            if (response.ok) {
                const data = await response.json();
                console.log('📋 Topics loaded successfully:', data.topics?.length || 0, 'topics');
                return data.topics || [];
            } else {
                console.log('❌ Failed to load topics. Status:', response.status);
                return [];
            }
        } catch (error) {
            console.error('💥 Error loading topics:', error);
            return [];
        }
    }

    async loadTasks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks`);
            if (response.ok) {
                const data = await response.json();
                return data.tasks || [];
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    async createTask(taskData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            if (response.ok) {
                const result = await response.json();
                this.showMessage('Task created successfully!', 'success');
                return result;
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            this.showMessage('Error creating task', 'error');
            throw error;
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            if (response.ok) {
                this.showMessage('Task updated successfully!', 'success');
                return await response.json();
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showMessage('Error updating task', 'error');
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.showMessage('Task deleted successfully!', 'success');
                return await response.json();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showMessage('Error deleting task', 'error');
            throw error;
        }
    }

    async loadQuotes() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/quotes`);
            if (response.ok) {
                const data = await response.json();
                return data.quotes || [];
            }
        } catch (error) {
            console.error('Error loading quotes:', error);
            return [];
        }
    }

    async createQuote(quoteData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData)
            });
            if (response.ok) {
                this.showMessage('Quote added successfully!', 'success');
                return await response.json();
            } else {
                throw new Error('Failed to add quote');
            }
        } catch (error) {
            console.error('Error adding quote:', error);
            this.showMessage('Error adding quote', 'error');
            throw error;
        }
    }

    async deleteQuote(quoteId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/quotes/${quoteId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.showMessage('Quote deleted successfully!', 'success');
                return await response.json();
            } else {
                throw new Error('Failed to delete quote');
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            this.showMessage('Error deleting quote', 'error');
            throw error;
        }
    }

    async updateUserProgress(xpGained) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/user/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ xp_gained: xpGained })
            });
            if (response.ok) {
                const result = await response.json();
                this.currentUser.xp = result.xp;
                this.currentUser.level = result.level;
                this.state.setState('user', this.currentUser);
                this.updateUIForLoggedInUser();
                
                if (result.xp_gained > 0) {
                    this.showMessage(`You gained ${result.xp_gained} XP!`, 'success');
                }
                
                return result;
            } else {
                throw new Error('Failed to update progress');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            this.showMessage('Error updating progress', 'error');
            throw error;
        }
    }

    // User Session Management
    loadUserSession() {
        const userData = localStorage.getItem('malleability_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.state.setState('user', this.currentUser);
                this.updateUIForLoggedInUser();
            } catch (error) {
                console.error('Error loading user session:', error);
                localStorage.removeItem('malleability_user');
            }
        }
    }

    setUser(user) {
        this.currentUser = user;
        this.state.setState('user', user);
        localStorage.setItem('malleability_user', JSON.stringify(user));
        this.updateUIForLoggedInUser();
    }

    logout() {
        this.currentUser = null;
        this.state.setState('user', null);
        localStorage.removeItem('malleability_user');
        localStorage.removeItem('malleability_profile');
        this.updateUIForLoggedOutUser();
        
        // Redirect to profile page to show login
        if (window.location.pathname.includes('profile.html')) {
            window.location.reload();
        }
    }

    updateUIForLoggedInUser() {
        // Update any global UI elements for logged in user
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(el => {
            el.textContent = this.currentUser.name || this.currentUser.email;
        });

        // Update XP and level displays
        const xpElements = document.querySelectorAll('.user-xp');
        xpElements.forEach(el => {
            el.textContent = this.currentUser.xp || 0;
        });

        const levelElements = document.querySelectorAll('.user-level');
        levelElements.forEach(el => {
            el.textContent = this.currentUser.level || 1;
        });
    }

    updateUIForLoggedOutUser() {
        // Update any global UI elements for logged out user
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(el => {
            el.textContent = 'Guest';
        });
    }

    // Navigation - Updated to load subjects dynamically
    initializeNavigation() {
        // Set active menu item based on current page
        this.setActiveMenuItemFromURL();
        this.loadDynamicMenu();
    }

    async loadDynamicMenu() {
        try {
            // Load subjects from API
            const subjects = await this.loadSubjects();
            this.generateDynamicMenu(subjects);
        } catch (error) {
            console.error('Error loading dynamic menu:', error);
        }
    }

    generateDynamicMenu(subjects) {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        if (!sidebarMenu) return;

        // Clear existing menu items except Home and Profile
        sidebarMenu.innerHTML = '';

        // Add Home
        sidebarMenu.innerHTML += `
            <li><a href="/" class="menu-item" data-page="home">🏠 Home</a></li>
        `;

        // Add subjects from database using IDs
        subjects.forEach(subject => {
            const emoji = this.getSubjectEmoji(subject.name);
            
            sidebarMenu.innerHTML += `
                <li><a href="/subject/${subject.id}" class="menu-item" data-page="subject-${subject.id}">${emoji} ${subject.name}</a></li>
            `;
        });

        // Add Profile
        sidebarMenu.innerHTML += `
            <li><a href="/pages/profile.html" class="menu-item" data-page="profile">👤 Profile</a></li>
        `;

        // Re-initialize menu item click handlers
        this.initializeMenuItemHandlers();
        this.setActiveMenuItemFromURL();
    }

    getSubjectEmoji(subjectName) {
        const emojiMap = {
            'Biology': '🧬',
            'Chemistry': '⚗️',
            'Physics': '⚛️',
            'Mathematics': '🔢',
            'Latin': '🏛️',
            'Music Theory': '🎵',
            'Psychology': '🧠',
            'Politics': '🏛️',
            'Programming': '💻'
        };
        return emojiMap[subjectName] || '📚';
    }

    initializeMenuItemHandlers() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Let normal link behavior handle navigation
                // but update active state if on same page
                if (e.target.href === window.location.href) {
                    e.preventDefault();
                    this.setActiveMenuItem(e.target);
                }
            });
        });
    }

    setActiveMenuItem(activeItem) {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        activeItem.classList.add('active');
    }

    setActiveMenuItemFromURL() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            
            // Check if this menu item corresponds to current page
            const href = item.getAttribute('href');
            if (href && (
                currentPath === href || 
                (currentPath === '/' && href === '/') ||
                (currentPath.startsWith('/subject/') && href.startsWith('/subject/') && currentPath === href)
            )) {
                item.classList.add('active');
            }
        });
    }

    // Learning Topics Functionality
    initializeLearningTopics() {
        const topicHeaders = document.querySelectorAll('.topic-header');
        topicHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const topic = header.parentElement;
                topic.classList.toggle('expanded');
            });
        });

        // Expand first topic by default
        const firstTopic = document.querySelector('.topic');
        if (firstTopic) {
            firstTopic.classList.add('expanded');
        }
    }

    // Shared Components
    initializeSharedComponents() {
        this.initializeMessages();
    }

    initializeMessages() {
        // Create a global message system
        window.showMessage = (message, type = 'info', duration = 5000) => {
            this.showMessage(message, type, duration);
        };
    }

    showMessage(message, type = 'info', duration = 5000) {
        // Try to find messages area, create if not exists
        let messagesArea = document.getElementById('messages-area');
        if (!messagesArea) {
            messagesArea = document.createElement('div');
            messagesArea.id = 'messages-area';
            messagesArea.style.position = 'fixed';
            messagesArea.style.top = '20px';
            messagesArea.style.right = '20px';
            messagesArea.style.zIndex = '10000';
            messagesArea.style.maxWidth = '400px';
            document.body.appendChild(messagesArea);
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.style.cssText = `
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        messageEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 18px; margin-left: 10px;">&times;</button>
            </div>
        `;

        messagesArea.appendChild(messageEl);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, duration);
        }
    }

    // Utility Functions
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Storage Utilities
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return defaultValue;
        }
    }

    // Animation Utilities
    static animateValue(obj, start, end, duration, callback) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = start + (end - start) * progress;
            if (callback) callback(value);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        let startTimestamp = null;
        const animate = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.style.opacity = progress;
            if (progress < 1) {
                window.requestAnimationFrame(animate);
            }
        };
        window.requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let startTimestamp = null;
        const animate = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.style.opacity = 1 - progress;
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                window.requestAnimationFrame(animate);
            }
        };
        window.requestAnimationFrame(animate);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MalleabilityApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MalleabilityApp;
} 