// SelamBus - Authentication System

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
        // Default to login; allow overriding via URL ?form=login|register|forgotPassword
        try {
            const params = new URLSearchParams(window.location.search);
            const formParam = params.get('form');
            if (formParam) {
                this.switchForm(formParam);
            } else {
                this.switchForm('login');
            }
        } catch (e) {
            this.switchForm('login');
        }
    }

    setupEventListeners() {
        // Form switching
        document.querySelectorAll('.switch-form').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = e.target.dataset.form;
                this.switchForm(formType);
            });
        });

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        document.getElementById('forgotPasswordFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordReset();
        });

        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = e.target.closest('.social-btn').classList.contains('google') ? 'google' : 'facebook';
                this.handleSocialLogin(provider);
            });
        });

        // Forgot password link
        document.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('forgotPassword');
        });
    }

    setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.closest('.toggle-password').dataset.target;
                const input = document.getElementById(targetId);
                const icon = e.target.closest('.toggle-password').querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrength');
        let strength = 0;
        
        // Check length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Check for lowercase letters
        if (/[a-z]/.test(password)) strength++;
        
        // Check for uppercase letters
        if (/[A-Z]/.test(password)) strength++;
        
        // Check for numbers
        if (/\d/.test(password)) strength++;
        
        // Check for special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        // Update strength bar
        strengthBar.className = 'password-strength';
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    switchForm(formType) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Show target form
        const targetForm = document.getElementById(formType + 'Form');
        if (targetForm) {
            targetForm.classList.add('active');
            
            // Reset form
            const formElement = targetForm.querySelector('form');
            if (formElement) {
                formElement.reset();
                this.clearErrors(formElement);
            }
        }
    }

    async handleLogin() {
        if (this.isProcessing) return;
        
        const form = document.getElementById('loginFormElement');
        const formData = new FormData(form);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');
        
        // Clear previous errors
        this.clearErrors(form);
        
        // Validate inputs
        if (!this.validateEmail(email) && !this.validatePhone(email)) {
            this.showError('loginEmailError', 'Please enter a valid email or phone number');
            return;
        }
        
        if (password.length < 6) {
            this.showError('loginPasswordError', 'Password must be at least 6 characters');
            return;
        }
        
        // Show loading state
        this.setLoadingState('loginFormElement', true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Check credentials
            const users = this.getUsers();
            const user = users.find(u => 
                (u.email === email || u.phone === email) && u.password === password
            );
            
            if (user) {
                // Store user data
                this.currentUser = user;
                this.storeUserSession(user, rememberMe);
                
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard or previous page
                setTimeout(() => {
                    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'profile.html';
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }, 1500);
                
            } else {
                this.showError('loginEmailError', 'Invalid email/phone or password');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('loginEmailError', 'Login failed. Please try again.');
        } finally {
            this.setLoadingState('loginFormElement', false);
        }
    }

    async handleRegistration() {
        if (this.isProcessing) return;
        
        const form = document.getElementById('registerFormElement');
        const formData = new FormData(form);
        
        const firstName = formData.get('firstName').trim();
        const lastName = formData.get('lastName').trim();
        const email = formData.get('email').trim();
        const phoneNumber = formData.get('phoneNumber').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const terms = formData.get('terms');
        
        // Clear previous errors
        this.clearErrors(form);
        
        // Validate inputs
        let isValid = true;
        
        if (firstName.length < 2) {
            this.showError('firstNameError', 'First name must be at least 2 characters');
            isValid = false;
        }
        
        if (lastName.length < 2) {
            this.showError('lastNameError', 'Last name must be at least 2 characters');
            isValid = false;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('registerEmailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!this.validatePhone(phoneNumber)) {
            this.showError('phoneNumberError', 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (password.length < 8) {
            this.showError('registerPasswordError', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!this.validatePasswordStrength(password)) {
            this.showError('registerPasswordError', 'Password must contain uppercase, lowercase, number, and special character');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        if (!terms) {
            this.showError('termsError', 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        this.setLoadingState('registerFormElement', true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Check if email already exists
            const users = this.getUsers();
            if (users.some(u => u.email === email)) {
                this.showError('registerEmailError', 'Email address is already registered');
                return;
            }
            
            if (users.some(u => u.phone === phoneNumber)) {
                this.showError('phoneNumberError', 'Phone number is already registered');
                return;
            }
            
            // Create new user
            const newUser = {
                id: this.generateUserId(),
                firstName,
                lastName,
                email,
                phone: phoneNumber,
                password, // In real app, this should be hashed
                createdAt: new Date().toISOString(),
                profile: {
                    avatar: this.generateAvatar(firstName, lastName),
                    preferences: {
                        language: 'en',
                        currency: 'ETB',
                        notifications: true
                    }
                }
            };
            
            // Store user
            users.push(newUser);
            this.storeUsers(users);
            
            this.showSuccess('Account created successfully! Please log in.');
            
            // Switch to login form
            setTimeout(() => {
                this.switchForm('login');
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('registerEmailError', 'Registration failed. Please try again.');
        } finally {
            this.setLoadingState('registerFormElement', false);
        }
    }

    async handlePasswordReset() {
        if (this.isProcessing) return;
        
        const form = document.getElementById('forgotPasswordFormElement');
        const formData = new FormData(form);
        const email = formData.get('email').trim();
        
        // Clear previous errors
        this.clearErrors(form);
        
        // Validate email
        if (!this.validateEmail(email)) {
            this.showError('resetEmailError', 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        this.setLoadingState('forgotPasswordFormElement', true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Check if email exists
            const users = this.getUsers();
            if (!users.some(u => u.email === email)) {
                this.showError('resetEmailError', 'Email address not found');
                return;
            }
            
            this.showSuccess('Password reset instructions sent to your email!');
            
            // Switch to login form
            setTimeout(() => {
                this.switchForm('login');
            }, 2000);
            
        } catch (error) {
            console.error('Password reset error:', error);
            this.showError('resetEmailError', 'Failed to send reset instructions. Please try again.');
        } finally {
            this.setLoadingState('forgotPasswordFormElement', false);
        }
    }

    async handleSocialLogin(provider) {
        if (this.isProcessing) return;
        
        this.showLoading('Connecting to ' + provider + '...');
        
        try {
            // Simulate social login
            await this.simulateApiCall();
            
            // Create or update user
            const socialUser = {
                id: this.generateUserId(),
                firstName: provider === 'google' ? 'Google' : 'Facebook',
                lastName: 'User',
                email: `user@${provider}.com`,
                phone: '+251900000000',
                provider: provider,
                createdAt: new Date().toISOString(),
                profile: {
                    avatar: this.generateAvatar('Social', 'User'),
                    preferences: {
                        language: 'en',
                        currency: 'ETB',
                        notifications: true
                    }
                }
            };
            
            this.currentUser = socialUser;
            this.storeUserSession(socialUser, false);
            
            this.showSuccess('Login successful with ' + provider + '!');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
            
        } catch (error) {
            console.error('Social login error:', error);
            this.showError('loginEmailError', 'Social login failed. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    // Validation methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^(\+251|0)?[1-9]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validatePasswordStrength(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }

    // Utility methods
    clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('error', 'success');
        });
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        const inputElement = errorElement.previousElementSibling.querySelector('input');
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.classList.remove('success');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    setLoadingState(formId, loading) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
            this.isProcessing = true;
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            this.isProcessing = false;
        }
    }

    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = message;
        overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }

    // Storage methods
    getUsers() {
        const users = localStorage.getItem('selambus_users');
        return users ? JSON.parse(users) : [];
    }

    storeUsers(users) {
        localStorage.setItem('selambus_users', JSON.stringify(users));
    }

    storeUserSession(user, rememberMe = false) {
        const sessionData = {
            user: user,
            timestamp: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('selambus_session', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('selambus_session', JSON.stringify(sessionData));
        }
    }

    checkAuthState() {
        // Check session storage first
        let sessionData = sessionStorage.getItem('selambus_session');
        
        // If not found, check local storage
        if (!sessionData) {
            sessionData = localStorage.getItem('selambus_session');
        }
        
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                const sessionTime = new Date(parsed.timestamp);
                const now = new Date();
                const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
                
                // Session expires after 24 hours
                if (hoursDiff < 24) {
                    this.currentUser = parsed.user;
                    
                    // If user is on auth page and already logged in, redirect to profile
                    if (window.location.pathname.includes('auth.html')) {
                        window.location.href = 'profile.html';
                    }
                } else {
                    // Clear expired session
                    sessionStorage.removeItem('selambus_session');
                    localStorage.removeItem('selambus_session');
                }
            } catch (error) {
                console.error('Session parsing error:', error);
            }
        }
    }

    // Utility methods
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAvatar(firstName, lastName) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&background=3b82f6&color=fff&size=128`;
    }

    simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    }

    logout() {
        sessionStorage.removeItem('selambus_session');
        localStorage.removeItem('selambus_session');
        this.currentUser = null;
        
        this.showSuccess('Logged out successfully!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Global functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize auth manager
let authManager;

document.addEventListener('DOMContentLoaded', function() {
    authManager = new AuthManager();
    window.authManager = authManager;
});

// Add authentication styles
const authStyles = `
    .auth-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
    }
    
    .auth-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        z-index: 1;
    }
    
    .auth-header {
        padding: 2rem 0;
        text-align: center;
        position: relative;
        z-index: 2;
    }
    
    .auth-logo h1 {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .auth-logo p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        font-weight: 300;
    }
    
    .auth-forms-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;
        position: relative;
        z-index: 2;
    }
    
    .auth-form {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        padding: 2.5rem;
        width: 100%;
        max-width: 450px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        display: none;
    }
    
    .auth-form.active {
        transform: translateY(0);
        opacity: 1;
        display: block;
    }
    
    .form-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .form-header h2 {
        color: #1f2937;
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .form-header p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
        position: relative;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group label {
        display: block;
        color: #374151;
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .input-group {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .input-group i {
        position: absolute;
        left: 1rem;
        color: #9ca3af;
        font-size: 1rem;
        z-index: 1;
    }
    
    .input-group input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        background: #f9fafb;
    }
    
    .input-group input:focus {
        outline: none;
        border-color: #3b82f6;
        background: white;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .input-group input.error {
        border-color: #ef4444;
        background: #fef2f2;
    }
    
    .input-group input.success {
        border-color: #10b981;
        background: #f0fdf4;
    }
    
    .toggle-password {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1rem;
        transition: color 0.3s ease;
    }
    
    .toggle-password:hover {
        color: #6b7280;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        min-height: 1rem;
    }
    
    .password-strength {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        margin-top: 0.5rem;
        overflow: hidden;
    }
    
    .password-strength.weak {
        background: #ef4444;
    }
    
    .password-strength.medium {
        background: #f59e0b;
    }
    
    .password-strength.strong {
        background: #10b981;
    }
    
    .remember-forgot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .checkbox-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.9rem;
        color: #374151;
        user-select: none;
    }
    
    .checkbox-container input {
        display: none;
    }
    
    .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid #d1d5db;
        border-radius: 0.25rem;
        margin-right: 0.5rem;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .checkbox-container input:checked + .checkmark {
        background: #3b82f6;
        border-color: #3b82f6;
    }
    
    .checkbox-container input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }
    
    .forgot-password,
    .terms-link {
        color: #3b82f6;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .forgot-password:hover,
    .terms-link:hover {
        color: #2563eb;
        text-decoration: underline;
    }
    
    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
    
    .btn-primary:active {
        transform: translateY(0);
    }
    
    .btn-primary:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    
    .btn-full {
        width: 100%;
    }
    
    .btn-loading {
        display: none;
    }
    
    .btn-loading i {
        margin-right: 0.5rem;
    }
    
    .form-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .form-footer p {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .switch-form {
        color: #3b82f6;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
    }
    
    .switch-form:hover {
        color: #2563eb;
        text-decoration: underline;
    }
    
    .social-login {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .divider {
        text-align: center;
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .divider span {
        background: white;
        padding: 0 1rem;
        color: #9ca3af;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e5e7eb;
        z-index: -1;
    }
    
    .social-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .social-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        background: white;
        color: #374151;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .social-btn:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        transform: translateY(-1px);
    }
    
    .social-btn.google {
        border-color: #ea4335;
        color: #ea4335;
    }
    
    .social-btn.google:hover {
        background: #fef2f2;
        border-color: #dc2626;
    }
    
    .social-btn.facebook {
        border-color: #1877f2;
        color: #1877f2;
    }
    
    .social-btn.facebook:hover {
        background: #eff6ff;
        border-color: #2563eb;
    }
    
    .auth-footer {
        padding: 2rem 0;
        text-align: center;
        position: relative;
        z-index: 2;
    }
    
    .auth-links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 1rem;
    }
    
    .auth-links a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;
    }
    
    .auth-links a:hover {
        color: white;
    }
    
    .auth-footer p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
        margin: 0;
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .loading-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e5e7eb;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 90%;
    }
    
    .success-icon, .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .success-icon {
        color: #10b981;
    }
    
    .error-icon {
        color: #ef4444;
    }
    
    .modal-content h3 {
        color: #1f2937;
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .modal-content p {
        color: #6b7280;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }
    
    .modal-content .btn {
        margin: 0 auto;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1002;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: #10b981;
    }
    
    .notification-error {
        background: #ef4444;
    }
    
    .notification-info {
        background: #3b82f6;
    }
    
    @media (max-width: 768px) {
        .auth-form {
            padding: 2rem;
            margin: 1rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
            gap: 0;
        }
        
        .social-buttons {
            grid-template-columns: 1fr;
        }
        
        .auth-links {
            flex-direction: column;
            gap: 1rem;
        }
        
        .notification {
            right: 10px;
            max-width: calc(100% - 20px);
        }
    }
    
    @media (max-width: 480px) {
        .auth-form {
            padding: 1.5rem;
            margin: 0.5rem;
        }
        
        .form-header h2 {
            font-size: 1.5rem;
        }
        
        .form-header p {
            font-size: 0.9rem;
        }
        
        .input-group input {
            font-size: 0.9rem;
        }
        
        .btn {
            font-size: 0.9rem;
            padding: 0.75rem 1rem;
        }
        
        .social-btn {
            font-size: 0.85rem;
            padding: 0.75rem 0.5rem;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = authStyles;
document.head.appendChild(styleSheet);