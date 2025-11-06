// SelamBus - Interactive Seat Map System

class SeatMapManager {
    constructor() {
        this.selectedSeats = new Set();
        this.bookedSeats = new Set(['A1', 'A2', 'B3', 'C4', 'D5']); // Sample booked seats
        this.seatPrices = {
            economy: 150,
            business: 250,
            luxury: 350
        };
        this.currentBusType = 'economy';
        this.maxSeats = 48;
        this.womenOnlySeats = new Set(['E1', 'E2', 'F1', 'F2']);
        
        this.initializeSeatMap();
        this.setupEventListeners();
    }
    
    initializeSeatMap() {
        this.createSeatLayout();
        this.updateSeatSummary();
        this.updateTotalPrice();
    }
    
    createSeatLayout() {
        const seatContainer = document.getElementById('seatMapContainer');
        if (!seatContainer) return;
        
        seatContainer.innerHTML = '';
        
        // Create bus layout based on bus type
        const layout = this.getBusLayout();
        
        // Create legend
        const legend = this.createSeatLegend();
        seatContainer.appendChild(legend);
        
        // Create seat grid
        const seatGrid = document.createElement('div');
        seatGrid.className = 'seat-grid';
        
        // Add driver section
        const driverSection = this.createDriverSection();
        seatGrid.appendChild(driverSection);
        
        // Add seats
        layout.forEach((row, rowIndex) => {
            const rowElement = this.createSeatRow(row, rowIndex);
            seatGrid.appendChild(rowElement);
        });
        
        seatContainer.appendChild(seatGrid);
    }
    
    getBusLayout() {
        const layouts = {
            economy: [
                ['A1', 'A2', '', 'A3', 'A4'],
                ['B1', 'B2', '', 'B3', 'B4'],
                ['C1', 'C2', '', 'C3', 'C4'],
                ['D1', 'D2', '', 'D3', 'D4'],
                ['E1', 'E2', '', 'E3', 'E4'],
                ['F1', 'F2', '', 'F3', 'F4'],
                ['G1', 'G2', '', 'G3', 'G4'],
                ['H1', 'H2', '', 'H3', 'H4'],
                ['I1', 'I2', '', 'I3', 'I4'],
                ['J1', 'J2', '', 'J3', 'J4'],
                ['K1', 'K2', '', 'K3', 'K4'],
                ['L1', 'L2', '', 'L3', 'L4']
            ],
            business: [
                ['A1', '', 'A2', 'A3'],
                ['B1', '', 'B2', 'B3'],
                ['C1', '', 'C2', 'C3'],
                ['D1', '', 'D2', 'D3'],
                ['E1', '', 'E2', 'E3'],
                ['F1', '', 'F2', 'F3'],
                ['G1', '', 'G2', 'G3'],
                ['H1', '', 'H2', 'H3'],
                ['I1', '', 'I2', 'I3'],
                ['J1', '', 'J2', 'J3']
            ],
            luxury: [
                ['A1', '', 'A2'],
                ['B1', '', 'B2'],
                ['C1', '', 'C2'],
                ['D1', '', 'D2'],
                ['E1', '', 'E2'],
                ['F1', '', 'F2'],
                ['G1', '', 'G2'],
                ['H1', '', 'H2']
            ]
        };
        
        return layouts[this.currentBusType] || layouts.economy;
    }
    
