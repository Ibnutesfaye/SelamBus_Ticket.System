// SelamBus - Main JavaScript

// Ethiopian cities data
const ethiopianCities = [
    'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Gondar', 
    'Mekele', 'Dire Dawa', 'Jimma', 'Dessie', 'Shashemene',
    'Arba Minch', 'Sodo', 'Jijiga', 'Harar', 'Dilla',
    'Wolaita Sodo', 'Hosaena', 'Asella', 'Ambo', 'Butajira'
];

// DOM Elements
const fromCityInput = document.getElementById('fromCity');
const toCityInput = document.getElementById('toCity');
const fromSuggestions = document.getElementById('fromSuggestions');
const toSuggestions = document.getElementById('toSuggestions');
const departureDateInput = document.getElementById('departureDate');
const returnDateInput = document.getElementById('returnDate');
const searchForm = document.getElementById('busSearchForm');
const roundTripToggle = document.getElementById('roundTripToggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// I18N definitions
const i18n = {
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.help': 'Help',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'hero.title': 'Book Your Bus Tickets Online',
        'hero.subtitle': 'Fast, Secure & Convenient',
        'hero.description': 'Travel across Ethiopia with ease. Book your bus tickets in minutes and enjoy a comfortable journey with trusted bus operators.',
        'search.from.label': 'From',
        'search.to.label': 'To',
        'search.departure.label': 'Departure Date',
        'search.return.label': 'Return Date (Optional)',
        'search.from.placeholder': 'Departure city',
        'search.to.placeholder': 'Destination city',
        'search.search_button': 'Search Buses',
        'search.round_trip_button': 'Round Trip',
        'search.one_way_button': 'One Way',
        'routes.section_title': 'Popular Routes',
        'routes.book_now': 'Book Now',
        'how.section_title': 'How It Works',
        'how.step1.title': '1. Search',
        'how.step1.desc': 'Enter your departure and destination cities, select your travel dates',
        'how.step2.title': '2. Select',
        'how.step2.desc': 'Choose your preferred bus, seat, and enter passenger details',
        'how.step3.title': '3. Pay',
        'how.step3.desc': 'Pay securely using TeleBirr, CBE Birr, or bank transfer',
    },
    am: {
        'nav.home': 'መነሻ',
        'nav.about': 'ስለ እኛ',
        'nav.contact': 'ያግኙን',
        'nav.help': 'እርዳታ',
        'nav.login': 'መግባት',
        'nav.register': 'መመዝገብ',
        'hero.title': 'የአውቶቡስ ትኬት በመስመር ላይ ይዘዙ',
        'hero.subtitle': 'ፈጣን፣ የሚታመን እና ምቹ',
        'hero.description': 'በኢትዮጵያ ሁሉ በቀላሉ ይጒዞ። የአውቶቡስ ትኬቶችን በጥቂት ደቂቃዎች ይዘዙ እና ከተመረጡ አቅራቢዎች ጋር ምቹ ጉዞ ይውሰዱ።',
        'search.from.label': 'ከት',
        'search.to.label': 'ወደ',
        'search.departure.label': 'መነሻ ቀን',
        'search.return.label': 'መመለሻ ቀን (አማራጭ)',
        'search.from.placeholder': 'የመነሻ ከተማ',
        'search.to.placeholder': 'መድረሻ ከተማ',
        'search.search_button': 'አውቶቡሶችን ፈልግ',
        'search.round_trip_button': 'መመለሻ ጉዞ',
        'search.one_way_button': 'ነጠላ ጉዞ',
        'routes.section_title': 'ታዋቂ መንገዶች',
        'routes.book_now': 'አሁን ይዘዙ',
        'how.section_title': 'እንዴት ይሰራ',
        'how.step1.title': '1. ፈልግ',
        'how.step1.desc': 'የመነሻና መድረሻ ከተማዎችን እና ቀኖችን ያስገቡ',
        'how.step2.title': '2. መምረጥ',
        'how.step2.desc': 'የተመረጠ አውቶቡስን እና መቀመጫን ይምረጡ',
        'how.step3.title': '3. ክፍያ',
        'how.step3.desc': 'በቴሌብር፣ ሲቢ ብር ወይም ባንክ ስርጭት ይክፈሉ',
    }
};

const LANG_STORAGE_KEY = 'selambus_language';
let currentLanguage = localStorage.getItem(LANG_STORAGE_KEY) || 'en';

function applyLanguage(lang) {
    currentLanguage = i18n[lang] ? lang : 'en';
    localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
    const selector = document.getElementById('language');
    if (selector) selector.value = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = i18n[currentLanguage][key];
        if (typeof value === 'string') el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = i18n[currentLanguage][key];
        if (typeof value === 'string') el.setAttribute('placeholder', value);
    });
    const roundLabel = document.querySelector('.round-label');
    if (roundLabel) {
        const isVisible = returnDateInput && returnDateInput.style.display !== 'none';
        const desiredKey = isVisible ? 'search.one_way_button' : 'search.round_trip_button';
        roundLabel.textContent = i18n[currentLanguage][desiredKey];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDateInputs();
    setupAutocomplete();
    setupEventListeners();
    setupMobileMenu();
    animateOnScroll();
});

// Initialize date inputs
function initializeDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set minimum date to today
    departureDateInput.min = formatDateForInput(today);
    returnDateInput.min = formatDateForInput(tomorrow);
    
    // Set default dates
    departureDateInput.value = formatDateForInput(today);
    returnDateInput.value = formatDateForInput(tomorrow);
}

// Format date for input field
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Setup autocomplete functionality
function setupAutocomplete() {
    setupCityAutocomplete(fromCityInput, fromSuggestions);
    setupCityAutocomplete(toCityInput, toSuggestions);
}

