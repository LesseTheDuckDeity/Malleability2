// Simple Component System for Malleability App
class Component {
    constructor(element, props = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.props = props;
        this.state = {};
        this.eventListeners = [];
        
        if (this.element) {
            this.init();
        }
    }

    // Override in subclasses
    init() {}
    render() {}
    destroy() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }

    // Helper to add tracked event listeners
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    // Update component state and re-render
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    // Helper to create elements
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key.startsWith('on')) {
                const event = key.slice(2).toLowerCase();
                this.addEventListener(element, event, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });

        return element;
    }
}

// Task Component
class TaskComponent extends Component {
    init() {
        this.render();
    }

    render() {
        if (!this.element) return;

        const { task } = this.props;
        const { editing } = this.state;

        if (editing) {
            this.renderEditForm(task);
        } else {
            this.renderTaskCard(task);
        }
    }

    renderTaskCard(task) {
        this.element.innerHTML = '';
        this.element.className = `task-card ${task.completed ? 'completed' : ''} priority-${task.priority?.toLowerCase() || 'medium'}`;

        const checkbox = this.createElement('input', {
            type: 'checkbox',
            checked: task.completed,
            className: 'task-checkbox',
            onChange: () => this.toggleComplete(task)
        });

        const content = this.createElement('div', { className: 'task-content' }, [
            this.createElement('h4', { className: 'task-title' }, [task.title]),
            this.createElement('p', { className: 'task-description' }, [task.description || '']),
            this.createElement('div', { className: 'task-meta' }, [
                this.createElement('span', { className: 'task-due' }, [
                    task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'
                ]),
                this.createElement('span', { className: `task-priority priority-${task.priority?.toLowerCase()}` }, [
                    task.priority || 'Medium'
                ])
            ])
        ]);

        const actions = this.createElement('div', { className: 'task-actions' }, [
            this.createElement('button', {
                className: 'btn-edit',
                onClick: () => this.setState({ editing: true })
            }, ['✏️']),
            this.createElement('button', {
                className: 'btn-delete',
                onClick: () => this.deleteTask(task)
            }, ['🗑️'])
        ]);

        this.element.appendChild(checkbox);
        this.element.appendChild(content);
        this.element.appendChild(actions);
    }

    renderEditForm(task) {
        this.element.innerHTML = '';
        this.element.className = 'task-edit-form';

        const form = this.createElement('form', {
            onSubmit: (e) => this.saveTask(e, task)
        }, [
            this.createElement('input', {
                type: 'text',
                value: task.title,
                placeholder: 'Task title',
                required: true,
                name: 'title'
            }),
            this.createElement('textarea', {
                placeholder: 'Task description',
                name: 'description',
                value: task.description || ''
            }, [task.description || '']),
            this.createElement('input', {
                type: 'date',
                name: 'due_date',
                value: task.due_date || ''
            }),
            this.createElement('select', { name: 'priority' }, [
                this.createElement('option', { value: 'Low' }, ['Low']),
                this.createElement('option', { value: 'Medium', selected: task.priority === 'Medium' }, ['Medium']),
                this.createElement('option', { value: 'High', selected: task.priority === 'High' }, ['High'])
            ]),
            this.createElement('div', { className: 'form-actions' }, [
                this.createElement('button', { type: 'submit', className: 'btn-save' }, ['Save']),
                this.createElement('button', {
                    type: 'button',
                    className: 'btn-cancel',
                    onClick: () => this.setState({ editing: false })
                }, ['Cancel'])
            ])
        ]);

        this.element.appendChild(form);
    }

    async toggleComplete(task) {
        if (this.props.onUpdate) {
            await this.props.onUpdate(task.id, { ...task, completed: !task.completed });
        }
    }

    async saveTask(e, task) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedTask = {
            ...task,
            title: formData.get('title'),
            description: formData.get('description'),
            due_date: formData.get('due_date'),
            priority: formData.get('priority')
        };

        if (this.props.onUpdate) {
            await this.props.onUpdate(task.id, updatedTask);
        }
        this.setState({ editing: false });
    }

    async deleteTask(task) {
        if (confirm('Are you sure you want to delete this task?')) {
            if (this.props.onDelete) {
                await this.props.onDelete(task.id);
            }
        }
    }
}