    createSeatLegend() {
        const legend = document.createElement('div');
        legend.className = 'seat-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <div class="seat available"></div>
                <span>Available</span>
            </div>
            <div class="legend-item">
                <div class="seat selected"></div>
                <span>Selected</span>
            </div>
            <div class="legend-item">
                <div class="seat booked"></div>
                <span>Booked</span>
            </div>
            <div class="legend-item">
                <div class="seat women-only"></div>
                <span>Women Only</span>
            </div>
        `;
        return legend;
    }
    
    createDriverSection() {
        const driverSection = document.createElement('div');
        driverSection.className = 'driver-section';
        driverSection.innerHTML = `
            <div class="driver-seat">
                <i class="fas fa-user-tie"></i>
                <span>Driver</span>
            </div>
        `;
        return driverSection;
    }
    
    createSeatRow(rowData, rowIndex) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        
        rowData.forEach((seatNumber, seatIndex) => {
            if (seatNumber === '') {
                // Empty space for aisle
                const aisle = document.createElement('div');
                aisle.className = 'aisle';
                row.appendChild(aisle);
            } else {
                const seat = this.createSeatElement(seatNumber);
                row.appendChild(seat);
            }
        });
        
        return row;
    }
    
    createSeatElement(seatNumber) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.seatNumber = seatNumber;
        
        // Determine seat type and status
        let seatClass = 'available';
        let isClickable = true;
        let tooltip = 'Click to select';
        
        if (this.bookedSeats.has(seatNumber)) {
            seatClass = 'booked';
            isClickable = false;
            tooltip = 'Already booked';
        } else if (this.selectedSeats.has(seatNumber)) {
            seatClass = 'selected';
            tooltip = 'Selected - Click to deselect';
        } else if (this.womenOnlySeats.has(seatNumber)) {
            seatClass = 'women-only';
            tooltip = 'Women only seat - Click to select';
        }
        
        seat.classList.add(seatClass);
        seat.title = tooltip;
        
        if (isClickable) {
            seat.addEventListener('click', () => this.toggleSeat(seatNumber));
            seat.style.cursor = 'pointer';
        }
        
        seat.innerHTML = `
            <div class="seat-number">${seatNumber}</div>
            <div class="seat-icon">
                <i class="fas fa-chair"></i>
            </div>
        `;
        
        return seat;
    }
    
    toggleSeat(seatNumber) {
        if (this.bookedSeats.has(seatNumber)) {
            return; // Cannot select booked seats
        }
        
        if (this.selectedSeats.has(seatNumber)) {
            this.selectedSeats.delete(seatNumber);
        } else {
            // Check if maximum seats reached
            if (this.selectedSeats.size >= 10) { // Maximum 10 seats per booking
                this.showNotification('Maximum 10 seats can be selected per booking', 'warning');
                return;
            }
            this.selectedSeats.add(seatNumber);
        }
        
        this.updateSeatMap();
        this.updateSeatSummary();
        this.updateTotalPrice();
        this.updatePassengerForms();
    }
    
    updateSeatMap() {
        // Update visual representation of seats
        document.querySelectorAll('.seat').forEach(seat => {
            const seatNumber = seat.dataset.seatNumber;
            
            if (this.selectedSeats.has(seatNumber)) {
                seat.classList.add('selected');
                seat.classList.remove('available');
                seat.title = 'Selected - Click to deselect';
            } else if (!this.bookedSeats.has(seatNumber)) {
                seat.classList.remove('selected');
                seat.classList.add('available');
                seat.title = 'Click to select';
            }
        });
    }
    
    updateSeatSummary() {
        const summaryContainer = document.getElementById('seatSummary');
        if (!summaryContainer) return;
        
        if (this.selectedSeats.size === 0) {
            summaryContainer.innerHTML = '<p>No seats selected</p>';
            return;
        }
        
        const seatList = Array.from(this.selectedSeats).join(', ');
        summaryContainer.innerHTML = `
            <h4>Selected Seats (${this.selectedSeats.size})</h4>
            <p class="seat-list">${seatList}</p>
            <button class="btn-clear-seats" onclick="seatMapManager.clearAllSeats()">
                <i class="fas fa-times"></i> Clear All
            </button>
        `;
    }
    
    updateTotalPrice() {
        const totalPrice = this.selectedSeats.size * this.seatPrices[this.currentBusType];
        const priceElement = document.getElementById('totalPrice');
        const seatCountElement = document.getElementById('seatCount');
        
        if (priceElement) {
            priceElement.textContent = `ETB ${totalPrice.toLocaleString()}`;
        }
        
        if (seatCountElement) {
            seatCountElement.textContent = `${this.selectedSeats.size} seat(s)`;
        }
    }
    
    updatePassengerForms() {
        const formsContainer = document.getElementById('passengerForms');
        if (!formsContainer) return;
        
        formsContainer.innerHTML = '';
        
        if (this.selectedSeats.size === 0) {
            formsContainer.innerHTML = '<p>Please select seats first</p>';
            return;
        }
        
        Array.from(this.selectedSeats).forEach((seatNumber, index) => {
            const form = this.createPassengerForm(seatNumber, index);
            formsContainer.appendChild(form);
        });
    }
    
    createPassengerForm(seatNumber, index) {
        const form = document.createElement('div');
        form.className = 'passenger-form';
        form.innerHTML = `
            <h4>Passenger ${index + 1} - Seat ${seatNumber}</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label for="passenger_${seatNumber}_name">Full Name *</label>
                    <input type="text" 
                           id="passenger_${seatNumber}_name" 
                           name="passenger_${seatNumber}_name" 
                           required 
                           placeholder="Enter full name">
                </div>
                
                <div class="form-group">
                    <label for="passenger_${seatNumber}_age">Age *</label>
                    <input type="number" 
                           id="passenger_${seatNumber}_age" 
                           name="passenger_${seatNumber}_age" 
                           required 
                           min="1" 
                           max="120" 
                           placeholder="Enter age">
                </div>
                
                <div class="form-group">
                    <label for="passenger_${seatNumber}_gender">Gender *</label>
                    <select id="passenger_${seatNumber}_gender" 
                            name="passenger_${seatNumber}_gender" 
                            required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="passenger_${seatNumber}_phone">Phone Number *</label>
                    <input type="tel" 
                           id="passenger_${seatNumber}_phone" 
                           name="passenger_${seatNumber}_phone" 
                           required 
                           placeholder="+251XXXXXXXX">
                </div>
                
                <div class="form-group">
                    <label for="passenger_${seatNumber}_email">Email Address</label>
                    <input type="email" 
                           id="passenger_${seatNumber}_email" 
                           name="passenger_${seatNumber}_email" 
                           placeholder="Enter email (optional)">
                </div>
                
                <div class="form-group">
                    <label for="passenger_${seatNumber}_id">ID Number</label>
                    <input type="text" 
                           id="passenger_${seatNumber}_id" 
                           name="passenger_${seatNumber}_id" 
                           placeholder="Enter ID number (optional)">
                </div>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" 
                           id="passenger_${seatNumber}_special" 
                           name="passenger_${seatNumber}_special">
                    Special requirements (wheelchair access, etc.)
                </label>
            </div>
            
            <div class="form-group special-requirements" style="display: none;">
                <label for="passenger_${seatNumber}_requirements">Please specify special requirements</label>
                <textarea id="passenger_${seatNumber}_requirements" 
                          name="passenger_${seatNumber}_requirements" 
                          rows="2" 
                          placeholder="Describe any special requirements"></textarea>
            </div>
        `;
        
        // Add event listener for special requirements checkbox
        const specialCheckbox = form.querySelector(`#passenger_${seatNumber}_special`);
        const specialRequirementsDiv = form.querySelector('.special-requirements');
        
        specialCheckbox.addEventListener('change', function() {
            specialRequirementsDiv.style.display = this.checked ? 'block' : 'none';
        });
        
        return form;
    }
    
