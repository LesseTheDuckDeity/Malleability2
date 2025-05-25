// Topic page dynamic content loader
class TopicPageManager {
    constructor() {
        this.currentTopic = null;
        this.currentSubject = null;
        this.allTopics = [];
        this.state = null;
        this.initializePage();
    }

    async initializePage() {
        // Wait for app initialization
        await this.waitForApp();
        
        // Get topic info from URL
        const urlInfo = this.getTopicInfoFromURL();
        if (urlInfo) {
            await this.loadTopicData(urlInfo);
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

    getTopicInfoFromURL() {
        const path = window.location.pathname;
        console.log('🔍 Topic URL Analysis:');
        console.log('Full path:', path);
        
        // New ID-based URL pattern: /subject/:subjectId/topic/:topicId
        const match = path.match(/\/subject\/(\d+)\/topic\/(\d+)$/);
        if (match) {
            const urlInfo = {
                subjectId: parseInt(match[1]),
                topicId: parseInt(match[2])
            };
            
            console.log('Parsed URL info:', urlInfo);
            console.log('Subject ID:', urlInfo.subjectId);
            console.log('Topic ID:', urlInfo.topicId);
            
            return urlInfo;
        }
        
        console.log('❌ URL did not match expected pattern: /subject/:subjectId/topic/:topicId');
        return null;
    }

    async loadTopicData(urlInfo) {
        try {
            console.log('🔍 Loading topic data for:', urlInfo);
            
            // Load subjects and find the current subject by ID
            const subjects = await window.app.loadSubjects();
            console.log('📚 Available subjects:', subjects.map(s => `${s.id}: ${s.name}`));
            
            this.currentSubject = subjects.find(s => s.id === urlInfo.subjectId);
            console.log('🎯 Found subject:', this.currentSubject);
            
            if (this.currentSubject) {
                // Load topics for this subject
                this.allTopics = await window.app.loadTopics(this.currentSubject.id);
                console.log('📖 All topics for subject:', this.allTopics.map(t => `${t.id}: ${t.name}`));
                
                // Find the specific topic by ID
                console.log('🔍 Looking for topic with ID:', urlInfo.topicId);
                
                this.currentTopic = this.allTopics.find(t => t.id === urlInfo.topicId);
                
                console.log('🎯 Found topic:', this.currentTopic);
                
                if (this.currentTopic) {
                    await this.renderTopicPage();
                } else {
                    console.log('❌ Topic not found. Available topics:');
                    this.allTopics.forEach(t => {
                        console.log(`  - ${t.id}: "${t.name}" in "${t.category}"`);
                    });
                    this.showError(`Topic with ID ${urlInfo.topicId} not found`);
                }
            } else {
                this.showError(`Subject with ID ${urlInfo.subjectId} not found`);
            }
        } catch (error) {
            console.error('💥 Error loading topic data:', error);
            this.showError('Failed to load topic data');
        }
    }

    async renderTopicPage() {
        this.renderBreadcrumb();
        this.renderTopicHeader();
        this.renderTopicContent();
        this.renderTopicResources();
        this.renderTopicPractice();
        this.initializeNavigation();
    }

    renderBreadcrumb() {
        const subjectBreadcrumb = document.getElementById('subject-breadcrumb');
        const topicBreadcrumb = document.getElementById('topic-breadcrumb');
        
        if (subjectBreadcrumb && this.currentSubject) {
            subjectBreadcrumb.href = `/subject/${this.currentSubject.id}`;
            subjectBreadcrumb.textContent = this.currentSubject.name;
        }
        
        if (topicBreadcrumb && this.currentTopic) {
            topicBreadcrumb.textContent = this.currentTopic.name;
        }
    }

    renderTopicHeader() {
        const titleElement = document.getElementById('topic-title');
        const descriptionElement = document.getElementById('topic-description');
        const difficultyElement = document.getElementById('topic-difficulty');
        const durationElement = document.getElementById('topic-duration');
        
        if (titleElement && this.currentTopic) {
            titleElement.textContent = this.currentTopic.name;
        }
        
        if (descriptionElement && this.currentTopic) {
            descriptionElement.textContent = this.currentTopic.description || 
                `Learn about ${this.currentTopic.name.toLowerCase()} in this comprehensive guide.`;
        }
        
        if (difficultyElement && this.currentTopic) {
            const difficulty = this.currentTopic.difficulty || 'Beginner';
            difficultyElement.textContent = difficulty;
            difficultyElement.className = `difficulty ${difficulty.toLowerCase()}`;
        }
        
        if (durationElement && this.currentTopic) {
            durationElement.textContent = this.currentTopic.duration || '30 min read';
        }
    }

    renderTopicContent() {
        const contentElement = document.getElementById('topic-content');
        if (!contentElement) return;

        // Use dynamic content if available, otherwise generate placeholder content
        if (this.currentTopic && this.currentTopic.content) {
            contentElement.innerHTML = `
                <div class="topic-content-body">
                    ${this.currentTopic.content}
                </div>
            `;
        } else {
            // Generate content based on topic info
            const content = this.generateTopicContent();
            contentElement.innerHTML = content;
        }
    }

    generateTopicContent() {
        if (!this.currentTopic) return '<p>Content not available.</p>';

        // For now, generate placeholder content based on the topic
        const topicName = this.currentTopic.name;
        const subjectName = this.currentSubject.name;
        
        return `
            <div class="content-section">
                <h3>Introduction to ${topicName}</h3>
                <p>Welcome to the comprehensive guide on <strong>${topicName}</strong> in ${subjectName}. This topic is essential for understanding the broader concepts within the field.</p>
                
                <h3>Key Concepts</h3>
                <ul>
                    <li>Fundamental principles of ${topicName}</li>
                    <li>Practical applications and examples</li>
                    <li>Common misconceptions and how to avoid them</li>
                    <li>Connections to other topics in ${subjectName}</li>
                </ul>
                
                <h3>Detailed Explanation</h3>
                <p>This section provides an in-depth look at ${topicName}. The topic covers essential concepts that form the foundation for more advanced study in ${subjectName}.</p>
                
                <div class="info-box">
                    <h4>💡 Did You Know?</h4>
                    <p>Understanding ${topicName} is crucial for mastering ${subjectName} concepts at higher levels.</p>
                </div>
                
                <h3>Summary</h3>
                <p>By completing this topic, you will have gained a solid understanding of ${topicName} and its role in ${subjectName}. Make sure to practice with the exercises below to reinforce your learning.</p>
            </div>
        `;
    }

    renderTopicResources() {
        const resourcesElement = document.getElementById('topic-resources');
        if (!resourcesElement) return;

        let resourcesContent = '';

        // Try to use dynamic resources from the database
        if (this.currentTopic && this.currentTopic.resources) {
            try {
                const resources = JSON.parse(this.currentTopic.resources);
                if (resources && resources.length > 0) {
                    resourcesContent = `
                        <ul class="resource-list">
                            ${resources.map(resource => `
                                <li>
                                    <strong>${resource.title}</strong> - ${resource.description}
                                    ${resource.url ? `<br><small><a href="${resource.url}" target="_blank" rel="noopener noreferrer">🔗 Visit Resource</a></small>` : ''}
                                    <span class="resource-type">[${this.formatResourceType(resource.type)}]</span>
                                </li>
                            `).join('')}
                        </ul>
                    `;
                } else {
                    resourcesContent = this.generateTopicResources();
                }
            } catch (error) {
                console.error('Error parsing topic resources:', error);
                resourcesContent = this.generateTopicResources();
            }
        } else {
            resourcesContent = this.generateTopicResources();
        }

        resourcesElement.innerHTML = resourcesContent;
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

    generateTopicResources() {
        const subjectName = this.currentSubject?.name || 'General';
        const topicName = this.currentTopic?.name || 'Topic';
        
        return `
            <ul class="resource-list">
                <li><strong>Khan Academy</strong> - Interactive lessons on ${topicName}</li>
                <li><strong>MIT OpenCourseWare</strong> - University-level content on ${subjectName}</li>
                <li><strong>Wikipedia</strong> - Comprehensive encyclopedia entry</li>
                <li><strong>YouTube Educational Channels</strong> - Video explanations and demonstrations</li>
                <li><strong>Practice Exercises</strong> - Additional problems to test your understanding</li>
            </ul>
        `;
    }

    renderTopicPractice() {
        const practiceElement = document.getElementById('topic-practice');
        if (!practiceElement) return;

        const practice = this.generateTopicPractice();
        practiceElement.innerHTML = practice;
    }

    generateTopicPractice() {
        const topicName = this.currentTopic?.name || 'Topic';
        
        return `
            <div class="practice-section">
                <h4>🎯 Quick Quiz</h4>
                <p>Test your understanding of ${topicName} with these practice questions:</p>
                <button class="btn btn-primary" onclick="topicPage.startQuiz()">Start Practice Quiz</button>
                
                <!-- Quiz container for quiz component -->
                <div id="topic-quiz-container"></div>
                
                <h4>📝 Exercises</h4>
                <p>Reinforce your learning with these hands-on exercises:</p>
                <ul>
                    <li>Complete the practice problems in your textbook</li>
                    <li>Create a summary of key concepts</li>
                    <li>Discuss the topic with study partners</li>
                    <li>Apply concepts to real-world examples</li>
                </ul>
            </div>
        `;
    }

    initializeNavigation() {
        const prevBtn = document.getElementById('prev-topic');
        const nextBtn = document.getElementById('next-topic');
        const completeBtn = document.getElementById('complete-topic');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPreviousTopic());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNextTopic());
        }
        
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.markTopicComplete());
        }
        
        // Update button states
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const currentIndex = this.allTopics.findIndex(t => t.id === this.currentTopic?.id);
        
        const prevBtn = document.getElementById('prev-topic');
        const nextBtn = document.getElementById('next-topic');
        
        if (prevBtn) {
            prevBtn.disabled = currentIndex <= 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= this.allTopics.length - 1;
        }
    }

    navigateToPreviousTopic() {
        const currentIndex = this.allTopics.findIndex(t => t.id === this.currentTopic?.id);
        if (currentIndex > 0) {
            const prevTopic = this.allTopics[currentIndex - 1];
            this.navigateToTopic(prevTopic);
        }
    }

    navigateToNextTopic() {
        const currentIndex = this.allTopics.findIndex(t => t.id === this.currentTopic?.id);
        if (currentIndex < this.allTopics.length - 1) {
            const nextTopic = this.allTopics[currentIndex + 1];
            this.navigateToTopic(nextTopic);
        }
    }

    navigateToTopic(topic) {
        const url = `/subject/${this.currentSubject.id}/topic/${topic.id}`;
        window.location.href = url;
    }

    async markTopicComplete() {
        try {
            // Add XP for completing a topic
            await window.app?.updateUserProgress(25);
            window.app?.showMessage('Topic completed! +25 XP 🎉', 'success');
            
            // Update button text
            const completeBtn = document.getElementById('complete-topic');
            if (completeBtn) {
                completeBtn.textContent = '✅ Completed';
                completeBtn.disabled = true;
            }
        } catch (error) {
            console.error('Error marking topic complete:', error);
            window.app?.showMessage('Error updating progress', 'error');
        }
    }

    async startQuiz() {
        if (!this.currentTopic || !this.currentTopic.id) {
            window.app?.showMessage('Topic information not available for quiz', 'error');
            return;
        }

        try {
            // Initialize quiz component for topic-level quizzes
            if (!window.topicQuizComponent) {
                window.topicQuizComponent = new QuizComponent('topic-quiz-container', {
                    showResults: true,
                    allowNavigation: true
                });
            }
            
            // Load topic-level quizzes
            await window.topicQuizComponent.loadTopicQuizzes(this.currentTopic.id);
            
            // Hide the start quiz button once quiz is loaded
            const startButton = document.querySelector('.practice-section .btn-primary');
            if (startButton && window.topicQuizComponent.quizzes.length > 0) {
                startButton.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error starting quiz:', error);
            window.app?.showMessage('Error loading quiz questions', 'error');
        }
    }

    showError(message) {
        const containers = ['topic-title', 'topic-description', 'topic-content', 'topic-resources', 'topic-practice'];
        
        document.getElementById('topic-title').textContent = 'Error';
        document.getElementById('topic-description').textContent = message;
        
        containers.slice(2).forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<div class="error-message">${message}</div>`;
            }
        });
    }
}

// Initialize when page loads
let topicPage;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        topicPage = new TopicPageManager();
        window.topicPage = topicPage; // Make globally accessible
    }, 200);
}); 