// Setup city autocomplete for input field
function setupCityAutocomplete(input, suggestionsContainer) {
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        if (value.length < 1) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const filteredCities = ethiopianCities.filter(city => 
            city.toLowerCase().includes(value)
        );
        
        displaySuggestions(filteredCities, suggestionsContainer, input);
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Display city suggestions
function displaySuggestions(cities, container, input) {
    container.innerHTML = '';
    
    if (cities.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    cities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = city;
        
        suggestionItem.addEventListener('click', function() {
            input.value = city;
            container.style.display = 'none';
            
            // Auto-focus next field
            if (input === fromCityInput) {
                toCityInput.focus();
            } else if (input === toCityInput) {
                departureDateInput.focus();
            }
        });
        
        container.appendChild(suggestionItem);
    });
    
    container.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    // Search form submission
    searchForm.addEventListener('submit', handleSearchSubmit);
    
    // Round trip toggle
    roundTripToggle.addEventListener('click', toggleRoundTrip);
    
    // Date validation
    departureDateInput.addEventListener('change', validateDates);
    returnDateInput.addEventListener('change', validateDates);
    
    // Route card buttons
    document.querySelectorAll('.btn-book-route').forEach(button => {
        button.addEventListener('click', function() {
            const routeInfo = this.parentElement.querySelector('.route-info h3').textContent;
            const [from, to] = routeInfo.split(' → ');
            
            fromCityInput.value = from;
            toCityInput.value = to;
            
            // Scroll to search form
            searchForm.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Language selector
    document.getElementById('language').addEventListener('change', function() {
        applyLanguage(this.value);
    });

    // Apply saved language on load
    applyLanguage(currentLanguage);

    // Auth navigation
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'auth.html?form=login';
        });
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'auth.html?form=register';
        });
    }

    // Smooth scroll for navbar anchors
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    });

    // FAQ toggles
    document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            item.classList.toggle('open');
            if (answer) {
                if (item.classList.contains('open')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            }
        });
    });

    // Contact form submission simulation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            if (!name || !email || !phone || !message) {
                showNotification('Please fill in all contact form fields', 'error');
                return;
            }
            showNotification('Thanks! Your message has been sent.', 'success');
            contactForm.reset();
        });
    }
}

// Handle search form submission
function handleSearchSubmit(e) {
    e.preventDefault();
    
    const formData = {
        from: fromCityInput.value,
        to: toCityInput.value,
        departureDate: departureDateInput.value,
        returnDate: returnDateInput.value,
        isRoundTrip: returnDateInput.style.display !== 'none'
    };
    
    // Validate form
    if (!validateSearchForm(formData)) {
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        // Store search data in sessionStorage
        sessionStorage.setItem('searchData', JSON.stringify(formData));
        
        // Redirect to search results page
        window.location.href = 'search-results.html';
    }, 1000);
}

// Validate search form
function validateSearchForm(data) {
    if (!data.from || !data.to) {
        showNotification('Please select both departure and destination cities', 'error');
        return false;
    }
    
    if (data.from === data.to) {
        showNotification('Departure and destination cities cannot be the same', 'error');
        return false;
    }
    
    if (!data.departureDate) {
        showNotification('Please select a departure date', 'error');
        return false;
    }
    
    const departureDate = new Date(data.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate < today) {
        showNotification('Departure date cannot be in the past', 'error');
        return false;
    }
    
    if (data.isRoundTrip && !data.returnDate) {
        showNotification('Please select a return date for round trip', 'error');
        return false;
    }
    
    if (data.isRoundTrip && data.returnDate <= data.departureDate) {
        showNotification('Return date must be after departure date', 'error');
        return false;
    }
    
    return true;
}

// Toggle round trip functionality
function toggleRoundTrip() {
    const isVisible = returnDateInput.style.display !== 'none';
    const iconEl = document.getElementById('roundIcon');
    const labelEl = document.querySelector('.round-label');
    if (isVisible) {
        returnDateInput.style.display = 'none';
        if (iconEl) {
            iconEl.classList.remove('fa-times');
            iconEl.classList.add('fa-exchange-alt');
        }
        if (labelEl) labelEl.textContent = i18n[currentLanguage]['search.round_trip_button'];
        roundTripToggle.classList.remove('active');
    } else {
        returnDateInput.style.display = 'block';
        if (iconEl) {
            iconEl.classList.remove('fa-exchange-alt');
            iconEl.classList.add('fa-times');
        }
        if (labelEl) labelEl.textContent = i18n[currentLanguage]['search.one_way_button'];
        roundTripToggle.classList.add('active');
    }
}

// Validate dates
function validateDates() {
    const departureDate = new Date(departureDateInput.value);
    const returnDate = new Date(returnDateInput.value);
    
    if (returnDateInput.value && returnDate <= departureDate) {
        showNotification('Return date must be after departure date', 'warning');
        returnDateInput.value = '';
    }
}

// Show loading state
function showLoadingState() {
    const searchButton = searchForm.querySelector('.btn-search');
    const originalText = searchButton.innerHTML;
    
    searchButton.innerHTML = '<span class="loading"></span> Searching...';
    searchButton.disabled = true;
    
    // Reset button after 3 seconds in case of error
    setTimeout(() => {
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
    }, 3000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--accent-color)',
        info: 'var(--primary-color)'
    };
    return colors[type] || 'var(--primary-color)';
}

// Setup mobile menu
function setupMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.route-card, .step, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .btn-round-trip.active {
        background: var(--primary-color);
        color: white;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: var(--shadow-lg);
        padding: 1rem;
        gap: 1rem;
    }
`;
document.head.appendChild(style);