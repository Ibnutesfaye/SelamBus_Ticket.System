// SelamBus - Search Results JavaScript

class SearchResultsManager {
    constructor() {
        this.busData = [];
        this.filteredData = [];
        this.currentFilters = {
            time: [],
            busType: [],
            company: [],
            priceMax: 500,
            amenities: []
        };
        this.currentSort = 'departure';
        this.itemsPerPage = 5;
        this.currentPage = 1;
        
        this.initializeSearchResults();
        this.setupEventListeners();
    }
    
    initializeSearchResults() {
        this.generateSampleData();
        this.filteredData = [...this.busData];
        this.renderResults();
        this.updateFilterCounts();
    }
    
    generateSampleData() {
        // Generate sample bus data
        const companies = [
            { name: 'Selam Bus', logo: 'SB', color: '2563eb' },
            { name: 'Golden Bus', logo: 'GB', color: 'f59e0b' },
            { name: 'Sky Bus', logo: 'SK', color: '10b981' },
            { name: 'Luxury Bus Lines', logo: 'LB', color: '8b5cf6' },
            { name: 'Ethio Bus', logo: 'EB', color: 'f59e0b' },
            { name: 'Kibru Bus', logo: 'KB', color: 'ef4444' }
        ];
        
        const busTypes = ['Higer Bus', 'Business Class', 'Standard Coach', 'Luxury Sleeper', 'Economy Coach'];
        const amenities = [
            { icon: 'fas fa-wifi', name: 'WiFi' },
            { icon: 'fas fa-snowflake', name: 'AC' },
            { icon: 'fas fa-restroom', name: 'Toilet' },
            { icon: 'fas fa-plug', name: 'Charging' },
            { icon: 'fas fa-tv', name: 'TV' },
            { icon: 'fas fa-coffee', name: 'Snack' },
            { icon: 'fas fa-bed', name: 'Sleeper' },
            { icon: 'fas fa-utensils', name: 'Meal' }
        ];
        
        const departureTimes = [
            { time: '06:00', period: 'morning' },
            { time: '08:00', period: 'morning' },
            { time: '10:30', period: 'morning' },
            { time: '12:00', period: 'afternoon' },
            { time: '14:00', period: 'afternoon' },
            { time: '16:30', period: 'afternoon' },
            { time: '18:00', period: 'evening' },
            { time: '20:00', period: 'evening' },
            { time: '22:00', period: 'night' },
            { time: '23:30', period: 'night' }
        ];
        
        // Generate 50 bus schedules
        for (let i = 0; i < 50; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            const departure = departureTimes[Math.floor(Math.random() * departureTimes.length)];
            const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
            const rating = (3 + Math.random() * 2).toFixed(1);
            const price = Math.floor(120 + Math.random() * 200);
            const seatsAvailable = Math.floor(10 + Math.random() * 30);
            const duration = 3.5 + Math.random() * 2;
            
            // Random amenities (3-6 amenities)
            const busAmenities = [];
            const numAmenities = 3 + Math.floor(Math.random() * 4);
            const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
            for (let j = 0; j < numAmenities; j++) {
                busAmenities.push(shuffledAmenities[j]);
            }
            
            this.busData.push({
                id: `bus-${i + 1}`,
                company: company.name,
                logo: company.logo,
                color: company.color,
                busType: busType,
                departureTime: departure.time,
                departurePeriod: departure.period,
                arrivalTime: this.calculateArrivalTime(departure.time, duration),
                duration: duration,
                rating: rating,
                price: price,
                seatsAvailable: seatsAvailable,
                amenities: busAmenities,
                departureLocation: 'Addis Ababa',
                departureTerminal: 'Autobus Tera',
                arrivalLocation: 'Hawassa',
                arrivalTerminal: 'Main Terminal',
                distance: 275
            });
        }
    }
    
    calculateArrivalTime(departureTime, duration) {
        const [hours, minutes] = departureTime.split(':').map(Number);
        const departureMinutes = hours * 60 + minutes;
        const arrivalMinutes = departureMinutes + (duration * 60);
        
        const arrivalHours = Math.floor(arrivalMinutes / 60) % 24;
        const arrivalMins = Math.floor(arrivalMinutes % 60);
        
        return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')}`;
    }
    
