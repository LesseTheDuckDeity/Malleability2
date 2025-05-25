// Quiz Management System
class QuizManager {
    constructor() {
        this.currentQuiz = null;
        this.answers = {};
        this.init();
    }

    init() {
        // Initialize quiz functionality when page loads
        document.addEventListener('DOMContentLoaded', () => {
            this.setupQuizEventListeners();
        });
    }

    setupQuizEventListeners() {
        const submitBtn = document.getElementById('submit-quiz');
        const resetBtn = document.getElementById('reset-quiz');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetQuiz());
        }

        // Listen for radio button changes
        const radioButtons = document.querySelectorAll('.quiz-question input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.saveAnswer(e.target.name, e.target.value);
            });
        });
    }

    saveAnswer(questionName, answer) {
        this.answers[questionName] = answer;
        console.log('Answer saved:', questionName, answer);
    }

    submitQuiz() {
        const questions = document.querySelectorAll('.quiz-question');
        let totalQuestions = questions.length;
        let correctAnswers = 0;
        let feedback = [];

        // Define correct answers (this would normally come from a database)
        const correctAnswersKey = {
            'q1': 'c', // Cell membrane - Selective permeability and transport
            'q2': 'b', // Mitochondria - Powerhouse of the cell
            'q3': 'c'  // Active transport - Requires energy
        };

        // Define feedback for each question
        const questionFeedback = {
            'q1': {
                correct: 'Correct! The cell membrane controls what enters and exits the cell through selective permeability.',
                incorrect: 'The cell membrane\'s primary function is selective permeability and transport regulation.'
            },
            'q2': {
                correct: 'Correct! Mitochondria produce ATP and are known as the powerhouse of the cell.',
                incorrect: 'Mitochondria are the powerhouses of the cell, responsible for ATP production.'
            },
            'q3': {
                correct: 'Correct! Active transport requires energy (ATP) to move substances against concentration gradients.',
                incorrect: 'Active transport is the process that requires energy to move substances across membranes.'
            }
        };

        // Check answers
        for (let questionKey in correctAnswersKey) {
            const userAnswer = this.answers[questionKey];
            const correctAnswer = correctAnswersKey[questionKey];
            
            if (userAnswer === correctAnswer) {
                correctAnswers++;
                feedback.push(`<div class="feedback-item correct">
                    <strong>Question ${questionKey.slice(1)}:</strong> ${questionFeedback[questionKey].correct}
                </div>`);
            } else {
                feedback.push(`<div class="feedback-item incorrect">
                    <strong>Question ${questionKey.slice(1)}:</strong> ${questionFeedback[questionKey].incorrect}
                </div>`);
            }
        }

        // Calculate score
        const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Display results
        this.displayResults(correctAnswers, totalQuestions, scorePercentage, feedback);
        
        // Award XP for completing quiz
        this.awardQuizXP(scorePercentage);
    }

    displayResults(correct, total, percentage, feedback) {
        const resultsDiv = document.getElementById('quiz-results');
        const scoreDiv = document.getElementById('quiz-score');
        const feedbackDiv = document.getElementById('quiz-feedback');

        if (resultsDiv && scoreDiv && feedbackDiv) {
            // Show results section
            resultsDiv.classList.remove('hidden');
            
            // Display score
            let scoreColor = '#e53e3e'; // Red for low scores
            if (percentage >= 80) scoreColor = '#38a169'; // Green for high scores
            else if (percentage >= 60) scoreColor = '#d69e2e'; // Yellow for medium scores
            
            scoreDiv.innerHTML = `
                <span style="color: ${scoreColor}; font-weight: 600; font-size: 1.1rem;">
                    You scored ${correct}/${total} (${percentage}%)
                </span>
            `;
            
            // Display feedback
            feedbackDiv.innerHTML = feedback.join('');
            
            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    awardQuizXP(percentage) {
        // Award XP based on quiz performance
        let xpAwarded = 0;
        if (percentage >= 90) xpAwarded = 50;
        else if (percentage >= 80) xpAwarded = 40;
        else if (percentage >= 70) xpAwarded = 30;
        else if (percentage >= 60) xpAwarded = 20;
        else xpAwarded = 10; // Participation XP

        if (typeof window.addXP === 'function') {
            window.addXP(xpAwarded);
            
            // Show XP notification
            this.showXPNotification(xpAwarded, percentage);
        }
    }

    showXPNotification(xp, percentage) {
        // Create and show XP notification
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-notification-content">
                <span class="xp-icon">🎯</span>
                <span class="xp-text">Quiz completed! +${xp} XP</span>
                <span class="xp-percentage">${percentage}%</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    resetQuiz() {
        // Clear all answers
        this.answers = {};
        
        // Uncheck all radio buttons
        const radioButtons = document.querySelectorAll('.quiz-question input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
        
        // Hide results
        const resultsDiv = document.getElementById('quiz-results');
        if (resultsDiv) {
            resultsDiv.classList.add('hidden');
        }
        
        // Scroll to top of quiz
        const quizSection = document.querySelector('.topic-quiz-section');
        if (quizSection) {
            quizSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Add CSS for quiz feedback styling
const quizStyles = `
<style>
.feedback-item {
    padding: 12px 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    border-left: 4px solid;
}

.feedback-item.correct {
    background: rgba(56, 161, 105, 0.1);
    border-left-color: #38a169;
    color: #22543d;
}

.feedback-item.incorrect {
    background: rgba(229, 62, 62, 0.1);
    border-left-color: #e53e3e;
    color: #742a2a;
}

.feedback-item:last-child {
    margin-bottom: 0;
}

.xp-notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.xp-icon {
    font-size: 1.2rem;
}

.xp-text {
    flex: 1;
}

.xp-percentage {
    font-size: 0.9rem;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .quiz-question {
        padding: 20px;
    }
    
    .quiz-option {
        padding: 10px 12px;
    }
    
    .nav-buttons {
        flex-direction: column;
        align-items: stretch;
    }
    
    .nav-buttons .btn {
        text-align: center;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', quizStyles);

// Initialize quiz manager
const quizManager = new QuizManager(); 