    clearAllSeats() {
        this.selectedSeats.clear();
        this.updateSeatMap();
        this.updateSeatSummary();
        this.updateTotalPrice();
        this.updatePassengerForms();
        this.showNotification('All seats cleared', 'info');
    }
    
    validatePassengerData() {
        const passengers = [];
        let isValid = true;
        
        Array.from(this.selectedSeats).forEach(seatNumber => {
            const passengerData = {
                seatNumber: seatNumber,
                name: document.getElementById(`passenger_${seatNumber}_name`).value,
                age: document.getElementById(`passenger_${seatNumber}_age`).value,
                gender: document.getElementById(`passenger_${seatNumber}_gender`).value,
                phone: document.getElementById(`passenger_${seatNumber}_phone`).value,
                email: document.getElementById(`passenger_${seatNumber}_email`).value,
                idNumber: document.getElementById(`passenger_${seatNumber}_id`).value,
                specialRequirements: document.getElementById(`passenger_${seatNumber}_special`).checked,
                requirements: document.getElementById(`passenger_${seatNumber}_requirements`).value
            };
            
            // Validate required fields
            if (!passengerData.name || !passengerData.age || !passengerData.gender || !passengerData.phone) {
                isValid = false;
                this.highlightInvalidField(seatNumber);
            }
            
            // Validate age
            if (passengerData.age && (passengerData.age < 1 || passengerData.age > 120)) {
                isValid = false;
                this.showNotification(`Invalid age for passenger in seat ${seatNumber}`, 'error');
            }
            
            // Validate phone number (basic validation)
            if (passengerData.phone && !this.validatePhoneNumber(passengerData.phone)) {
                isValid = false;
                this.showNotification(`Invalid phone number for passenger in seat ${seatNumber}`, 'error');
            }
            
            passengers.push(passengerData);
        });
        
        return { isValid, passengers };
    }
    
