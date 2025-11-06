// SelamBus Profile Page JavaScript

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'overview';
        this.bookings = [];
        this.transactions = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadSampleData();
        this.renderCurrentTab();
        this.setupProfileActions();
    }

    loadUserData() {
        // Load user data from localStorage or session
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        } else {
            // Create sample user data
            this.currentUser = {
                id: 'user_001',
                name: 'Abebe Kebede',
                email: 'abebe.kebede@email.com',
                phone: '+251911234567',
                avatar: 'https://via.placeholder.com/150/3b82f6/white?text=AK',
                joinedDate: '2023-01-15',
                totalBookings: 12,
                totalSpent: 12500,
                walletBalance: 2500,
                loyaltyPoints: 850
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Profile actions
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.openEditProfileModal();
        });

        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.openChangePasswordModal();
        });

        // Booking filters
        document.getElementById('bookingStatusFilter')?.addEventListener('change', (e) => {
            this.filterBookings(e.target.value);
        });

        document.getElementById('bookingDateFilter')?.addEventListener('change', (e) => {
            this.filterBookingsByDate(e.target.value);
        });

        // Wallet actions
        document.getElementById('addFundsBtn')?.addEventListener('click', () => {
            this.openAddFundsModal();
        });

        // Form submissions
        document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileChanges();
        });

        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        document.getElementById('addFundsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFunds();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    setupProfileActions() {
        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                const actionType = e.currentTarget.dataset.action;
                this.handleQuickAction(actionType);
            });
        });
    }

    loadSampleData() {
        // Load sample bookings
        const bookingsData = localStorage.getItem('userBookings');
        if (bookingsData) {
            this.bookings = JSON.parse(bookingsData);
        } else {
            this.bookings = this.generateSampleBookings();
            localStorage.setItem('userBookings', JSON.stringify(this.bookings));
        }

        // Load sample transactions
        const transactionsData = localStorage.getItem('userTransactions');
        if (transactionsData) {
            this.transactions = JSON.parse(transactionsData);
        } else {
            this.transactions = this.generateSampleTransactions();
            localStorage.setItem('userTransactions', JSON.stringify(this.transactions));
        }
    }

    generateSampleBookings() {
        const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        const routes = [
            { from: 'Addis Ababa', to: 'Adama' },
            { from: 'Addis Ababa', to: 'Hawassa' },
            { from: 'Addis Ababa', to: 'Bahir Dar' },
            { from: 'Adama', to: 'Dire Dawa' },
            { from: 'Addis Ababa', to: 'Mekele' }
        ];

        return Array.from({ length: 8 }, (_, i) => {
            const route = routes[Math.floor(Math.random() * routes.length)];
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 15);
            
            return {
                id: `BK${String(i + 1).padStart(6, '0')}`,
                route: `${route.from} → ${route.to}`,
                date: date.toISOString().split('T')[0],
                time: `${Math.floor(Math.random() * 12) + 6}:${Math.floor(Math.random() * 6)}0 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
                company: ['Selam Bus', 'Abay Bus', 'Sky Bus', 'Ethio Bus'][Math.floor(Math.random() * 4)],
                passengers: Math.floor(Math.random() * 3) + 1,
                amount: Math.floor(Math.random() * 3000) + 500,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                busType: ['Economy', 'Business', 'Luxury'][Math.floor(Math.random() * 3)]
            };
        });
    }

    generateSampleTransactions() {
        const types = ['payment', 'refund', 'deposit', 'withdrawal'];
        
        return Array.from({ length: 10 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            const amount = Math.floor(Math.random() * 2000) + 100;
            const type = types[Math.floor(Math.random() * types.length)];
            
            return {
                id: `TX${String(i + 1).padStart(8, '0')}`,
                type: type,
                amount: type === 'refund' || type === 'withdrawal' ? -amount : amount,
                date: date.toISOString().split('T')[0],
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} for booking ${Math.floor(Math.random() * 1000)}`
            };
        });
    }

    switchTab(tab) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');

        this.currentTab = tab;
        this.renderCurrentTab();
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'overview':
                this.renderOverview();
                break;
            case 'bookings':
                this.renderBookings();
                break;
            case 'wallet':
                this.renderWallet();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    renderOverview() {
        // Update profile info
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('userPhone').textContent = this.currentUser.phone;
        document.getElementById('userAvatar').src = this.currentUser.avatar;
        
        // Update stats
        document.getElementById('totalBookings').textContent = this.currentUser.totalBookings;
        document.getElementById('totalSpent').textContent = `ETB ${this.currentUser.totalSpent.toLocaleString()}`;
        document.getElementById('loyaltyPoints').textContent = this.currentUser.loyaltyPoints;

        // Render recent activity
        this.renderRecentActivity();
    }

    renderRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        const recentBookings = this.bookings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        activityList.innerHTML = recentBookings.map(booking => {
            const iconClass = this.getActivityIcon(booking.status);
            const statusClass = this.getStatusClass(booking.status);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${statusClass}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${booking.route}</div>
                        <div class="activity-description">${booking.company} - ${booking.date}</div>
                        <div class="activity-time">${booking.status}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderBookings() {
        const bookingsList = document.querySelector('.bookings-list');
        if (!bookingsList) return;

        const filteredBookings = this.getFilteredBookings();
        
        bookingsList.innerHTML = filteredBookings.map(booking => {
            const statusClass = this.getStatusClass(booking.status);
            
            return `
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-id">${booking.id}</div>
                        <div class="booking-status ${statusClass}">${booking.status}</div>
                    </div>
                    <div class="booking-route">${booking.route}</div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <div class="booking-detail-label">Date</div>
                            <div class="booking-detail-value">${booking.date}</div>
                        </div>
                        <div class="booking-detail">
                            <div class="booking-detail-label">Time</div>
                            <div class="booking-detail-value">${booking.time}</div>
                        </div>
                        <div class="booking-detail">
                            <div class="booking-detail-label">Company</div>
                            <div class="booking-detail-value">${booking.company}</div>
                        </div>
                        <div class="booking-detail">
                            <div class="booking-detail-label">Passengers</div>
                            <div class="booking-detail-value">${booking.passengers}</div>
                        </div>
                        <div class="booking-detail">
                            <div class="booking-detail-label">Bus Type</div>
                            <div class="booking-detail-value">${booking.busType}</div>
                        </div>
                        <div class="booking-detail">
                            <div class="booking-detail-label">Amount</div>
                            <div class="booking-detail-value">ETB ${booking.amount.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-primary btn-sm" onclick="profileManager.viewBooking('${booking.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="profileManager.downloadTicket('${booking.id}')">
                            <i class="fas fa-download"></i> Download Ticket
                        </button>
                        ${booking.status !== 'cancelled' ? `
                            <button class="btn btn-danger btn-sm" onclick="profileManager.cancelBooking('${booking.id}')">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderWallet() {
        // Update wallet balance
        document.getElementById('walletBalance').textContent = `ETB ${this.currentUser.walletBalance.toLocaleString()}`;
        
        // Update wallet stats
        const totalDeposits = this.transactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalWithdrawals = this.transactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        document.getElementById('totalDeposits').textContent = `ETB ${totalDeposits.toLocaleString()}`;
        document.getElementById('totalWithdrawals').textContent = `ETB ${totalWithdrawals.toLocaleString()}`;

        // Render transactions
        this.renderTransactions();
    }

    renderTransactions() {
        const transactionsList = document.querySelector('.transactions-list');
        if (!transactionsList) return;

        transactionsList.innerHTML = this.transactions.map(transaction => {
            const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
            const amountSign = transaction.amount >= 0 ? '+' : '';
            
            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-type">${transaction.description}</div>
                        <div class="transaction-date">${transaction.date}</div>
                    </div>
                    <div class="transaction-amount ${amountClass}">
                        ${amountSign}ETB ${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSettings() {
        // Populate settings form
        document.getElementById('fullName').value = this.currentUser.name;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('phone').value = this.currentUser.phone;
        
        // Set notification preferences
        document.getElementById('emailNotifications').checked = true;
        document.getElementById('smsNotifications').checked = false;
        document.getElementById('pushNotifications').checked = true;
    }

    getFilteredBookings() {
        let filtered = [...this.bookings];
        
        // Filter by status
        const statusFilter = document.getElementById('bookingStatusFilter')?.value;
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }
        
        // Filter by date
        const dateFilter = document.getElementById('bookingDateFilter')?.value;
        if (dateFilter) {
            const today = new Date();
            const filterDate = new Date(today);
            
            switch (dateFilter) {
                case 'today':
                    filtered = filtered.filter(booking => 
                        new Date(booking.date).toDateString() === today.toDateString()
                    );
                    break;
                case 'week':
                    filterDate.setDate(today.getDate() - 7);
                    filtered = filtered.filter(booking => 
                        new Date(booking.date) >= filterDate
                    );
                    break;
                case 'month':
                    filterDate.setMonth(today.getMonth() - 1);
                    filtered = filtered.filter(booking => 
                        new Date(booking.date) >= filterDate
                    );
                    break;
            }
        }
        
        return filtered;
    }

    handleQuickAction(action) {
        switch (action) {
            case 'new-booking':
                window.location.href = 'index.html';
                break;
            case 'view-bookings':
                this.switchTab('bookings');
                break;
            case 'wallet':
                this.switchTab('wallet');
                break;
            case 'support':
                this.showNotification('Contact support at: support@selambus.com', 'info');
                break;
            case 'settings':
                this.switchTab('settings');
                break;
        }
    }

    viewBooking(bookingId) {
        // Navigate to booking details page
        window.location.href = `booking-confirmation.html?bookingId=${bookingId}`;
    }

    downloadTicket(bookingId) {
        // Simulate ticket download
        this.showNotification('Ticket download started...', 'success');
        
        // In a real implementation, this would generate a PDF ticket
        setTimeout(() => {
            this.showNotification('Ticket downloaded successfully!', 'success');
        }, 2000);
    }

    cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            const booking = this.bookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = 'cancelled';
                this.currentUser.walletBalance += booking.amount;
                
                // Add refund transaction
                this.transactions.unshift({
                    id: `TX${Date.now()}`,
                    type: 'refund',
                    amount: booking.amount,
                    date: new Date().toISOString().split('T')[0],
                    description: `Refund for cancelled booking ${bookingId}`
                });
                
                // Save updated data
                localStorage.setItem('userBookings', JSON.stringify(this.bookings));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem('userTransactions', JSON.stringify(this.transactions));
                
                this.renderBookings();
                this.showNotification('Booking cancelled successfully. Refund processed.', 'success');
            }
        }
    }

    openEditProfileModal() {
        const modal = document.getElementById('editProfileModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    openChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    openAddFundsModal() {
        const modal = document.getElementById('addFundsModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    saveProfileChanges() {
        const formData = new FormData(document.getElementById('editProfileForm'));
        
        this.currentUser.name = formData.get('fullName');
        this.currentUser.email = formData.get('email');
        this.currentUser.phone = formData.get('phone');
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.closeModal(document.getElementById('editProfileModal'));
        this.renderOverview();
        this.showNotification('Profile updated successfully!', 'success');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match!', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification('Password must be at least 8 characters long!', 'error');
            return;
        }
        
        // In a real implementation, this would verify the current password with the server
        this.closeModal(document.getElementById('changePasswordModal'));
        this.showNotification('Password changed successfully!', 'success');
    }

    addFunds() {
        const amount = parseFloat(document.getElementById('fundAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        if (amount <= 0) {
            this.showNotification('Please enter a valid amount!', 'error');
            return;
        }
        
        // Simulate payment processing
        this.showNotification('Processing payment...', 'info');
        
        setTimeout(() => {
            this.currentUser.walletBalance += amount;
            
            // Add deposit transaction
            this.transactions.unshift({
                id: `TX${Date.now()}`,
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString().split('T')[0],
                description: `Wallet deposit via ${paymentMethod}`
            });
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('userTransactions', JSON.stringify(this.transactions));
            
            this.closeModal(document.getElementById('addFundsModal'));
            this.renderWallet();
            this.showNotification(`ETB ${amount.toLocaleString()} added to your wallet!`, 'success');
        }, 2000);
    }

    getActivityIcon(status) {
        switch (status) {
            case 'confirmed':
                return 'fas fa-check-circle';
            case 'cancelled':
                return 'fas fa-times-circle';
            default:
                return 'fas fa-bus';
        }
    }

    getStatusClass(status) {
        switch (status) {
            case 'pending':
                return 'pending';
            case 'confirmed':
                return 'confirmed';
            case 'completed':
                return 'completed';
            case 'cancelled':
                return 'cancelled';
            default:
                return 'booking';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 3000;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { background-color: #10b981; color: white; }
                .notification-error { background-color: #ef4444; color: white; }
                .notification-info { background-color: #3b82f6; color: white; }
                .notification-content { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
                .notification-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1; }
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCurrency(amount) {
        return `ETB ${amount.toLocaleString()}`;
    }

    // Logout function
    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userBookings');
        localStorage.removeItem('userTransactions');
        window.location.href = 'auth.html';
    }
}

// Initialize the profile manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Add some CSS for the profile page specific styles
const profileStyles = `
    .profile-header {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    @media (prefers-color-scheme: dark) {
        .profile-header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }
    }
    
    .tab-btn {
        position: relative;
    }
    
    .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--primary-color);
    }
    
    .booking-card {
        transition: all 0.3s ease;
    }
    
    .booking-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .wallet-card {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        position: relative;
        overflow: hidden;
    }
    
    .wallet-card::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;

// Add the styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = profileStyles;
document.head.appendChild(styleSheet);