// Quote Component
class QuoteComponent extends Component {
    init() {
        this.render();
    }

    render() {
        if (!this.element) return;

        const { quote } = this.props;
        
        this.element.innerHTML = '';
        this.element.className = 'quote-card';

        const quoteText = this.createElement('blockquote', { className: 'quote-text' }, [
            `"${quote.text}"`
        ]);

        const author = this.createElement('cite', { className: 'quote-author' }, [
            `— ${quote.author}`
        ]);

        const actions = this.createElement('div', { className: 'quote-actions' }, [
            this.createElement('button', {
                className: 'btn-delete-quote',
                onClick: () => this.deleteQuote(quote),
                title: 'Delete quote'
            }, ['🗑️'])
        ]);

        this.element.appendChild(quoteText);
        this.element.appendChild(author);
        this.element.appendChild(actions);
    }

    async deleteQuote(quote) {
        if (confirm('Are you sure you want to delete this quote?')) {
            if (this.props.onDelete) {
                await this.props.onDelete(quote.id);
            }
        }
    }
}

// User Progress Component
class UserProgressComponent extends Component {
    init() {
        this.render();
        
        // Subscribe to state changes
        if (window.app && window.app.state) {
            window.app.state.subscribe('user', (user) => {
                this.props.user = user;
                this.render();
            });
        }
    }

    render() {
        if (!this.element) return;

        const { user } = this.props;
        if (!user) return;

        const currentLevel = user.level || 1;
        const currentXP = user.xp || 0;
        const nextLevelXP = currentLevel * 100; // Next level requirement
        const currentLevelXP = (currentLevel - 1) * 100; // Current level base
        const progressXP = currentXP - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        const progressPercent = (progressXP / requiredXP) * 100;

        this.element.innerHTML = '';
        this.element.className = 'user-progress';

        const levelInfo = this.createElement('div', { className: 'level-info' }, [
            this.createElement('span', { className: 'level-text' }, [`Level ${currentLevel}`]),
            this.createElement('span', { className: 'xp-text' }, [`${currentXP} XP`])
        ]);

        const progressBar = this.createElement('div', { className: 'progress-bar' }, [
            this.createElement('div', {
                className: 'progress-fill',
                style: `width: ${Math.min(progressPercent, 100)}%`
            })
        ]);

        const progressText = this.createElement('div', { className: 'progress-text' }, [
            `${progressXP}/${requiredXP} XP to Level ${currentLevel + 1}`
        ]);

        this.element.appendChild(levelInfo);
        this.element.appendChild(progressBar);
        this.element.appendChild(progressText);
    }
}

// Notification Component
class NotificationComponent extends Component {
    init() {
        this.render();
        
        // Subscribe to notifications
        if (window.app && window.app.state) {
            window.app.state.subscribe('notifications', (notifications) => {
                this.renderNotifications(notifications);
            });
        }
    }

    render() {
        if (!this.element) return;
        this.element.className = 'notifications-container';
    }

    renderNotifications(notifications) {
        if (!this.element) return;

        this.element.innerHTML = '';

        notifications.forEach(notification => {
            const notificationEl = this.createElement('div', {
                className: `notification notification-${notification.type}`,
                'data-id': notification.id
            }, [
                this.createElement('span', { className: 'notification-message' }, [notification.message]),
                this.createElement('button', {
                    className: 'notification-close',
                    onClick: () => this.removeNotification(notification.id)
                }, ['×'])
            ]);

            this.element.appendChild(notificationEl);

            // Animate in
            setTimeout(() => notificationEl.classList.add('show'), 10);
        });
    }

    removeNotification(id) {
        if (window.app && window.app.state) {
            window.app.state.removeNotification(id);
        }
    }
}

// Export components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Component,
        TaskComponent,
        QuoteComponent,
        UserProgressComponent,
        NotificationComponent
    };
} else {
    window.Components = {
        Component,
        TaskComponent,
        QuoteComponent,
        UserProgressComponent,
        NotificationComponent
    };
} 