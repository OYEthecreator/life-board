// =====================================================
// 🚀 LIFEBOARD SETTINGS MANAGER - WITH REAL EFFECTS
// =====================================================
class SettingsManager {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'profile';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCurrentUser();
        this.applySavedSettings(); // Apply settings when app starts
    }

    setupEventListeners() {
        document.querySelector('button[title="Settings"]')?.addEventListener('click', () => this.openSettings());
        document.getElementById('settingsBack')?.addEventListener('click', () => this.closeSettings());
        
        document.querySelectorAll('.sidebar-section').forEach(section => {
            section.addEventListener('click', e => {
                const sectionName = e.currentTarget.dataset.section;
                this.switchSection(sectionName);
            });
        });
    }

    loadCurrentUser() {
        const email = localStorage.getItem('current_user_email');
        if (email) {
            const userData = localStorage.getItem(`lifeboard_user_${email}`);
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        }
    }

    openSettings() {
        if (!this.currentUser) {
            this.showNotification('Please log in to access settings', 'error');
            return;
        }

        document.getElementById('settingsOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.loadSection(this.currentSection);
    }

    closeSettings() {
        document.getElementById('settingsOverlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    switchSection(sectionName) {
        this.currentSection = sectionName;
        document.querySelectorAll('.sidebar-section').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        this.loadSection(sectionName);
    }

    loadSection(sectionName) {
        const contentArea = document.getElementById('settingsContent');
        if (!contentArea) return;

        switch (sectionName) {
            case 'profile': contentArea.innerHTML = this.getProfileHTML(); this.setupProfileEvents(); break;
            case 'security': contentArea.innerHTML = this.getSecurityHTML(); this.setupSecurityEvents(); break;
            case 'notifications': contentArea.innerHTML = this.getNotificationsHTML(); this.setupNotificationEvents(); break;
            case 'appearance': contentArea.innerHTML = this.getAppearanceHTML(); this.setupAppearanceEvents(); break;
            case 'language': contentArea.innerHTML = this.getLanguageHTML(); this.setupLanguageEvents(); break;
            case 'privacy': contentArea.innerHTML = this.getPrivacyHTML(); this.setupPrivacyEvents(); break;
            case 'billing': contentArea.innerHTML = this.getBillingHTML(); this.setupBillingEvents(); break;
            case 'accessibility': contentArea.innerHTML = this.getAccessibilityHTML(); this.setupAccessibilityEvents(); break;
            case 'storage': contentArea.innerHTML = this.getStorageHTML(); this.setupStorageEvents(); break;
            case 'api': contentArea.innerHTML = this.getApiHTML(); this.setupApiEvents(); break;
            case 'devices': contentArea.innerHTML = this.getDevicesHTML(); this.setupDevicesEvents(); break;
            case 'advanced': contentArea.innerHTML = this.getAdvancedHTML(); this.setupAdvancedEvents(); break;
            case 'help': contentArea.innerHTML = this.getHelpHTML(); break;
            case 'about': contentArea.innerHTML = this.getAboutHTML(); break;
            default: contentArea.innerHTML = '<div class="empty-state">Select a setting from the sidebar</div>';
        }
    }

    // ==================== PROFILE ====================
    getProfileHTML() {
        return `
        <div class="section-header">
            <h3>Profile Information</h3>
            <p>Manage your personal details and profile settings</p>
        </div>
        <div class="settings-grid">
            <div class="settings-card">
                <div class="card-header">
                    <h4>Profile Picture</h4>
                    <span class="card-badge">Identity</span>
                </div>
                <div class="avatar-section">
                    <div class="avatar-container">
                        <img src="${this.currentUser.profilePicture || './images/default-avatar.png'}" id="profileAvatar" alt="Profile">
                        <div class="avatar-overlay">
                            <label for="avatarUpload">📷 Change Photo</label>
                            <input type="file" id="avatarUpload" accept="image/*" style="display:none;">
                        </div>
                    </div>
                    <div class="avatar-info">
                        <h4 id="profileNameDisplay">${this.currentUser.name || 'User'}</h4>
                        <p>Upload a new profile picture</p>
                    </div>
                </div>
            </div>
            
            <div class="settings-card">
                <div class="card-header">
                    <h4>Personal Information</h4>
                    <span class="card-badge">Required</span>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="profileName" value="${this.currentUser.name || ''}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="profileEmail" value="${this.currentUser.email || ''}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Bio</label>
                        <textarea id="profileBio" class="form-textarea" placeholder="Tell us about yourself...">${this.currentUser.bio || ''}</textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <button class="btn-secondary" onclick="settingsManager.cancelChanges()">Cancel</button>
            <button class="btn-primary" onclick="settingsManager.saveProfile()">Save Changes</button>
        </div>`;
    }

    setupProfileEvents() {
        const avatarInput = document.getElementById('avatarUpload');
        avatarInput?.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            // Update current user
            this.currentUser.profilePicture = imageData;
            this.saveUserData();
            
            // Update profile preview
            document.getElementById('profileAvatar').src = imageData;
            
            // 🚀 REAL EFFECT: Update sidebar avatar in real-time
            this.updateSidebarAvatar(imageData);
            
            this.showNotification('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
    }

    saveProfile() {
        const newName = document.getElementById('profileName').value.trim();
        const newEmail = document.getElementById('profileEmail').value.trim();
        const newBio = document.getElementById('profileBio').value.trim();

        if (!newName || !newEmail) {
            this.showNotification('Name and email are required', 'error');
            return;
        }

        // 🚀 REAL EFFECT: Handle email change for login system
        if (newEmail !== this.currentUser.email) {
            this.handleEmailChange(this.currentUser.email, newEmail);
        }

        // Update user data
        this.currentUser.name = newName;
        this.currentUser.email = newEmail;
        this.currentUser.bio = newBio;

        this.saveUserData();

        // 🚀 REAL EFFECTS: Update entire app in real-time
        this.updateSidebarName(newName);
        this.updateDashboardName(newName);
        document.getElementById('profileNameDisplay').textContent = newName;

        this.showNotification('Profile updated successfully!', 'success');
    }

    // 🚀 REAL EFFECT: Update sidebar avatar
    updateSidebarAvatar(imageData) {
        const sidebarAvatar = document.querySelector('.profile img');
        if (sidebarAvatar) sidebarAvatar.src = imageData;
    }

    // 🚀 REAL EFFECT: Update sidebar name
    updateSidebarName(newName) {
        const sidebarName = document.querySelector('.username');
        if (sidebarName) sidebarName.textContent = newName;
    }

    // 🚀 REAL EFFECT: Update dashboard name
    updateDashboardName(newName) {
        const dashboardNames = document.querySelectorAll('.user-name, .welcome-text');
        dashboardNames.forEach(el => el.textContent = newName);
    }

    // 🚀 REAL EFFECT: Handle email change for login
    handleEmailChange(oldEmail, newEmail) {
        const userData = JSON.parse(localStorage.getItem(`lifeboard_user_${oldEmail}`));
        localStorage.setItem(`lifeboard_user_${newEmail}`, JSON.stringify(userData));
        localStorage.removeItem(`lifeboard_user_${oldEmail}`);
        localStorage.setItem('current_user_email', newEmail);
    }

    // ==================== APPEARANCE ====================
    getAppearanceHTML() {
        const currentTheme = this.currentUser.theme || 'dark';
        return `
        <div class="section-header">
            <h3>Appearance</h3>
            <p>Customize how LifeBoard looks and feels</p>
        </div>
        <div class="settings-grid">
            <div class="settings-card">
                <div class="card-header">
                    <h4>Theme</h4>
                </div>
                <div class="theme-selector">
                    <div class="theme-option ${currentTheme === 'dark' ? 'active' : ''}" onclick="settingsManager.setTheme('dark')">
                        <div class="theme-preview dark">
                            <div class="preview-header"></div>
                            <div class="preview-sidebar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <span>Dark Mode</span>
                    </div>
                    <div class="theme-option ${currentTheme === 'light' ? 'active' : ''}" onclick="settingsManager.setTheme('light')">
                        <div class="theme-preview light">
                            <div class="preview-header"></div>
                            <div class="preview-sidebar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <span>Light Mode</span>
                    </div>
                    <div class="theme-option ${currentTheme === 'auto' ? 'active' : ''}" onclick="settingsManager.setTheme('auto')">
                        <div class="theme-preview auto">
                            <div class="preview-header"></div>
                            <div class="preview-sidebar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <span>System Auto</span>
                    </div>
                </div>
            </div>
            
            <div class="settings-card">
                <div class="card-header">
                    <h4>Accent Color</h4>
                </div>
                <div class="color-picker">
                    <div class="color-option ${this.currentUser.accentColor === 'blue' ? 'active' : ''}" onclick="settingsManager.setAccentColor('blue')" style="background: #00d1ff;"></div>
                    <div class="color-option ${this.currentUser.accentColor === 'purple' ? 'active' : ''}" onclick="settingsManager.setAccentColor('purple')" style="background: #9b59b6;"></div>
                    <div class="color-option ${this.currentUser.accentColor === 'green' ? 'active' : ''}" onclick="settingsManager.setAccentColor('green')" style="background: #2ecc71;"></div>
                    <div class="color-option ${this.currentUser.accentColor === 'orange' ? 'active' : ''}" onclick="settingsManager.setAccentColor('orange')" style="background: #e67e22;"></div>
                </div>
            </div>
        </div>`;
    }

    setupAppearanceEvents() {}

    // 🚀 REAL EFFECT: Change theme across entire app
    setTheme(theme) {
        this.currentUser.theme = theme;
        this.saveUserData();
        
        // Apply theme to entire app
        document.body.className = '';
        document.body.classList.add(theme + '-theme');
        
        // Update theme toggle button in sidebar
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = theme === 'dark' ? '🌜' : '🌞';
        }
        
        this.showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`, 'success');
    }

    // 🚀 REAL EFFECT: Change accent color across app
    setAccentColor(color) {
        this.currentUser.accentColor = color;
        this.saveUserData();
        
        // Apply accent color to CSS variables
        const root = document.documentElement;
        const colors = {
            blue: '#00d1ff',
            purple: '#9b59b6', 
            green: '#2ecc71',
            orange: '#e67e22'
        };
        root.style.setProperty('--accent-color', colors[color]);
        
        this.showNotification(`Accent color changed to ${color}`, 'success');
    }

    // ==================== LANGUAGE ====================
    getLanguageHTML() {
        const currentLang = this.currentUser.language || 'en';
        return `
        <div class="section-header">
            <h3>Language & Region</h3>
            <p>Change language for entire application</p>
        </div>
        <div class="settings-card">
            <div class="form-group">
                <label>Application Language</label>
                <select id="languageSelect" class="form-select">
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                    <option value="es" ${currentLang === 'es' ? 'selected' : ''}>Español</option>
                    <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français</option>
                </select>
            </div>
            
            <div class="language-preview">
                <h4>Preview</h4>
                <p id="previewText">This is how text will appear in your selected language</p>
            </div>
            
            <button class="btn-primary" onclick="settingsManager.applyLanguage()">Apply Language</button>
        </div>`;
    }

    setupLanguageEvents() {}

    // 🚀 REAL EFFECT: Change language across entire app
    applyLanguage() {
        const lang = document.getElementById('languageSelect').value;
        this.currentUser.language = lang;
        this.saveUserData();
        
        // Update all text in the app
        this.updateAppLanguage(lang);
        
        this.showNotification(`Language changed to ${this.getLanguageName(lang)}`, 'success');
    }

    updateAppLanguage(lang) {
        const translations = {
            en: {
                previewText: "This is how text will appear in your selected language",
                tasks: "Tasks",
                habits: "Habits", 
                journal: "Journal",
                analytics: "Analytics"
            },
            es: {
                previewText: "Así es como aparecerá el texto en su idioma seleccionado",
                tasks: "Tareas",
                habits: "Hábitos",
                journal: "Diario", 
                analytics: "Analíticas"
            },
            fr: {
                previewText: "C'est ainsi que le texte apparaîtra dans votre langue sélectionnée",
                tasks: "Tâches",
                habits: "Habitudes",
                journal: "Journal",
                analytics: "Analyses"
            }
        };
        
        const texts = translations[lang];
        
        // Update preview text
        const preview = document.getElementById('previewText');
        if (preview) preview.textContent = texts.previewText;
        
        // Update navigation (real effect)
        const navLinks = document.querySelectorAll('.nav-btn');
        if (navLinks[0]) navLinks[0].textContent = texts.tasks;
        if (navLinks[1]) navLinks[1].textContent = texts.habits;
        if (navLinks[2]) navLinks[2].textContent = texts.journal;
        if (navLinks[3]) navLinks[3].textContent = texts.analytics;
        
        // Save language preference
        localStorage.setItem('app_language', lang);
    }

    getLanguageName(code) {
        const names = { en: 'English', es: 'Spanish', fr: 'French' };
        return names[code] || 'English';
    }

    // ==================== NOTIFICATIONS ====================
    getNotificationsHTML() {
        return `
        <div class="section-header">
            <h3>Notifications</h3>
            <p>Control how and when you receive notifications</p>
        </div>
        <div class="settings-grid">
            <div class="settings-card">
                <div class="card-header">
                    <h4>Push Notifications</h4>
                </div>
                <div class="toggle-group">
                    <label class="toggle-item">
                        <span>Habit Reminders</span>
                        <input type="checkbox" ${this.currentUser.notifications?.habitReminders ? 'checked' : ''} onchange="settingsManager.toggleNotification('habitReminders', this.checked)">
                    </label>
                    <label class="toggle-item">
                        <span>Goal Achievements</span>
                        <input type="checkbox" ${this.currentUser.notifications?.goalAchievements ? 'checked' : ''} onchange="settingsManager.toggleNotification('goalAchievements', this.checked)">
                    </label>
                    <label class="toggle-item">
                        <span>Daily Summary</span>
                        <input type="checkbox" ${this.currentUser.notifications?.dailySummary ? 'checked' : ''} onchange="settingsManager.toggleNotification('dailySummary', this.checked)">
                    </label>
                </div>
            </div>
            
            <div class="settings-card">
                <div class="card-header">
                    <h4>Quiet Hours</h4>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Start Time</label>
                        <input type="time" id="quietStart" value="${this.currentUser.quietHours?.start || '22:00'}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>End Time</label>
                        <input type="time" id="quietEnd" value="${this.currentUser.quietHours?.end || '07:00'}" class="form-input">
                    </div>
                </div>
                <button class="btn-primary" onclick="settingsManager.saveQuietHours()">Save Quiet Hours</button>
            </div>
        </div>`;
    }

    setupNotificationEvents() {}

    // 🚀 REAL EFFECT: Toggle notification types
    toggleNotification(type, enabled) {
        if (!this.currentUser.notifications) this.currentUser.notifications = {};
        this.currentUser.notifications[type] = enabled;
        this.saveUserData();
        
        // Real effect: If habit reminders disabled, stop reminder system
        if (type === 'habitReminders' && !enabled) {
            this.disableHabitReminders();
        }
    }

    // 🚀 REAL EFFECT: Save quiet hours
    saveQuietHours() {
        const start = document.getElementById('quietStart').value;
        const end = document.getElementById('quietEnd').value;
        
        if (!this.currentUser.quietHours) this.currentUser.quietHours = {};
        this.currentUser.quietHours.start = start;
        this.currentUser.quietHours.end = end;
        this.saveUserData();
        
        this.showNotification('Quiet hours updated', 'success');
    }

    // ==================== OTHER SECTIONS ====================
    getSecurityHTML() { return '<div class="empty-state">Security settings coming soon</div>'; }
    getPrivacyHTML() { return '<div class="empty-state">Privacy settings coming soon</div>'; }
    getBillingHTML() { return '<div class="empty-state">Billing settings coming soon</div>'; }
    getAccessibilityHTML() { return '<div class="empty-state">Accessibility settings coming soon</div>'; }
    getStorageHTML() { return '<div class="empty-state">Storage settings coming soon</div>'; }
    getApiHTML() { return '<div class="empty-state">API settings coming soon</div>'; }
    getDevicesHTML() { return '<div class="empty-state">Device settings coming soon</div>'; }
    getAdvancedHTML() { return '<div class="empty-state">Advanced settings coming soon</div>'; }
    getHelpHTML() { return '<div class="empty-state">Help & Support coming soon</div>'; }
    getAboutHTML() { return '<div class="empty-state">About LifeBoard coming soon</div>'; }

    setupSecurityEvents() {}
    setupPrivacyEvents() {}
    setupBillingEvents() {}
    setupAccessibilityEvents() {}
    setupStorageEvents() {}
    setupApiEvents() {}
    setupDevicesEvents() {}
    setupAdvancedEvents() {}

    // ==================== UTILITY METHODS ====================
    saveUserData() {
        localStorage.setItem(`lifeboard_user_${this.currentUser.email}`, JSON.stringify(this.currentUser));
    }

    cancelChanges() {
        this.loadSection(this.currentSection);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 107, 107, 0.9)'};
            color: white;
            border-radius: 12px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 🚀 REAL EFFECT: Apply all saved settings when app starts
    applySavedSettings() {
        if (!this.currentUser) return;
        
        // Apply theme
        if (this.currentUser.theme) {
            this.setTheme(this.currentUser.theme);
        }
        
        // Apply accent color
        if (this.currentUser.accentColor) {
            this.setAccentColor(this.currentUser.accentColor);
        }
        
        // Apply language
        if (this.currentUser.language) {
            this.updateAppLanguage(this.currentUser.language);
        }
        
        // Apply profile picture
        if (this.currentUser.profilePicture) {
            this.updateSidebarAvatar(this.currentUser.profilePicture);
        }
        
        // Apply name
        if (this.currentUser.name) {
            this.updateSidebarName(this.currentUser.name);
        }
    }

    disableHabitReminders() {
        // Real effect: Stop any running habit reminder intervals
        console.log('Habit reminders disabled - stopping reminder system');
        // You would integrate this with your actual reminder system
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();

// Make it globally available
window.settingsManager = settingsManager;