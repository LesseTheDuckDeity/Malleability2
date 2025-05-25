// Profile management functionality
class ProfileManager {
    constructor() {
        this.state = null;
        this.currentUser = null;
        this.initializeProfile();
    }

    async initializeProfile() {
        // Wait for app initialization
        await this.waitForApp();
        
        // Load user and show profile section
        await this.loadUserProfile();
        this.initializeProfileActions();
        this.initializeProfileForm();
        this.initializeAvatarUpload();
        
        // Show profile section and hide auth section
        this.showProfileSection();
        await this.loadStatistics();
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

    async loadUserProfile() {
        try {
            // Load user from database
            await this.state.loadUser();
            this.currentUser = this.state.getState('user');
            
            if (this.currentUser) {
                this.updateProfileDisplay();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            window.app?.showMessage('Error loading profile', 'error');
        }
    }

    updateProfileDisplay() {
        if (!this.currentUser) return;

        // Update profile name and email
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileAvatar = document.getElementById('profile-avatar');

        if (profileName) {
            profileName.textContent = this.currentUser.name || 'Student';
        }

        if (profileEmail) {
            profileEmail.textContent = this.currentUser.email || 'student@malleability.com';
        }

        if (profileAvatar) {
            // Show user initials if no avatar
            const initials = this.getInitials(this.currentUser.name || 'Student');
            profileAvatar.innerHTML = `<div class="avatar-initials">${initials}</div>`;
        }

        // Update basic stats
        const statLevel = document.getElementById('stat-level');
        const statXP = document.getElementById('stat-xp');

        if (statLevel) {
            statLevel.textContent = this.currentUser.level || 1;
        }

        if (statXP) {
            statXP.textContent = this.currentUser.xp || 0;
        }
    }

    async loadStatistics() {
        try {
            // Load additional data for statistics
            await this.state.loadTasks();
            await this.state.loadQuotes();

            const tasks = this.state.getState('tasks');
            const quotes = this.state.getState('quotes');

            // Update statistics display
            const statTasks = document.getElementById('stat-tasks');
            const statQuotes = document.getElementById('stat-quotes');

            if (statTasks && tasks) {
                const completedTasks = tasks.filter(task => task.completed).length;
                statTasks.textContent = completedTasks;
            }

            if (statQuotes && quotes) {
                const customQuotes = quotes.filter(quote => quote.category === 'custom').length;
                statQuotes.textContent = customQuotes;
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    showProfileSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) {
            authSection.style.display = 'none';
        }

        if (profileSection) {
            profileSection.classList.remove('hidden');
            profileSection.style.display = 'block';
        }
    }

    hideProfileSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) {
            authSection.style.display = 'block';
        }

        if (profileSection) {
            profileSection.classList.add('hidden');
            profileSection.style.display = 'none';
        }
    }

    initializeProfileActions() {
        const editBtn = document.getElementById('edit-profile-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.showEditForm();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideEditForm();
            });
        }
    }

    initializeProfileForm() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileSave();
            });
        }
    }

    initializeAvatarUpload() {
        const avatarUpload = document.getElementById('avatar-upload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }
    }

    showEditForm() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.classList.remove('hidden');
            MalleabilityApp.fadeIn(profileForm);
            
            // Scroll to form
            profileForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    hideEditForm() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.classList.add('hidden');
        }
    }

    loadSavedProfile() {
        const savedProfile = MalleabilityApp.loadFromStorage('malleability_profile', {});
        
        // Populate form fields with saved data
        this.populateFormFields(savedProfile);
        
        // Update avatar preview
        this.updateAvatarPreview(savedProfile.avatar);
    }

    populateFormFields(profile) {
        const fields = [
            'profile-first-name',
            'profile-last-name',
            'profile-birth-date',
            'profile-phone',
            'profile-school',
            'profile-level',
            'profile-major',
            'profile-year',
            'profile-timezone',
            'profile-language',
            'profile-goals'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const key = fieldId.replace('profile-', '').replace('-', '_');
            
            if (field && profile[key]) {
                field.value = profile[key];
            }
        });

        // Set default values if not set
        if (!profile.timezone) {
            const timezoneField = document.getElementById('profile-timezone');
            if (timezoneField) {
                timezoneField.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            }
        }

        if (!profile.language) {
            const languageField = document.getElementById('profile-language');
            if (languageField) {
                languageField.value = navigator.language.split('-')[0] || 'en';
            }
        }
    }

    async handleProfileSave() {
        const submitBtn = document.querySelector('#profile-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const profileData = this.collectFormData();
            
            // Validate required fields
            if (!profileData.first_name || !profileData.last_name) {
                showMessage('Please fill in your first and last name', 'error');
                return;
            }

            // Simulate API save delay
            await this.delay(1000);

            // Save to localStorage
            MalleabilityApp.saveToStorage('malleability_profile', profileData);

            // Update user's display name
            const fullName = `${profileData.first_name} ${profileData.last_name}`;
            if (app.currentUser) {
                app.currentUser.name = fullName;
                app.setUser(app.currentUser);
                
                // Update profile display
                const profileName = document.getElementById('profile-name');
                if (profileName) {
                    profileName.textContent = fullName;
                }
            }

            this.hideEditForm();
            showMessage('Profile updated successfully!', 'success');

        } catch (error) {
            showMessage('Failed to save profile. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        const formData = {};
        
        const fields = [
            { id: 'profile-first-name', key: 'first_name' },
            { id: 'profile-last-name', key: 'last_name' },
            { id: 'profile-birth-date', key: 'birth_date' },
            { id: 'profile-phone', key: 'phone' },
            { id: 'profile-school', key: 'school' },
            { id: 'profile-level', key: 'academic_level' },
            { id: 'profile-major', key: 'major' },
            { id: 'profile-year', key: 'year' },
            { id: 'profile-timezone', key: 'timezone' },
            { id: 'profile-language', key: 'language' },
            { id: 'profile-goals', key: 'goals' }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                formData[field.key] = element.value;
            }
        });

        // Add current avatar if exists
        const savedProfile = MalleabilityApp.loadFromStorage('malleability_profile', {});
        if (savedProfile.avatar) {
            formData.avatar = savedProfile.avatar;
        }

        formData.updated_at = new Date().toISOString();

        return formData;
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            // Update preview
            this.updateAvatarPreview(imageData);
            
            // Save to profile
            const savedProfile = MalleabilityApp.loadFromStorage('malleability_profile', {});
            savedProfile.avatar = imageData;
            MalleabilityApp.saveToStorage('malleability_profile', savedProfile);
            
            // Update user avatar
            if (app.currentUser) {
                app.currentUser.avatar = imageData;
                app.setUser(app.currentUser);
                
                // Update main profile avatar
                const profileAvatar = document.getElementById('profile-avatar');
                if (profileAvatar) {
                    profileAvatar.innerHTML = `<img src="${imageData}" alt="Profile">`;
                }
            }
            
            showMessage('Profile picture updated!', 'success');
        };
        
        reader.readAsDataURL(file);
    }

    updateAvatarPreview(avatarData) {
        const avatarPreview = document.getElementById('avatar-preview');
        if (!avatarPreview) return;

        if (avatarData) {
            avatarPreview.innerHTML = `<img src="${avatarData}" alt="Avatar Preview">`;
        } else {
            // Show initials if no avatar
            if (app.currentUser) {
                const initials = this.getInitials(app.currentUser.name || app.currentUser.email);
                avatarPreview.textContent = initials;
            } else {
                avatarPreview.textContent = '?';
            }
        }
    }

    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Use the app's logout method
            if (window.app) {
                window.app.logout();
            }
            
            // Hide profile section and show auth section
            this.hideProfileSection();
            
            window.app?.showMessage('You have been logged out', 'info');
        }
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

    // Export profile data
    exportProfile() {
        const profileData = MalleabilityApp.loadFromStorage('malleability_profile', {});
        const userData = app.currentUser;
        const xpData = MalleabilityApp.loadFromStorage('malleability_xp', {});
        const tasksData = MalleabilityApp.loadFromStorage('malleability_tasks', {});
        const quotesData = MalleabilityApp.loadFromStorage('malleability_custom_quotes', []);

        const exportData = {
            profile: profileData,
            user: userData,
            xp: xpData,
            tasks: tasksData,
            quotes: quotesData,
            exported_at: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `malleability-profile-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showMessage('Profile data exported successfully!', 'success');
    }

    // Import profile data
    importProfile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate import data structure
                if (!importData.profile && !importData.user) {
                    throw new Error('Invalid profile data format');
                }

                // Import profile data
                if (importData.profile) {
                    MalleabilityApp.saveToStorage('malleability_profile', importData.profile);
                }
                
                if (importData.xp) {
                    MalleabilityApp.saveToStorage('malleability_xp', importData.xp);
                }
                
                if (importData.tasks) {
                    MalleabilityApp.saveToStorage('malleability_tasks', importData.tasks);
                }
                
                if (importData.quotes) {
                    MalleabilityApp.saveToStorage('malleability_custom_quotes', importData.quotes);
                }

                // Reload the page to reflect changes
                showMessage('Profile data imported successfully! Reloading...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                showMessage('Failed to import profile data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    }
}

// Initialize profile manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
}); 