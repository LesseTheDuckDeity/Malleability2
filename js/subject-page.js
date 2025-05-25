// Subject page dynamic content loader
class SubjectPageManager {
    constructor() {
        this.currentSubject = null;
        this.state = null;
        this.initializePage();
    }

    async initializePage() {
        // Wait for app initialization
        await this.waitForApp();
        
        // Get subject from URL
        const subjectId = this.getSubjectFromURL();
        if (subjectId) {
            await this.loadSubjectData(subjectId);
        }
    }

    async waitForApp() {
        return new Promise((resolve) => {
            const checkApp = () => {
                if (window.app && window.app.state) {
                    this.state = window.app.state;
                    resolve();
                } else {
                    setTimeout(checkApp, 100);
                }
            };
            checkApp();
        });
    }

    getSubjectFromURL() {
        const path = window.location.pathname;
        // New ID-based URL pattern: /subject/:subjectId
        const match = path.match(/\/subject\/(\d+)$/);
        if (match) {
            return parseInt(match[1]);
        }
        return null;
    }

    async loadSubjectData(subjectId) {
        try {
            // Load subjects from API
            const subjects = await window.app.loadSubjects();
            this.currentSubject = subjects.find(s => s.id === subjectId);
            
            if (this.currentSubject) {
                await this.renderSubjectInfo();
                await this.loadTopics();
                await this.loadResources();
                await this.loadQuizzes();
            } else {
                this.showError(`Subject with ID ${subjectId} not found`);
            }
        } catch (error) {
            console.error('Error loading subject data:', error);
            this.showError('Failed to load subject data');
        }
    }

    async renderSubjectInfo() {
        const titleElement = document.getElementById('subject-title');
        const descriptionElement = document.getElementById('subject-description');
        
        if (titleElement && this.currentSubject) {
            const emoji = this.currentSubject.emoji || window.app.getSubjectEmoji(this.currentSubject.name);
            titleElement.textContent = `${emoji} ${this.currentSubject.name}`;
        }
        
        if (descriptionElement && this.currentSubject) {
            descriptionElement.textContent = this.currentSubject.description || 
                `Explore the fascinating world of ${this.currentSubject.name.toLowerCase()}. Master concepts, practice with exercises, and test your knowledge.`;
        }

        // Add dynamic content section if content exists
        if (this.currentSubject.content) {
            this.renderSubjectContent();
        }
    }

    renderSubjectContent() {
        const subjectContent = document.querySelector('.subject-content');
        if (!subjectContent || !this.currentSubject.content) return;

        // Check if content section already exists
        let contentSection = document.getElementById('subject-content-section');
        if (!contentSection) {
            // Create content section and insert it as the first section
            contentSection = document.createElement('section');
            contentSection.id = 'subject-content-section';
            contentSection.className = 'subject-section';
            
            const firstSection = subjectContent.querySelector('.subject-section');
            if (firstSection) {
                subjectContent.insertBefore(contentSection, firstSection);
            } else {
                subjectContent.appendChild(contentSection);
            }
        }

        contentSection.innerHTML = `
            <h2>📖 Course Overview</h2>
            <div class="subject-content-body">
                ${this.currentSubject.content}
            </div>
        `;
    }

    async loadTopics() {
        try {
            const topics = await window.app.loadTopics(this.currentSubject.id);
            this.renderTopics(topics);
        } catch (error) {
            console.error('Error loading topics:', error);
            this.renderTopics([]);
        }
    }

    renderTopics(topics) {
        const container = document.getElementById('topics-container');
        if (!container) return;

        if (topics.length === 0) {
            container.innerHTML = '<div class="no-content">No topics available yet.</div>';
            return;
        }

        container.innerHTML = topics.map(topic => `
            <div class="topic-card">
                <h3><a href="${this.getTopicURL(topic)}">${topic.name}</a></h3>
                <p>${topic.description}</p>
                <div class="topic-meta">
                    <span class="difficulty ${topic.difficulty?.toLowerCase()}">${topic.difficulty || 'Beginner'}</span>
                    <span class="duration">${topic.duration || '30 min read'}</span>
                </div>
            </div>
        `).join('');
    }

    getTopicURL(topic) {
        return `/subject/${this.currentSubject.id}/topic/${topic.id}`;
    }

    async loadResources() {
        // Load dynamic resources from the subject data
        this.renderResources();
    }

    renderResources() {
        const container = document.getElementById('resources-list');
        if (!container) return;

        let resources = [];
        
        // Try to parse resources from the subject data
        if (this.currentSubject && this.currentSubject.resources) {
            try {
                resources = JSON.parse(this.currentSubject.resources);
            } catch (error) {
                console.error('Error parsing resources:', error);
                resources = [];
            }
        }

        // If no dynamic resources, fall back to static resources
        if (resources.length === 0) {
            resources = this.getStaticResources();
            container.innerHTML = resources.map(resource => `<li>${resource}</li>`).join('');
        } else {
            // Render dynamic resources with proper formatting
            container.innerHTML = resources.map(resource => `
                <li>
                    <strong>${resource.title}</strong> - ${resource.description}
                    ${resource.url ? `<br><small><a href="${resource.url}" target="_blank" rel="noopener noreferrer">🔗 Visit Resource</a></small>` : ''}
                    <span class="resource-type">[${this.formatResourceType(resource.type)}]</span>
                </li>
            `).join('');
        }
    }

