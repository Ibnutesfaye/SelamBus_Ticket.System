// SelamBus - Admin Management System

class AdminManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.bookings = [];
        this.buses = [];
        this.users = [];
        this.routes = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboard();
        this.setupCharts();
        this.checkAdminAuth();
    }

    checkAdminAuth() {
        // Check if user is authenticated and has admin privileges
        const session = sessionStorage.getItem('selambus_session') || localStorage.getItem('selambus_session');
        if (!session) {
            // Redirect to login page
            window.location.href = 'auth.html';
            return;
        }
        
        try {
            const sessionData = JSON.parse(session);
            // In a real application, you would check if the user has admin role
            if (!sessionData.user || sessionData.user.email !== 'admin@selambus.com') {
                // Redirect to regular user dashboard
                window.location.href = 'profile.html';
            }
        } catch (error) {
            console.error('Session parsing error:', error);
            window.location.href = 'auth.html';
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Notifications
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Booking filters
        document.getElementById('bookingStatusFilter').addEventListener('change', () => {
            this.filterBookings();
        });
        document.getElementById('bookingDateFilter').addEventListener('change', () => {
            this.filterBookings();
        });
        document.getElementById('bookingDatePicker').addEventListener('change', () => {
            this.filterBookings();
        });

        // Bus filters
        document.getElementById('busCompanyFilter').addEventListener('change', () => {
            this.filterBuses();
        });
        document.getElementById('busTypeFilter').addEventListener('change', () => {
            this.filterBuses();
        });

        // User filters
        document.getElementById('userTypeFilter').addEventListener('change', () => {
            this.filterUsers();
        });
        document.getElementById('userStatusFilter').addEventListener('change', () => {
            this.filterUsers();
        });

        // Settings tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchSettingsTab(tab);
            });
        });

        // Export buttons
        document.getElementById('exportBookings').addEventListener('click', () => {
            this.exportData('bookings');
        });
        document.getElementById('exportBuses').addEventListener('click', () => {
            this.exportData('buses');
        });
        document.getElementById('exportUsers').addEventListener('click', () => {
            this.exportData('users');
        });

        // Add buttons
        document.getElementById('addBooking').addEventListener('click', () => {
            this.showAddBookingModal();
        });
        document.getElementById('addBus').addEventListener('click', () => {
            this.showAddBusModal();
        });
        document.getElementById('addUser').addEventListener('click', () => {
            this.showAddUserModal();
        });
    }

    switchSection(section) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update section title
        const sectionTitles = {
            'dashboard': 'Dashboard',
            'bookings': 'Bookings Management',
            'buses': 'Buses & Routes',
            'users': 'Users Management',
            'reports': 'Reports',
            'settings': 'Settings'
        };
        document.getElementById('sectionTitle').textContent = sectionTitles[section];
        document.getElementById('currentSection').textContent = sectionTitles[section];

        // Show/hide sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        this.loadSectionData(section);
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'bookings':
                this.loadBookings();
                break;
            case 'buses':
                this.loadBuses();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadSampleData() {
        // Generate sample bookings
        this.bookings = this.generateSampleBookings();
        
        // Generate sample buses
        this.buses = this.generateSampleBuses();
        
        // Generate sample users
        this.users = this.generateSampleUsers();
        
        // Generate sample routes
        this.routes = this.generateSampleRoutes();
    }

    generateSampleBookings() {
        const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        const routes = [
            { from: 'Addis Ababa', to: 'Adama' },
            { from: 'Addis Ababa', to: 'Hawassa' },
            { from: 'Addis Ababa', to: 'Bahir Dar' },
            { from: 'Addis Ababa', to: 'Gondar' },
            { from: 'Addis Ababa', to: 'Mekele' },
            { from: 'Addis Ababa', to: 'Dire Dawa' }
        ];
        
        const bookings = [];
        for (let i = 1; i <= 50; i++) {
            const route = routes[Math.floor(Math.random() * routes.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const seats = Math.floor(Math.random() * 4) + 1;
            const basePrice = 200 + Math.floor(Math.random() * 300);
            const totalAmount = seats * basePrice;
            
            bookings.push({
                id: `SLM-${String(i).padStart(6, '0')}`,
                customer: {
                    name: `Customer ${i}`,
                    email: `customer${i}@email.com`,
                    phone: `+2519${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
                },
                route: route,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                seats: seats,
                amount: totalAmount,
                status: status,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
            });
        }
        
        return bookings;
    }

    generateSampleBuses() {
        const companies = ['Selam Bus', 'Sky Bus', 'Golden Bus', 'Ethio Bus'];
        const types = ['Economy', 'Business', 'Luxury'];
        const amenities = ['WiFi', 'AC', 'Toilet', 'Charging Port', 'Snack'];
        
        const buses = [];
        for (let i = 1; i <= 20; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const busAmenities = amenities.filter(() => Math.random() > 0.5);
            
            buses.push({
                id: `BUS-${String(i).padStart(3, '0')}`,
                company: company,
                type: type,
                model: `${company} Model ${i}`,
                capacity: type === 'Economy' ? 45 : type === 'Business' ? 30 : 20,
                amenities: busAmenities,
                status: Math.random() > 0.2 ? 'active' : 'maintenance',
                route: {
                    from: 'Addis Ababa',
                    to: ['Adama', 'Hawassa', 'Bahir Dar', 'Gondar', 'Mekele', 'Dire Dawa'][Math.floor(Math.random() * 6)]
                },
                departureTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                price: type === 'Economy' ? 200 : type === 'Business' ? 350 : 500
            });
        }
        
        return buses;
    }

    generateSampleUsers() {
        const types = ['customer', 'admin'];
        const statuses = ['active', 'inactive'];
        
        const users = [];
        for (let i = 1; i <= 30; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            users.push({
                id: `USER-${String(i).padStart(4, '0')}`,
                name: `User ${i}`,
                email: `user${i}@email.com`,
                phone: `+2519${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
                type: type,
                status: status,
                joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                bookings: Math.floor(Math.random() * 10),
                avatar: `https://ui-avatars.com/api/?name=User+${i}&background=3b82f6&color=fff&size=64`
            });
        }
        
        return users;
    }

    generateSampleRoutes() {
        return [
            { from: 'Addis Ababa', to: 'Adama', distance: 100, duration: '2h 30m', price: 200 },
            { from: 'Addis Ababa', to: 'Hawassa', distance: 275, duration: '5h 30m', price: 350 },
            { from: 'Addis Ababa', to: 'Bahir Dar', distance: 565, duration: '10h 30m', price: 450 },
            { from: 'Addis Ababa', to: 'Gondar', distance: 730, duration: '13h 30m', price: 500 },
            { from: 'Addis Ababa', to: 'Mekele', distance: 780, duration: '14h 30m', price: 550 },
            { from: 'Addis Ababa', to: 'Dire Dawa', distance: 515, duration: '9h 30m', price: 400 }
        ];
    }

    updateDashboard() {
        // Update statistics
        const totalRevenue = this.bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + b.amount, 0);
        
        const totalBookings = this.bookings.length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const activeBuses = this.buses.filter(b => b.status === 'active').length;
        
        document.getElementById('totalRevenue').textContent = `ETB ${totalRevenue.toLocaleString()}`;
        document.getElementById('totalBookings').textContent = totalBookings.toLocaleString();
        document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
        document.getElementById('activeBuses').textContent = activeBuses.toLocaleString();
        
        // Update activities
        this.updateActivities();
        
        // Update top routes
        this.updateTopRoutes();
        
        // Update pending bookings count
        const pendingBookings = this.bookings.filter(b => b.status === 'pending').length;
        document.getElementById('pendingBookings').textContent = pendingBookings;
    }

    updateActivities() {
        const activitiesList = document.getElementById('activitiesList');
        const recentBookings = this.bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        activitiesList.innerHTML = recentBookings.map(booking => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <div class="activity-content">
                    <p>New booking: ${booking.id}</p>
                    <span>${booking.customer.name} - ${booking.route.from} to ${booking.route.to}</span>
                    <small>${this.formatDate(booking.createdAt)}</small>
                </div>
            </div>
        `).join('');
    }

    updateTopRoutes() {
        const topRoutesTable = document.getElementById('topRoutesTable');
        const routeStats = {};
        
        this.bookings.forEach(booking => {
            const routeKey = `${booking.route.from} - ${booking.route.to}`;
            if (!routeStats[routeKey]) {
                routeStats[routeKey] = { bookings: 0, revenue: 0 };
            }
            routeStats[routeKey].bookings++;
            routeStats[routeKey].revenue += booking.amount;
        });
        
        const sortedRoutes = Object.entries(routeStats)
            .sort((a, b) => b[1].bookings - a[1].bookings)
            .slice(0, 5);
        
        topRoutesTable.innerHTML = sortedRoutes.map(([route, stats]) => `
            <tr>
                <td>${route}</td>
                <td>${stats.bookings}</td>
                <td>ETB ${stats.revenue.toLocaleString()}</td>
                <td>${Math.floor(Math.random() * 40) + 60}%</td>
            </tr>
        `).join('');
    }

    setupCharts() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Generate sample revenue data
        const revenueData = this.generateRevenueData();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: revenueData.labels,
                datasets: [{
                    label: 'Revenue',
                    data: revenueData.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'ETB ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    generateRevenueData() {
        const labels = [];
        const data = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Generate random revenue data
            const dailyRevenue = Math.floor(Math.random() * 50000) + 20000;
            data.push(dailyRevenue);
        }
        
        return { labels, data };
    }

    loadBookings() {
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        const filteredBookings = this.filterBookingsData();
        
        bookingsTableBody.innerHTML = filteredBookings.map(booking => `
            <tr>
                <td><span class="booking-id">${booking.id}</span></td>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${booking.customer.name}</div>
                        <div class="customer-contact">${booking.customer.phone}</div>
                    </div>
                </td>
                <td>${booking.route.from} → ${booking.route.to}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.seats}</td>
                <td>ETB ${booking.amount.toLocaleString()}</td>
                <td><span class="status status-${booking.status}">${booking.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewBooking('${booking.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editBooking('${booking.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="cancelBooking('${booking.id}')" title="Cancel">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.updateBookingsPagination(filteredBookings.length);
    }

    loadBuses() {
        const busesGrid = document.getElementById('busesGrid');
        const filteredBuses = this.filterBusesData();
        
        busesGrid.innerHTML = filteredBuses.map(bus => `
            <div class="bus-card">
                <div class="bus-header">
                    <div class="bus-company">${bus.company}</div>
                    <div class="bus-status status-${bus.status}">${bus.status}</div>
                </div>
                <div class="bus-details">
                    <h4>${bus.model}</h4>
                    <p class="bus-type">${bus.type}</p>
                    <p class="bus-route">${bus.route.from} → ${bus.route.to}</p>
                    <p class="bus-time">Departure: ${bus.departureTime}</p>
                    <div class="bus-specs">
                        <span><i class="fas fa-users"></i> ${bus.capacity} seats</span>
                        <span><i class="fas fa-dollar-sign"></i> ETB ${bus.price}</span>
                    </div>
                    <div class="bus-amenities">
                        ${bus.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                    </div>
                </div>
                <div class="bus-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewBus('${bus.id}')">View</button>
                    <button class="btn btn-sm btn-primary" onclick="editBus('${bus.id}')">Edit</button>
                </div>
            </div>
        `).join('');
        
        this.updateBusesPagination(filteredBuses.length);
    }

    loadUsers() {
        const usersTableBody = document.getElementById('usersTableBody');
        const filteredUsers = this.filterUsersData();
        
        usersTableBody.innerHTML = filteredUsers.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="user-type type-${user.type}">${user.type}</span></td>
                <td><span class="status status-${user.status}">${user.status}</span></td>
                <td>${user.joinDate}</td>
                <td>${user.bookings}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewUser('${user.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editUser('${user.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="toggleUserStatus('${user.id}')" title="Toggle Status">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.updateUsersPagination(filteredUsers.length);
    }

    loadReports() {
        // Reports section is mostly static with buttons
        // Reports are generated on demand
    }

    loadSettings() {
        // Settings are loaded when the section is switched
        this.switchSettingsTab('general');
    }

    switchSettingsTab(tab) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');
    }

    filterBookings() {
        this.loadBookings();
    }

    filterBookingsData() {
        let filtered = [...this.bookings];
        
        const statusFilter = document.getElementById('bookingStatusFilter').value;
        const dateFilter = document.getElementById('bookingDateFilter').value;
        const datePicker = document.getElementById('bookingDatePicker').value;
        
        if (statusFilter) {
            filtered = filtered.filter(b => b.status === statusFilter);
        }
        
        if (dateFilter) {
            const today = new Date();
            filtered = filtered.filter(b => {
                const bookingDate = new Date(b.date);
                switch (dateFilter) {
                    case 'today':
                        return bookingDate.toDateString() === today.toDateString();
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return bookingDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                        return bookingDate >= monthAgo;
                }
            });
        }
        
        if (datePicker) {
            filtered = filtered.filter(b => b.date === datePicker);
        }
        
        return filtered;
    }

    filterBuses() {
        this.loadBuses();
    }

    filterBusesData() {
        let filtered = [...this.buses];
        
        const companyFilter = document.getElementById('busCompanyFilter').value;
        const typeFilter = document.getElementById('busTypeFilter').value;
        
        if (companyFilter) {
            filtered = filtered.filter(b => b.company.toLowerCase().includes(companyFilter));
        }
        
        if (typeFilter) {
            filtered = filtered.filter(b => b.type.toLowerCase() === typeFilter);
        }
        
        return filtered;
    }

    filterUsers() {
        this.loadUsers();
    }

    filterUsersData() {
        let filtered = [...this.users];
        
        const typeFilter = document.getElementById('userTypeFilter').value;
        const statusFilter = document.getElementById('userStatusFilter').value;
        
        if (typeFilter) {
            filtered = filtered.filter(u => u.type === typeFilter);
        }
        
        if (statusFilter) {
            filtered = filtered.filter(u => u.status === statusFilter);
        }
        
        return filtered;
    }

    updateBookingsPagination(totalItems) {
        const pagination = document.getElementById('bookingsPagination');
        pagination.innerHTML = this.generatePagination(totalItems, 10);
    }

    updateBusesPagination(totalItems) {
        const pagination = document.getElementById('busesPagination');
        pagination.innerHTML = this.generatePagination(totalItems, 8);
    }

    updateUsersPagination(totalItems) {
        const pagination = document.getElementById('usersPagination');
        pagination.innerHTML = this.generatePagination(totalItems, 10);
    }

    generatePagination(totalItems, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="page-btn ${i === 1 ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        return paginationHTML;
    }

    handleGlobalSearch(query) {
        if (!query.trim()) {
            this.loadSectionData(this.currentSection);
            return;
        }
        
        const searchResults = this.searchAcrossSections(query);
        this.displaySearchResults(searchResults);
    }

    searchAcrossSections(query) {
        const results = {
            bookings: [],
            buses: [],
            users: []
        };
        
        // Search bookings
        results.bookings = this.bookings.filter(b => 
            b.id.toLowerCase().includes(query.toLowerCase()) ||
            b.customer.name.toLowerCase().includes(query.toLowerCase()) ||
            b.customer.email.toLowerCase().includes(query.toLowerCase()) ||
            b.customer.phone.includes(query) ||
            b.route.from.toLowerCase().includes(query.toLowerCase()) ||
            b.route.to.toLowerCase().includes(query.toLowerCase())
        );
        
        // Search buses
        results.buses = this.buses.filter(b =>
            b.id.toLowerCase().includes(query.toLowerCase()) ||
            b.company.toLowerCase().includes(query.toLowerCase()) ||
            b.model.toLowerCase().includes(query.toLowerCase()) ||
            b.route.from.toLowerCase().includes(query.toLowerCase()) ||
            b.route.to.toLowerCase().includes(query.toLowerCase())
        );
        
        // Search users
        results.users = this.users.filter(u =>
            u.id.toLowerCase().includes(query.toLowerCase()) ||
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.phone.includes(query)
        );
        
        return results;
    }

    displaySearchResults(results) {
        // This is a simplified implementation
        // In a real application, you would show a dedicated search results page
        console.log('Search results:', results);
    }

    showNotifications() {
        // Show notifications modal or dropdown
        console.log('Showing notifications');
    }

    // Modal functions
    showBookingModal(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        const modalBody = document.getElementById('bookingModalBody');
        modalBody.innerHTML = `
            <div class="booking-details">
                <div class="detail-row">
                    <strong>Booking ID:</strong>
                    <span>${booking.id}</span>
                </div>
                <div class="detail-row">
                    <strong>Customer:</strong>
                    <span>${booking.customer.name}</span>
                </div>
                <div class="detail-row">
                    <strong>Email:</strong>
                    <span>${booking.customer.email}</span>
                </div>
                <div class="detail-row">
                    <strong>Phone:</strong>
                    <span>${booking.customer.phone}</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>${booking.route.from} → ${booking.route.to}</span>
                </div>
                <div class="detail-row">
                    <strong>Date & Time:</strong>
                    <span>${booking.date} at ${booking.time}</span>
                </div>
                <div class="detail-row">
                    <strong>Seats:</strong>
                    <span>${booking.seats}</span>
                </div>
                <div class="detail-row">
                    <strong>Amount:</strong>
                    <span>ETB ${booking.amount.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status status-${booking.status}">${booking.status}</span>
                </div>
            </div>
        `;
        
        document.getElementById('bookingModal').style.display = 'flex';
    }

    showBusModal(busId) {
        const bus = this.buses.find(b => b.id === busId);
        if (!bus) return;
        
        const modalBody = document.getElementById('busModalBody');
        modalBody.innerHTML = `
            <div class="bus-details">
                <div class="detail-row">
                    <strong>Bus ID:</strong>
                    <span>${bus.id}</span>
                </div>
                <div class="detail-row">
                    <strong>Company:</strong>
                    <span>${bus.company}</span>
                </div>
                <div class="detail-row">
                    <strong>Model:</strong>
                    <span>${bus.model}</span>
                </div>
                <div class="detail-row">
                    <strong>Type:</strong>
                    <span>${bus.type}</span>
                </div>
                <div class="detail-row">
                    <strong>Capacity:</strong>
                    <span>${bus.capacity} seats</span>
                </div>
                <div class="detail-row">
                    <strong>Route:</strong>
                    <span>${bus.route.from} → ${bus.route.to}</span>
                </div>
                <div class="detail-row">
                    <strong>Departure Time:</strong>
                    <span>${bus.departureTime}</span>
                </div>
                <div class="detail-row">
                    <strong>Price:</strong>
                    <span>ETB ${bus.price}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status status-${bus.status}">${bus.status}</span>
                </div>
                <div class="detail-row">
                    <strong>Amenities:</strong>
                    <div class="amenities-list">
                        ${bus.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('busModal').style.display = 'flex';
    }

    showUserModal(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const modalBody = document.getElementById('userModalBody');
        modalBody.innerHTML = `
            <div class="user-details">
                <div class="detail-row">
                    <strong>User ID:</strong>
                    <span>${user.id}</span>
                </div>
                <div class="detail-row">
                    <strong>Name:</strong>
                    <span>${user.name}</span>
                </div>
                <div class="detail-row">
                    <strong>Email:</strong>
                    <span>${user.email}</span>
                </div>
                <div class="detail-row">
                    <strong>Phone:</strong>
                    <span>${user.phone}</span>
                </div>
                <div class="detail-row">
                    <strong>Type:</strong>
                    <span class="user-type type-${user.type}">${user.type}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status status-${user.status}">${user.status}</span>
                </div>
                <div class="detail-row">
                    <strong>Join Date:</strong>
                    <span>${user.joinDate}</span>
                </div>
                <div class="detail-row">
                    <strong>Total Bookings:</strong>
                    <span>${user.bookings}</span>
                </div>
            </div>
        `;
        
        document.getElementById('userModal').style.display = 'flex';
    }

    exportData(type) {
        let data, filename;
        
        switch (type) {
            case 'bookings':
                data = this.bookings;
                filename = 'bookings_export.csv';
                break;
            case 'buses':
                data = this.buses;
                filename = 'buses_export.csv';
                break;
            case 'users':
                data = this.users;
                filename = 'users_export.csv';
                break;
        }
        
        const csv = this.convertToCSV(data);
        this.downloadFile(csv, filename, 'text/csv');
    }

    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'object' ? JSON.stringify(value) : value;
                }).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    logout() {
        sessionStorage.removeItem('selambus_session');
        localStorage.removeItem('selambus_session');
        window.location.href = 'auth.html';
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global functions for modal actions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function viewBooking(bookingId) {
    adminManager.showBookingModal(bookingId);
}

function editBooking(bookingId) {
    console.log('Edit booking:', bookingId);
    // Implement edit functionality
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        console.log('Cancel booking:', bookingId);
        // Implement cancel functionality
    }
}

function viewBus(busId) {
    adminManager.showBusModal(busId);
}

function editBus(busId) {
    console.log('Edit bus:', busId);
    // Implement edit functionality
}

function viewUser(userId) {
    adminManager.showUserModal(userId);
}

function editUser(userId) {
    console.log('Edit user:', userId);
    // Implement edit functionality
}

function toggleUserStatus(userId) {
    console.log('Toggle user status:', userId);
    // Implement status toggle functionality
}

function generateReport(type) {
    console.log('Generate report:', type);
    // Implement report generation
}

function generateCustomReport() {
    const reportType = document.getElementById('customReportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    console.log('Generate custom report:', reportType, startDate, endDate);
    // Implement custom report generation
}

function saveSettings() {
    console.log('Save settings');
    // Implement settings save functionality
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        console.log('Reset settings');
        // Implement settings reset functionality
    }
}

function changePassword() {
    console.log('Change password');
    // Implement password change functionality
}

// Initialize admin manager
let adminManager;

document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
    window.adminManager = adminManager;
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});