// Authentication functionality
class AuthManager {
    constructor() {
        this.initializeAuth();
    }

    initializeAuth() {
        this.initializeLoginForm();
        this.initializeRegisterForm();
        this.initializeGoogleAuth();
        this.checkAuthState();
    }

    checkAuthState() {
        // Check if user is already logged in
        if (app.currentUser) {
            this.showProfileSection();
        } else {
            this.showAuthSection();
        }
    }

    initializeLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const forgotPassword = document.getElementById('forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    initializeRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    initializeGoogleAuth() {
        const googleLoginBtn = document.getElementById('google-login');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => {
                this.handleGoogleLogin();
            });
        }

        const demoLoginBtn = document.getElementById('demo-login');
        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', () => {
                this.handleDemoLogin();
            });
        }

        // Initialize Google Sign-In API when it loads
        if (window.google) {
            this.setupGoogleSignIn();
        } else {
            // Wait for Google API to load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.google) {
                        this.setupGoogleSignIn();
                    }
                }, 1000);
            });
        }
    }

    setupGoogleSignIn() {
        try {
            // Initialize Google Sign-In
            google.accounts.id.initialize({
                client_id: 'your-google-client-id.googleusercontent.com', // Replace with your actual client ID
                callback: (response) => this.handleGoogleCredentialResponse(response),
                auto_select: false
            });

            // Render the Google Sign-In button
            const googleLoginBtn = document.getElementById('google-login');
            if (googleLoginBtn) {
                // Replace button click with Google's native sign-in
                googleLoginBtn.onclick = () => {
                    google.accounts.id.prompt();
                };
            }
        } catch (error) {
            console.log('Google Sign-In not available, using demo mode');
        }
    }

    handleGoogleCredentialResponse(response) {
        try {
            // Decode the JWT token (in production, verify on server)
            const credential = response.credential;
            const payload = JSON.parse(atob(credential.split('.')[1]));
            
            const user = {
                id: 'google_' + payload.sub,
                email: payload.email,
                name: payload.name,
                avatar: payload.picture,
                loginMethod: 'google',
                loginTime: new Date().toISOString(),
                googleProfile: payload
            };

            app.setUser(user);
            this.showProfileSection();
            showMessage('Successfully signed in with Google!', 'success');
        } catch (error) {
            console.error('Error processing Google credential:', error);
            showMessage('Google sign-in failed. Please try again.', 'error');
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await this.delay(1500);

            // For demo purposes, we'll create a user from the email
            // In a real app, this would verify against a backend
            const user = {
                id: this.generateUserId(email),
                email: email,
                name: this.extractNameFromEmail(email),
                loginMethod: 'email',
                loginTime: new Date().toISOString()
            };

            app.setUser(user);
            this.showProfileSection();
            showMessage('Successfully signed in!', 'success');

        } catch (error) {
            showMessage('Login failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#register-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call delay
            await this.delay(2000);

            // Create new user
            const user = {
                id: this.generateUserId(email),
                email: email,
                name: name,
                loginMethod: 'email',
                registrationTime: new Date().toISOString(),
                loginTime: new Date().toISOString()
            };

            app.setUser(user);
            this.showProfileSection();
            showMessage('Account created successfully! Welcome to Malleability!', 'success');

        } catch (error) {
            showMessage('Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleGoogleLogin() {
        const googleBtn = document.getElementById('google-login');
        const originalText = googleBtn.textContent;
        googleBtn.textContent = 'Connecting to Google...';
        googleBtn.disabled = true;

        try {
            // Simulate Google OAuth process
            await this.delay(2000);

            // For demo purposes, create a mock Google user
            const user = {
                id: 'google_' + Date.now(),
                email: 'user@gmail.com',
                name: 'Demo User',
                avatar: 'https://via.placeholder.com/120x120/667eea/ffffff?text=DU',
                loginMethod: 'google',
                loginTime: new Date().toISOString()
            };

            app.setUser(user);
            this.showProfileSection();
            showMessage('Successfully signed in with Google!', 'success');

        } catch (error) {
            showMessage('Google sign-in failed. Please try again.', 'error');
        } finally {
            googleBtn.textContent = originalText;
            googleBtn.disabled = false;
        }
    }

    async handleDemoLogin() {
        const demoBtn = document.getElementById('demo-login');
        const originalText = demoBtn.textContent;
        demoBtn.textContent = 'Loading demo...';
        demoBtn.disabled = true;

        try {
            // Simulate loading delay
            await this.delay(1000);

            // Create demo user with some progress
            const user = {
                id: 'demo_user_12345',
                email: 'demo@malleability.com',
                name: 'Demo Student',
                avatar: null,
                loginMethod: 'demo',
                loginTime: new Date().toISOString(),
                registrationTime: '2024-01-01T00:00:00.000Z',
                isDemo: true
            };

            // Set up some demo data
            const demoXP = { level: 3, xp: 150, totalXp: 450 };
            const demoTasks = [
                { id: 'demo1', text: 'Review Newton\'s Laws', completed: true, date: new Date().toISOString().split('T')[0] },
                { id: 'demo2', text: 'Study cell structure', completed: true, date: new Date().toISOString().split('T')[0] },
                { id: 'demo3', text: 'Practice linear equations', completed: false, date: new Date().toISOString().split('T')[0] }
            ];
            const demoQuotes = [
                { id: 'demo1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
                { id: 'demo2', text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' }
            ];

            // Save demo data
            localStorage.setItem('malleability_xp', JSON.stringify(demoXP));
            localStorage.setItem('malleability_tasks', JSON.stringify(demoTasks));
            localStorage.setItem('malleability_custom_quotes', JSON.stringify(demoQuotes));

            app.setUser(user);
            this.showProfileSection();
            showMessage('Welcome to the demo! Explore all features with pre-loaded progress.', 'success');

        } catch (error) {
            showMessage('Demo login failed. Please try again.', 'error');
        } finally {
            demoBtn.textContent = originalText;
            demoBtn.disabled = false;
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('login-email').value;
        
        if (!email) {
            showMessage('Please enter your email address first', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate password reset
        showMessage(`Password reset instructions have been sent to ${email}`, 'info');
    }

    showAuthSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) {
            authSection.classList.remove('hidden');
        }
        if (profileSection) {
            profileSection.classList.add('hidden');
        }
    }

    showProfileSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) {
            authSection.classList.add('hidden');
        }
        if (profileSection) {
            profileSection.classList.remove('hidden');
        }

        // Load profile data
        this.loadProfileData();
    }

    loadProfileData() {
        if (!app.currentUser) return;

        // Update profile header
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileAvatar = document.getElementById('profile-avatar');

        if (profileName) {
            profileName.textContent = app.currentUser.name || 'Unknown User';
        }
        if (profileEmail) {
            profileEmail.textContent = app.currentUser.email || '';
        }
        if (profileAvatar) {
            if (app.currentUser.avatar) {
                profileAvatar.innerHTML = `<img src="${app.currentUser.avatar}" alt="Profile">`;
            } else {
                const initials = this.getInitials(app.currentUser.name || app.currentUser.email);
                profileAvatar.textContent = initials;
            }
        }

        // Load and display statistics
        this.loadUserStats();
    }

    loadUserStats() {
        // Get existing data from localStorage
        const xpData = MalleabilityApp.loadFromStorage('malleability_xp', { level: 1, xp: 0 });
        const tasksData = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        const quotesData = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);

        // Calculate stats
        const totalTasks = Object.values(tasksData).reduce((total, dayTasks) => {
            return total + dayTasks.filter(task => task.completed).length;
        }, 0);

        // Update UI
        const statLevel = document.getElementById('stat-level');
        const statXp = document.getElementById('stat-xp');
        const statTasks = document.getElementById('stat-tasks');
        const statQuotes = document.getElementById('stat-quotes');

        if (statLevel) {
            MalleabilityApp.animateValue(statLevel, 0, xpData.level, 1000);
        }
        if (statXp) {
            MalleabilityApp.animateValue(statXp, 0, xpData.xp, 1500);
        }
        if (statTasks) {
            MalleabilityApp.animateValue(statTasks, 0, totalTasks, 1200);
        }
        if (statQuotes) {
            MalleabilityApp.animateValue(statQuotes, 0, quotesData.length, 800);
        }
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    extractNameFromEmail(email) {
        const username = email.split('@')[0];
        return username.charAt(0).toUpperCase() + username.slice(1);
    }

    generateUserId(email) {
        return 'user_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    }

    getInitials(name) {
        if (!name) return '?';
        
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        } else {
            return name.substring(0, 2).toUpperCase();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
}); 