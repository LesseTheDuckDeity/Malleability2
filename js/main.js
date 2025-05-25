// Main JavaScript file with shared utilities
class MalleabilityApp {
    constructor() {
        this.currentUser = null;
        this.initializeApp();
    }

    initializeApp() {
        this.loadUserSession();
        this.initializeNavigation();
        this.initializeSharedComponents();
        this.initializeLearningTopics();
    }

    // User Session Management
    loadUserSession() {
        const userData = localStorage.getItem('malleability_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUIForLoggedInUser();
            } catch (error) {
                console.error('Error loading user session:', error);
                localStorage.removeItem('malleability_user');
            }
        }
    }

    setUser(user) {
        this.currentUser = user;
        localStorage.setItem('malleability_user', JSON.stringify(user));
        this.updateUIForLoggedInUser();
    }

    logout() {
        this.currentUser = null;
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
    }

    updateUIForLoggedOutUser() {
        // Update any global UI elements for logged out user
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(el => {
            el.textContent = 'Guest';
        });
    }

    // Navigation
    initializeNavigation() {
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

        // Set active menu item based on current page
        this.setActiveMenuItemFromURL();
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
            if (href && (currentPath.endsWith(href) || 
                (currentPath.endsWith('/') && href === 'index.html') ||
                (currentPath.endsWith('index.html') && href === 'index.html'))) {
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
            const current = Math.floor(progress * (end - start) + start);
            obj.innerHTML = current;
            if (callback) callback(current, progress);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.max(1 - progress, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        requestAnimationFrame(animate);
    }
}

// Initialize the app
const app = new MalleabilityApp();

// Export for use in other modules
window.MalleabilityApp = MalleabilityApp;
window.app = app; 