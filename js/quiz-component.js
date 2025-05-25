// Reusable Quiz Component
class QuizComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.quizzes = [];
        this.currentQuizIndex = 0;
        this.selectedAnswer = null;
        this.answered = false;
        this.score = 0;
        this.userAnswers = [];
        this.showResults = options.showResults !== false;
        this.allowNavigation = options.allowNavigation !== false;
        
        if (!this.container) {
            console.error(`Quiz container with ID '${containerId}' not found`);
            return;
        }
    }

    // Load quizzes from API
    async loadQuizzes(endpoint) {
        try {
            this.showLoading();
            
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.quizzes = data.quizzes || [];
            
            if (this.quizzes.length === 0) {
                this.showEmpty();
                return;
            }
            
            this.currentQuizIndex = 0;
            this.score = 0;
            this.userAnswers = [];
            this.renderQuiz();
            
        } catch (error) {
            console.error('Error loading quizzes:', error);
            this.showError('Failed to load quizzes. Please try again later.');
        }
    }

    // Load subject-level quizzes
    async loadSubjectQuizzes(subjectId) {
        await this.loadQuizzes(`/api/subjects/${subjectId}/quizzes`);
    }

    // Load topic-level quizzes
    async loadTopicQuizzes(topicId) {
        await this.loadQuizzes(`/api/topics/${topicId}/quizzes`);
    }

    // Render the current quiz
    renderQuiz() {
        if (!this.quizzes.length) {
            this.showEmpty();
            return;
        }

        const quiz = this.quizzes[this.currentQuizIndex];
        this.selectedAnswer = null;
        this.answered = false;

        // Set this instance as the global reference for onclick handlers
        window.activeQuizComponent = this;

        this.container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3 class="quiz-title">Quiz Question</h3>
                    <div class="quiz-progress">
                        ${this.currentQuizIndex + 1} of ${this.quizzes.length}
                    </div>
                </div>

                <div class="quiz-question">
                    <div class="question-text">${quiz.question}</div>
                    
                    <div class="quiz-options">
                        ${quiz.options.map((option, index) => `
                            <div class="quiz-option" data-index="${index}" onclick="window.activeQuizComponent.selectOption(${index})">
                                <div class="quiz-option-text">${option}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="quiz-actions">
                    <div class="quiz-navigation">
                        ${this.allowNavigation && this.currentQuizIndex > 0 ? 
                            `<button class="quiz-btn quiz-btn-secondary" onclick="window.activeQuizComponent.previousQuiz()">
                                ← Previous
                            </button>` : 
                            '<div></div>'
                        }
                        
                        ${this.allowNavigation && this.currentQuizIndex < this.quizzes.length - 1 ? 
                            `<button class="quiz-btn quiz-btn-secondary" onclick="window.activeQuizComponent.nextQuiz()" id="next-btn" disabled>
                                Next →
                            </button>` : 
                            this.showResults ? 
                                `<button class="quiz-btn quiz-btn-success" onclick="window.activeQuizComponent.finishQuiz()" id="finish-btn" disabled>
                                    Finish Quiz
                                </button>` :
                                '<div></div>'
                        }
                    </div>
                    
                    <button class="quiz-btn quiz-btn-primary" onclick="window.activeQuizComponent.submitAnswer()" id="submit-btn" disabled>
                        Submit Answer
                    </button>
                </div>
            </div>
        `;
    }

    // Select an option
    selectOption(index) {
        if (this.answered) return;

        // Remove previous selection
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach(option => option.classList.remove('selected'));

        // Select current option
        const selectedOption = this.container.querySelector(`[data-index="${index}"]`);
        selectedOption.classList.add('selected');

        this.selectedAnswer = index;
        
        // Enable submit button
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    // Submit the selected answer
    submitAnswer() {
        if (this.selectedAnswer === null || this.answered) return;

        const quiz = this.quizzes[this.currentQuizIndex];
        const isCorrect = this.selectedAnswer === quiz.correct_answer;
        
        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Store user answer
        this.userAnswers[this.currentQuizIndex] = {
            selected: this.selectedAnswer,
            correct: quiz.correct_answer,
            isCorrect: isCorrect
        };

        this.answered = true;

        // Show answer feedback
        this.showAnswerFeedback(quiz);
        
        // Enable navigation buttons
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        if (nextBtn) nextBtn.disabled = false;
        if (finishBtn) finishBtn.disabled = false;

        // Disable submit button
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitted';
        }

        // Add XP for correct answer
        if (isCorrect && window.app && window.app.state) {
            window.app.state.updateUserProgress(5); // 5 XP for correct answer
            window.app.showMessage('Correct! +5 XP', 'success');
        }
    }

    // Show answer feedback
    showAnswerFeedback(quiz) {
        const options = this.container.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.classList.add('disabled');
            
            if (index === quiz.correct_answer) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && index !== quiz.correct_answer) {
                option.classList.add('incorrect');
            }
        });

        // Show explanation if available
        if (quiz.explanation) {
            const questionDiv = this.container.querySelector('.quiz-question');
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'quiz-explanation';
            explanationDiv.innerHTML = `
                <strong>Explanation:</strong>
                ${quiz.explanation}
            `;
            questionDiv.appendChild(explanationDiv);
        }
    }

    // Navigate to next quiz
    nextQuiz() {
        if (this.currentQuizIndex < this.quizzes.length - 1) {
            this.currentQuizIndex++;
            this.renderQuiz();
        }
    }

    // Navigate to previous quiz
    previousQuiz() {
        if (this.currentQuizIndex > 0) {
            this.currentQuizIndex--;
            this.renderQuiz();
            
            // If we've already answered this quiz, show the feedback
            if (this.userAnswers[this.currentQuizIndex]) {
                const userAnswer = this.userAnswers[this.currentQuizIndex];
                this.selectedAnswer = userAnswer.selected;
                this.answered = true;
                
                // Restore selection and feedback
                setTimeout(() => {
                    const selectedOption = this.container.querySelector(`[data-index="${userAnswer.selected}"]`);
                    if (selectedOption) {
                        selectedOption.classList.add('selected');
                    }
                    
                    this.showAnswerFeedback(this.quizzes[this.currentQuizIndex]);
                    
                    // Update button states
                    const submitBtn = document.getElementById('submit-btn');
                    const nextBtn = document.getElementById('next-btn');
                    const finishBtn = document.getElementById('finish-btn');
                    
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Submitted';
                    }
                    if (nextBtn) nextBtn.disabled = false;
                    if (finishBtn) finishBtn.disabled = false;
                }, 100);
            }
        }
    }

    // Finish quiz and show results
    finishQuiz() {
        if (!this.showResults) return;

        const percentage = Math.round((this.score / this.quizzes.length) * 100);
        let scoreClass, message;

        if (percentage >= 80) {
            scoreClass = 'excellent';
            message = 'Excellent work! You have a strong understanding of this topic.';
        } else if (percentage >= 60) {
            scoreClass = 'good';
            message = 'Good job! You have a solid grasp of the material.';
        } else {
            scoreClass = 'needs-improvement';
            message = 'Keep studying! Review the material and try again.';
        }

        // Set this instance as the global reference for onclick handlers
        window.activeQuizComponent = this;

        this.container.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="score ${scoreClass}">${percentage}%</div>
                <p>You scored ${this.score} out of ${this.quizzes.length} questions correctly.</p>
                <p>${message}</p>
                
                <div class="quiz-navigation">
                    <button class="quiz-btn quiz-btn-primary" onclick="window.activeQuizComponent.restartQuiz()">
                        Take Quiz Again
                    </button>
                    <button class="quiz-btn quiz-btn-secondary" onclick="window.activeQuizComponent.showReview()">
                        Review Answers
                    </button>
                </div>
            </div>
        `;

        // Award completion bonus XP
        if (window.app && window.app.state) {
            const bonusXP = Math.round(percentage / 10); // 1 XP per 10% score
            window.app.state.updateUserProgress(bonusXP);
            window.app.showMessage(`Quiz completed! +${bonusXP} bonus XP`, 'success');
        }
    }

    // Restart the quiz
    restartQuiz() {
        this.currentQuizIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.renderQuiz();
    }

    // Show answer review
    showReview() {
        // Set this instance as the global reference for onclick handlers
        window.activeQuizComponent = this;
        
        let reviewHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3 class="quiz-title">Answer Review</h3>
                    <div class="quiz-score">Score: ${this.score}/${this.quizzes.length}</div>
                </div>
        `;

        this.quizzes.forEach((quiz, quizIndex) => {
            const userAnswer = this.userAnswers[quizIndex];
            const isCorrect = userAnswer && userAnswer.isCorrect;
            
            reviewHTML += `
                <div class="quiz-question" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
                    <div class="question-text">${quiz.question}</div>
                    
                    <div class="quiz-options">
                        ${quiz.options.map((option, optionIndex) => {
                            let classes = ['quiz-option', 'disabled'];
                            
                            if (optionIndex === quiz.correct_answer) {
                                classes.push('correct');
                            } else if (userAnswer && optionIndex === userAnswer.selected && !isCorrect) {
                                classes.push('incorrect');
                            }
                            
                            return `
                                <div class="${classes.join(' ')}">
                                    <div class="quiz-option-text">${option}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    ${quiz.explanation ? `
                        <div class="quiz-explanation">
                            <strong>Explanation:</strong>
                            ${quiz.explanation}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        reviewHTML += `
                <div class="quiz-actions">
                    <div class="quiz-navigation">
                        <button class="quiz-btn quiz-btn-primary" onclick="window.activeQuizComponent.restartQuiz()">
                            Take Quiz Again
                        </button>
                        <button class="quiz-btn quiz-btn-secondary" onclick="window.history.back()">
                            Back to Content
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = reviewHTML;
    }

    // Show loading state
    showLoading() {
        this.container.innerHTML = `
            <div class="quiz-loading">
                <p>Loading quiz questions...</p>
            </div>
        `;
    }

    // Show empty state
    showEmpty() {
        this.container.innerHTML = `
            <div class="quiz-empty">
                <p>No quiz questions available for this content yet.</p>
                <p>Check back later for updates!</p>
            </div>
        `;
    }

    // Show error state
    showError(message) {
        this.container.innerHTML = `
            <div class="quiz-error">
                <p>${message}</p>
                <button class="quiz-btn quiz-btn-secondary" onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }

    // Get quiz statistics
    getStats() {
        return {
            totalQuizzes: this.quizzes.length,
            currentIndex: this.currentQuizIndex,
            score: this.score,
            percentage: this.quizzes.length > 0 ? Math.round((this.score / this.quizzes.length) * 100) : 0,
            completed: this.userAnswers.length === this.quizzes.length
        };
    }
}

// Global quiz component instance
let quizComponent; 