    formatResourceType(type) {
        const typeMap = {
            'textbook': 'Textbook',
            'online_course': 'Online Course',
            'video_series': 'Video Series',
            'research': 'Research',
            'reference': 'Reference',
            'software': 'Software',
            'interactive_tool': 'Interactive Tool',
            'professional': 'Professional',
            'online_resource': 'Online Resource',
            'video_course': 'Video Course'
        };
        return typeMap[type] || type;
    }

    getStaticResources() {
        const resourceMap = {
            'Biology': [
                '<strong>Campbell Biology</strong> - The definitive textbook for comprehensive biology education',
                '<strong>Khan Academy Biology</strong> - Free online courses with interactive lessons',
                '<strong>CrashCourse Biology</strong> - Engaging video series covering major topics',
                '<strong>Nature Education</strong> - Scientific articles and research papers',
                '<strong>BiologyOnline</strong> - Dictionary and study guides for terminology'
            ],
            'Chemistry': [
                '<strong>Atkins Physical Chemistry</strong> - Advanced textbook for physical chemistry',
                '<strong>ChemLibreTexts</strong> - Comprehensive online chemistry library',
                '<strong>Periodic Table Pro</strong> - Interactive periodic table with detailed elements',
                '<strong>ChemSketch</strong> - Software for drawing chemical structures',
                '<strong>MIT Chemistry Lectures</strong> - Free university-level chemistry courses'
            ]
        };

        return resourceMap[this.currentSubject?.name] || [
            '<strong>Khan Academy</strong> - Free online courses for all subjects',
            '<strong>MIT OpenCourseWare</strong> - Free university-level courses',
            '<strong>Coursera</strong> - Online courses from top universities',
            '<strong>edX</strong> - High-quality education from leading institutions'
        ];
    }

    async loadQuizzes() {
        // Load real quizzes from the API using the quiz component
        if (this.currentSubject && this.currentSubject.id) {
            // Initialize quiz component for subject-level quizzes
            if (!window.subjectQuizComponent) {
                window.subjectQuizComponent = new QuizComponent('quizzes-container', {
                    showResults: true,
                    allowNavigation: true
                });
            }
            
            // Load subject-level quizzes
            await window.subjectQuizComponent.loadSubjectQuizzes(this.currentSubject.id);
        } else {
            this.renderQuizzes();
        }
    }

    renderQuizzes() {
        const container = document.getElementById('quizzes-container');
        if (!container) return;

        const quizzes = this.getStaticQuizzes();
        container.innerHTML = quizzes.map(quiz => `
            <div class="quiz-card">
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <div class="quiz-details">
                    <span class="questions">${quiz.questions} questions</span>
                    <span class="duration">${quiz.duration} minutes</span>
                    <span class="difficulty ${quiz.level?.toLowerCase()}">${quiz.level}</span>
                </div>
                <button class="btn btn-primary" onclick="subjectPage.startQuiz('${quiz.id}')">Start Quiz</button>
            </div>
        `).join('');
    }

    getStaticQuizzes() {
        const quizMap = {
            'Biology': [
                {
                    id: 'cell-biology',
                    title: '🔬 Cell Biology Quiz',
                    description: 'Test your knowledge of cell structure and functions',
                    questions: 15,
                    duration: 20,
                    level: 'Beginner'
                },
                {
                    id: 'genetics',
                    title: '🧬 Genetics Quiz',
                    description: 'Assess your understanding of inheritance and DNA',
                    questions: 20,
                    duration: 25,
                    level: 'Intermediate'
                },
                {
                    id: 'evolution',
                    title: '🌿 Evolution Quiz',
                    description: 'Evaluate your knowledge of evolutionary processes',
                    questions: 18,
                    duration: 22,
                    level: 'Intermediate'
                }
            ],
            'Chemistry': [
                {
                    id: 'atomic-structure',
                    title: '⚛️ Atomic Structure Quiz',
                    description: 'Test your understanding of atoms and electron configuration',
                    questions: 15,
                    duration: 20,
                    level: 'Beginner'
                },
                {
                    id: 'chemical-bonding',
                    title: '🔗 Chemical Bonding Quiz',
                    description: 'Assess your knowledge of ionic and covalent bonds',
                    questions: 18,
                    duration: 25,
                    level: 'Intermediate'
                },
                {
                    id: 'organic-chemistry',
                    title: '🧪 Organic Chemistry Quiz',
                    description: 'Evaluate your understanding of carbon compounds',
                    questions: 22,
                    duration: 30,
                    level: 'Advanced'
                }
            ]
        };

        return quizMap[this.currentSubject?.name] || [
            {
                id: 'general-quiz',
                title: '📚 General Knowledge Quiz',
                description: 'Test your understanding of key concepts',
                questions: 15,
                duration: 20,
                level: 'Mixed'
            }
        ];
    }

    startQuiz(quizId) {
        // Placeholder for quiz functionality
        window.app?.showMessage(`Starting ${quizId} quiz! This feature will be implemented with the full quiz system.`, 'info');
        
        // TODO: Implement actual quiz functionality
        console.log(`Starting quiz: ${quizId}`);
    }

    showError(message) {
        const titleElement = document.getElementById('subject-title');
        const descriptionElement = document.getElementById('subject-description');
        
        if (titleElement) titleElement.textContent = 'Error';
        if (descriptionElement) descriptionElement.textContent = message;
        
        // Clear loading content
        const containers = ['topics-container', 'resources-list', 'quizzes-container'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<div class="error-message">${message}</div>`;
            }
        });
    }
}

// Initialize when page loads
let subjectPage;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        subjectPage = new SubjectPageManager();
        window.subjectPage = subjectPage; // Make globally accessible
    }, 200);
}); 