    highlightInvalidField(seatNumber) {
        const form = document.querySelector(`#passenger_${seatNumber}_name`).closest('.passenger-form');
        form.classList.add('invalid');
        
        setTimeout(() => {
            form.classList.remove('invalid');
        }, 3000);
    }
    
    validatePhoneNumber(phone) {
        // Basic Ethiopian phone number validation
        const ethiopianPhoneRegex = /^(\+251|0)?[1-9][0-9]{8}$/;
        return ethiopianPhoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    showNotification(message, type = 'info') {
        // Use the same notification system as the main script
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
    
    proceedToPayment() {
        const { isValid, passengers } = this.validatePassengerData();
        
        if (!isValid) {
            this.showNotification('Please fill in all required passenger information', 'error');
            return;
        }
        
        if (this.selectedSeats.size === 0) {
            this.showNotification('Please select at least one seat', 'error');
            return;
        }
        
        // Store booking data
        const bookingData = {
            busType: this.currentBusType,
            selectedSeats: Array.from(this.selectedSeats),
            passengers: passengers,
            totalPrice: this.selectedSeats.size * this.seatPrices[this.currentBusType],
            seatPrices: this.seatPrices[this.currentBusType],
            bookingDate: new Date().toISOString()
        };
        
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        // Show loading state
        this.showLoadingState();
        
        // Redirect to payment page
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1500);
    }
    
    showLoadingState() {
        const proceedButton = document.querySelector('.btn-proceed-payment');
        if (proceedButton) {
            proceedButton.innerHTML = '<span class="loading"></span> Processing...';
            proceedButton.disabled = true;
        }
    }
    
    setupEventListeners() {
        // Bus type selector
        document.querySelectorAll('.bus-type-selector input').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentBusType = e.target.value;
                this.createSeatLayout();
                this.updateTotalPrice();
            });
        });
        
        // Proceed to payment button
        const proceedButton = document.querySelector('.btn-proceed-payment');
        if (proceedButton) {
            proceedButton.addEventListener('click', () => this.proceedToPayment());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAllSeats();
            }
        });
    }
}

// Initialize seat map manager
let seatMapManager;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('seatMapContainer')) {
        seatMapManager = new SeatMapManager();
    }
});

// Add CSS for seat map
const seatMapStyles = `
    .seat-map-container {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .seat-legend {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .legend-item .seat {
        width: 20px;
        height: 20px;
        border-radius: 4px;
    }
    
    .seat-grid {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .driver-section {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f3f4f6;
        border-radius: 0.5rem;
    }
    
    .driver-seat {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #6b7280;
        font-weight: 500;
    }
    
    .seat-row {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .seat {
        width: 60px;
        height: 60px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .seat.available {
        background: #10b981;
        border-color: #059669;
        color: white;
    }
    
    .seat.available:hover {
        background: #059669;
        transform: scale(1.05);
    }
    
    .seat.selected {
        background: #3b82f6;
        border-color: #2563eb;
        color: white;
        transform: scale(1.05);
    }
    
    .seat.booked {
        background: #9ca3af;
        border-color: #6b7280;
        color: white;
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .seat.women-only {
        background: #ec4899;
        border-color: #db2777;
        color: white;
    }
    
    .seat.women-only:hover {
        background: #db2777;
        transform: scale(1.05);
    }
    
    .seat-number {
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .seat-icon {
        font-size: 1.25rem;
    }
    
    .aisle {
        width: 40px;
    }
    
    .bus-type-selector {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
    }
    
    .bus-type-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .booking-summary {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .summary-row:last-child {
        border-bottom: none;
        font-weight: 600;
        font-size: 1.25rem;
    }
    
    .btn-proceed-payment {
        background: #10b981;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        width: 100%;
        justify-content: center;
    }
    
    .btn-proceed-payment:hover {
        background: #059669;
        transform: translateY(-2px);
    }
    
    .btn-proceed-payment:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
    }
    
    .passenger-form {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
    
    .passenger-form.invalid {
        border: 2px solid #ef4444;
        animation: shake 0.5s ease-in-out;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    .form-group label {
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #374151;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .btn-clear-seats {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.3s ease;
    }
    
    .btn-clear-seats:hover {
        background: #dc2626;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = seatMapStyles;
document.head.appendChild(styleSheet);