    setupEventListeners() {
        // Filter event listeners
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });
        
        // Price range slider
        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.currentFilters.priceMax = parseInt(e.target.value);
                document.getElementById('maxPrice').textContent = `ETB ${e.target.value}`;
                this.applyFilters();
            });
        }
        
        // Sort dropdown
        const sortDropdown = document.getElementById('sortBy');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortResults();
            });
        }
        
        // Modify search
        const modifySearchBtn = document.querySelector('.btn-modify-search');
        if (modifySearchBtn) {
            modifySearchBtn.addEventListener('click', () => this.showModifySearch());
        }
        
        // Update search button
        const updateSearchBtn = document.querySelector('.btn-search');
        if (updateSearchBtn) {
            updateSearchBtn.addEventListener('click', () => this.updateSearch());
        }
        
        // Cancel modify search
        const cancelBtn = document.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModifySearch());
        }
        
        // Load more button
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreResults());
        }
        
        // Clear filters button
        const clearFiltersBtn = document.querySelector('.btn-clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }
    }
    
    applyFilters() {
        // Reset filters
        this.currentFilters = {
            time: [],
            busType: [],
            company: [],
            priceMax: this.currentFilters.priceMax,
            amenities: []
        };
        
        // Get checked filters
        const checkedFilters = document.querySelectorAll('.filter-checkbox input:checked');
        checkedFilters.forEach(checkbox => {
            const id = checkbox.id;
            
            // Time filters
            if (['morning', 'afternoon', 'evening', 'night'].includes(id)) {
                this.currentFilters.time.push(id);
            }
            
            // Bus type filters
            if (['economy', 'business', 'luxury'].includes(id)) {
                this.currentFilters.busType.push(id);
            }
            
            // Company filters
            if (id.includes('-bus')) {
                this.currentFilters.company.push(id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
            }
            
            // Amenities filters
            if (['wifi', 'ac', 'toilet', 'charging', 'snack'].includes(id)) {
                this.currentFilters.amenities.push(id);
            }
        });
        
        // Filter data
        this.filteredData = this.busData.filter(bus => {
            // Time filter
            if (this.currentFilters.time.length > 0 && !this.currentFilters.time.includes(bus.departurePeriod)) {
                return false;
            }
            
            // Price filter
            if (bus.price > this.currentFilters.priceMax) {
                return false;
            }
            
            // Company filter
            if (this.currentFilters.company.length > 0) {
                const companyName = bus.company.toLowerCase().replace(' ', '-');
                if (!this.currentFilters.company.some(company => companyName.includes(company.toLowerCase().replace(' ', '-')))) {
                    return false;
                }
            }
            
            // Bus type filter (simplified)
            if (this.currentFilters.busType.length > 0) {
                const busTypeLower = bus.busType.toLowerCase();
                if (!this.currentFilters.busType.some(type => {
                    if (type === 'economy') return busTypeLower.includes('standard') || busTypeLower.includes('economy');
                    if (type === 'business') return busTypeLower.includes('business');
                    if (type === 'luxury') return busTypeLower.includes('luxury') || busTypeLower.includes('sleeper');
                    return false;
                })) {
                    return false;
                }
            }
            
            // Amenities filter
            if (this.currentFilters.amenities.length > 0) {
                const busAmenities = bus.amenities.map(a => a.name.toLowerCase());
                if (!this.currentFilters.amenities.every(amenity => {
                    if (amenity === 'ac') return busAmenities.includes('ac') || busAmenities.some(a => a.includes('air'));
                    if (amenity === 'charging') return busAmenities.some(a => a.includes('charging'));
                    return busAmenities.includes(amenity);
                })) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderResults();
        this.updateResultsInfo();
    }
    
    sortResults() {
        const sortValue = this.currentSort;
        
        this.filteredData.sort((a, b) => {
            switch (sortValue) {
                case 'departure':
                    return a.departureTime.localeCompare(b.departureTime);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                case 'duration':
                    return a.duration - b.duration;
                default:
                    return 0;
            }
        });
        
        this.renderResults();
    }
    
    renderResults() {
        const resultsContainer = document.getElementById('busResults');
        if (!resultsContainer) return;
        
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const resultsToShow = this.filteredData.slice(startIndex, endIndex);
        
        resultsContainer.innerHTML = '';
        
        resultsToShow.forEach(bus => {
            const busCard = this.createBusCard(bus);
            resultsContainer.appendChild(busCard);
        });
        
        this.updateLoadMoreButton();
    }
    
    createBusCard(bus) {
        const card = document.createElement('div');
        card.className = 'bus-card';
        card.setAttribute('data-departure', bus.departureTime);
        card.setAttribute('data-price', bus.price);
        card.setAttribute('data-rating', bus.rating);
        card.setAttribute('data-duration', bus.duration);
        
        card.innerHTML = `
            <div class="bus-header">
                <div class="bus-company">
                    <img src="https://via.placeholder.com/50x50/${bus.color}/ffffff?text=${bus.logo}" alt="${bus.company}" class="company-logo">
                    <div class="company-info">
                        <h4>${bus.company}</h4>
                        <span class="bus-type">${bus.busType}</span>
                    </div>
                </div>
                <div class="bus-rating">
                    <div class="rating-stars">
                        ${this.generateStarRating(bus.rating)}
                    </div>
                    <span class="rating-text">${bus.rating} (${Math.floor(Math.random() * 100) + 20})</span>
                </div>
            </div>
            
            <div class="bus-details">
                <div class="route-info">
                    <div class="departure">
                        <div class="time">${bus.departureTime}</div>
                        <div class="location">${bus.departureLocation}</div>
                        <div class="terminal">${bus.departureTerminal}</div>
                    </div>
                    
                    <div class="journey-info">
                        <div class="duration">${this.formatDuration(bus.duration)}</div>
                        <div class="route-line"></div>
                        <div class="distance">${bus.distance} km</div>
                    </div>
                    
                    <div class="arrival">
                        <div class="time">${bus.arrivalTime}</div>
                        <div class="location">${bus.arrivalLocation}</div>
                        <div class="terminal">${bus.arrivalTerminal}</div>
                    </div>
                </div>
                
                <div class="bus-features">
                    ${bus.amenities.map(amenity => `
                        <div class="feature">
                            <i class="${amenity.icon}"></i>
                            <span>${amenity.name}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="bus-footer">
                    <div class="price-info">
                        <div class="price">ETB ${bus.price}</div>
                        <div class="seats-available">${bus.seatsAvailable} seats available</div>
                    </div>
                    <button class="btn-select-seats" onclick="selectSeats('${bus.id}')">
                        Select Seats
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    formatDuration(duration) {
        const hours = Math.floor(duration);
        const minutes = Math.floor((duration - hours) * 60);
        return `${hours}h ${minutes}m`;
    }
    
    updateResultsInfo() {
        const resultsInfo = document.querySelector('.results-info h3');
        if (resultsInfo) {
            resultsInfo.textContent = `${this.filteredData.length} Available Buses`;
        }
    }
    
    updateFilterCounts() {
        // This would update the count numbers next to each filter option
        // For now, we'll keep the static counts from the HTML
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (!loadMoreBtn) return;
        
        const hasMoreResults = this.currentPage * this.itemsPerPage < this.filteredData.length;
        
        if (!hasMoreResults) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }
    
    loadMoreResults() {
        this.currentPage++;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = this.currentPage * this.itemsPerPage;
        const additionalResults = this.filteredData.slice(startIndex, endIndex);
        
        const resultsContainer = document.getElementById('busResults');
        if (!resultsContainer) return;
        
        additionalResults.forEach(bus => {
            const busCard = this.createBusCard(bus);
            resultsContainer.appendChild(busCard);
        });
        
        this.updateLoadMoreButton();
    }
    
    clearAllFilters() {
        // Reset all checkboxes
        document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price slider
        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.value = 500;
            document.getElementById('maxPrice').textContent = 'ETB 500';
        }
        
        // Reset filters
        this.currentFilters = {
            time: [],
            busType: [],
            company: [],
            priceMax: 500,
            amenities: []
        };
        
        // Reset filtered data
        this.filteredData = [...this.busData];
        this.currentPage = 1;
        this.renderResults();
        this.updateResultsInfo();
    }
    
    showModifySearch() {
        const modifyForm = document.getElementById('modifySearchForm');
        if (modifyForm) {
            modifyForm.style.display = 'block';
            modifyForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    hideModifySearch() {
        const modifyForm = document.getElementById('modifySearchForm');
        if (modifyForm) {
            modifyForm.style.display = 'none';
        }
    }
    
    updateSearch() {
        // Get form values
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const departureDate = document.getElementById('departureDateInput').value;
        const passengers = document.getElementById('passengers').value;
        
        // Validate form
        if (!fromCity || !toCity || !departureDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (fromCity === toCity) {
            this.showNotification('From and To cities cannot be the same', 'error');
            return;
        }
        
        // Update search summary
        document.querySelector('.route-info h2').textContent = `${fromCity} → ${toCity}`;
        document.getElementById('departureDate').textContent = new Date(departureDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('passengerCount').textContent = passengers;
        
        // Hide modify form
        this.hideModifySearch();
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate search update
        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification('Search updated successfully', 'success');
            
            // Re-apply filters with new search parameters
            this.applyFilters();
        }, 1500);
    }
    
    showLoadingState() {
        const resultsContainer = document.getElementById('busResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Updating search results...</p>
                </div>
            `;
        }
    }
    
    hideLoadingState() {
        this.renderResults();
    }
    
    showNotification(message, type = 'info') {
        // Use the same notification system as the main script
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}

// Global functions for HTML onclick handlers
function showModifySearch() {
    if (window.searchResultsManager) {
        window.searchResultsManager.showModifySearch();
    }
}

function hideModifySearch() {
    if (window.searchResultsManager) {
        window.searchResultsManager.hideModifySearch();
    }
}

function updateSearch() {
    if (window.searchResultsManager) {
        window.searchResultsManager.updateSearch();
    }
}

function sortResults() {
    if (window.searchResultsManager) {
        window.searchResultsManager.sortResults();
    }
}

function loadMoreResults() {
    if (window.searchResultsManager) {
        window.searchResultsManager.loadMoreResults();
    }
}

function clearAllFilters() {
    if (window.searchResultsManager) {
        window.searchResultsManager.clearAllFilters();
    }
}

function selectSeats(busId) {
    // Store selected bus data in session storage
    if (window.searchResultsManager) {
        const selectedBus = window.searchResultsManager.filteredData.find(bus => bus.id === busId);
        if (selectedBus) {
            sessionStorage.setItem('selectedBus', JSON.stringify(selectedBus));
        }
    }
    
    // Navigate to seat selection page
    window.location.href = 'seat-selection.html';
}

// Initialize search results manager
let searchResultsManager;

document.addEventListener('DOMContentLoaded', function() {
    searchResultsManager = new SearchResultsManager();
    window.searchResultsManager = searchResultsManager;
});

// Add CSS for search results page
const searchResultsStyles = `
    .search-results-section {
        padding: 2rem 0;
        background: #f8fafc;
        min-height: 80vh;
    }
    
    .search-summary {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .route-info h2 {
        color: #1f2937;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }
    
    .route-info p {
        color: #6b7280;
        margin: 0;
    }
    
    .btn-modify-search {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .btn-modify-search:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }
    
    .modify-search-form {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .search-form .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .search-form .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .btn-search {
        background: #10b981;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .btn-search:hover {
        background: #059669;
        transform: translateY(-2px);
    }
    
    .btn-cancel {
        background: #6b7280;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-cancel:hover {
        background: #4b5563;
    }
    
    .results-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
    }
    
    .filters-sidebar {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        height: fit-content;
        position: sticky;
        top: 2rem;
    }
    
    .filter-section h3 {
        color: #1f2937;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
    }
    
    .filter-group {
        margin-bottom: 2rem;
    }
    
    .filter-group h4 {
        color: #374151;
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    
    .filter-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .filter-checkbox {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.9rem;
        color: #4b5563;
        transition: color 0.3s ease;
    }
    
    .filter-checkbox:hover {
        color: #1f2937;
    }
    
    .filter-checkbox input {
        display: none;
    }
    
    .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid #d1d5db;
        border-radius: 3px;
        margin-right: 0.75rem;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .filter-checkbox input:checked + .checkmark {
        background: #3b82f6;
        border-color: #3b82f6;
    }
    
    .filter-checkbox input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .count {
        margin-left: auto;
        color: #9ca3af;
        font-size: 0.8rem;
    }
    
    .price-range {
        margin-top: 1rem;
    }
    
    .price-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #e5e7eb;
        outline: none;
        -webkit-appearance: none;
    }
    
    .price-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
    }
    
    .price-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: none;
    }
    
    .price-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: #6b7280;
    }
    
    .btn-clear-filters {
        background: transparent;
        color: #ef4444;
        border: 1px solid #ef4444;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 1rem;
    }
    
    .btn-clear-filters:hover {
        background: #ef4444;
        color: white;
    }
    
    .results-content {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem;
        border-bottom: 1px solid #e5e7eb;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .results-info h3 {
        color: #1f2937;
        margin-bottom: 0.25rem;
        font-size: 1.25rem;
    }
    
    .results-info p {
        color: #6b7280;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .sort-options {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .sort-options label {
        color: #4b5563;
        font-size: 0.9rem;
    }
    
    .sort-options select {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background: white;
        color: #374151;
        cursor: pointer;
    }
    
    .bus-results {
        padding: 2rem;
    }
    
    .bus-card {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .bus-card:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
    
    .bus-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .bus-company {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .company-logo {
        width: 50px;
        height: 50px;
        border-radius: 0.5rem;
        object-fit: cover;
    }
    
    .company-info h4 {
        color: #1f2937;
        margin-bottom: 0.25rem;
        font-size: 1.1rem;
    }
    
    .bus-type {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .bus-rating {
        text-align: right;
    }
    
    .rating-stars {
        color: #f59e0b;
        margin-bottom: 0.25rem;
    }
    
    .rating-text {
        color: #6b7280;
        font-size: 0.8rem;
    }
    
    .bus-details {
        display: grid;
        gap: 1.5rem;
    }
    
    .route-info {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        align-items: center;
    }
    
    .departure, .arrival {
        text-align: center;
    }
    
    .time {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .location {
        font-size: 1.1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.25rem;
    }
    
    .terminal {
        font-size: 0.8rem;
        color: #6b7280;
    }
    
    .journey-info {
        text-align: center;
        padding: 0 1rem;
    }
    
    .duration {
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
    }
    
    .route-line {
        height: 2px;
        background: #d1d5db;
        margin: 0.5rem 0;
        position: relative;
    }
    
    .route-line::after {
        content: '';
        position: absolute;
        right: -5px;
        top: -3px;
        width: 0;
        height: 0;
        border-left: 8px solid #d1d5db;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
    }
    
    .distance {
        font-size: 0.8rem;
        color: #6b7280;
    }
    
    .bus-features {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }
    
    .feature {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .feature i {
        color: #10b981;
    }
    
    .bus-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #10b981;
        margin-bottom: 0.25rem;
    }
    
    .seats-available {
        color: #6b7280;
        font-size: 0.8rem;
    }
    
    .btn-select-seats {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-select-seats:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }
    
    .load-more-container {
        text-align: center;
        padding: 2rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .btn-load-more {
        background: transparent;
        color: #3b82f6;
        border: 2px solid #3b82f6;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .btn-load-more:hover {
        background: #3b82f6;
        color: white;
    }
    
    .loading-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
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
    
    @media (max-width: 768px) {
        .results-layout {
            grid-template-columns: 1fr;
        }
        
        .filters-sidebar {
            position: static;
            margin-bottom: 2rem;
        }
        
        .search-summary {
            flex-direction: column;
            text-align: center;
        }
        
        .results-header {
            flex-direction: column;
            text-align: center;
        }
        
        .route-info {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .journey-info {
            order: -1;
            padding: 1rem 0;
        }
        
        .bus-header, .bus-footer {
            flex-direction: column;
            text-align: center;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = searchResultsStyles;
document.head.appendChild(styleSheet);