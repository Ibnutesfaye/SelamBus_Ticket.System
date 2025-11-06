// SelamBus - Booking Confirmation JavaScript

class BookingConfirmationManager {
    constructor() {
        this.bookingData = {};
        this.qrCode = null;
        this.isProcessing = false;
        
        this.initializeBooking();
        this.setupEventListeners();
        this.generateQRCode();
    }
    
    initializeBooking() {
        // Load booking data from session storage
        const bookingData = sessionStorage.getItem('bookingData');
        const paymentData = sessionStorage.getItem('paymentData');
        const selectedBus = sessionStorage.getItem('selectedBus');
        const selectedSeats = sessionStorage.getItem('selectedSeats');
        
        if (paymentData) {
            this.bookingData = JSON.parse(paymentData);
            this.updateBookingDisplay();
        } else {
            // Fallback sample data for testing
            this.bookingData = {
                reference: 'SLM-241215-ABCD',
                route: {
                    from: 'Addis Ababa',
                    to: 'Hawassa',
                    departureDate: '2024-12-15',
                    departureTime: '08:00',
                    arrivalTime: '12:30',
                    departureTerminal: 'Autobus Tera',
                    arrivalTerminal: 'Main Terminal'
                },
                bus: {
                    company: 'Selam Bus',
                    type: 'Business Class',
                    logo: 'SB',
                    color: '2563eb'
                },
                passengers: [
                    { name: 'Abebe Kebede', seat: 'A1', gender: 'Male', age: 35 },
                    { name: 'Marta Abebe', seat: 'A2', gender: 'Female', age: 32 }
                ],
                pricing: {
                    baseFare: 180,
                    passengers: 2,
                    subtotal: 360,
                    tax: 54,
                    convenienceFee: 10,
                    total: 424
                },
                paymentMethod: 'TeleBirr',
                paymentId: 'TB-1234567890',
                timestamp: new Date().toISOString()
            };
            this.updateBookingDisplay();
        }
    }
    
    updateBookingDisplay() {
        const data = this.bookingData;
        
        // Update booking reference
        document.getElementById('bookingReference').textContent = data.reference;
        
        // Update trip date
        const tripDate = new Date(data.route.departureDate);
        document.getElementById('tripDate').textContent = tripDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Update route information
        document.getElementById('departureCity').textContent = data.route.from;
        document.getElementById('departureTerminal').textContent = data.route.departureTerminal;
        document.getElementById('departureTime').textContent = this.formatTime(data.route.departureTime);
        
        document.getElementById('arrivalCity').textContent = data.route.to;
        document.getElementById('arrivalTerminal').textContent = data.route.arrivalTerminal;
        document.getElementById('arrivalTime').textContent = this.formatTime(data.route.arrivalTime);
        
        // Update duration
        const duration = this.calculateDuration(data.route.departureTime, data.route.arrivalTime);
        document.getElementById('duration').textContent = duration;
        
        // Update bus information
        document.getElementById('companyName').textContent = data.bus.company;
        document.getElementById('busType').textContent = data.bus.type;
        
        // Update passengers list
        this.updatePassengersList();
        
        // Update payment summary
        document.getElementById('baseFare').textContent = `ETB ${data.pricing.baseFare}`;
        document.getElementById('taxes').textContent = `ETB ${data.pricing.tax}`;
        document.getElementById('convenienceFee').textContent = `ETB ${data.pricing.convenienceFee}`;
        document.getElementById('totalPaid').textContent = `ETB ${data.pricing.total}`;
        document.getElementById('paymentMethod').textContent = data.paymentMethod;
    }
    
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    calculateDuration(departureTime, arrivalTime) {
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
        
        let depTotal = depHours * 60 + depMinutes;
        let arrTotal = arrHours * 60 + arrMinutes;
        
        // Handle overnight trips
        if (arrTotal < depTotal) {
            arrTotal += 24 * 60;
        }
        
        const duration = arrTotal - depTotal;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        return `${hours}h ${minutes}m`;
    }
    
    updatePassengersList() {
        const passengersList = document.getElementById('passengersList');
        passengersList.innerHTML = '';
        
        this.bookingData.passengers.forEach(passenger => {
            const passengerItem = document.createElement('div');
            passengerItem.className = 'passenger-item';
            passengerItem.innerHTML = `
                <div class="passenger-info">
                    <div class="passenger-name">${passenger.name}</div>
                    <div class="passenger-details">
                        Seat ${passenger.seat} • ${passenger.gender} • ${passenger.age} years
                    </div>
                </div>
                <div class="passenger-price">ETB ${this.bookingData.pricing.baseFare}</div>
            `;
            passengersList.appendChild(passengerItem);
        });
    }
    
    generateQRCode() {
        const qrData = {
            reference: this.bookingData.reference,
            route: this.bookingData.route,
            passengers: this.bookingData.passengers,
            total: this.bookingData.pricing.total,
            timestamp: this.bookingData.timestamp
        };
        
        const qrText = JSON.stringify(qrData);
        
        // Generate QR code
        const qrcodeElement = document.getElementById('qrcode');
        qrcodeElement.innerHTML = ''; // Clear previous QR code
        
        this.qrCode = new QRCode(qrcodeElement, {
            text: qrText,
            width: 128,
            height: 128,
            colorDark: "#1f2937",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    setupEventListeners() {
        // Download ticket
        document.getElementById('downloadTicket').addEventListener('click', () => {
            this.downloadTicket();
        });
        
        // Email ticket
        document.getElementById('emailTicket').addEventListener('click', () => {
            this.emailTicket();
        });
        
        // SMS ticket
        document.getElementById('smsTicket').addEventListener('click', () => {
            this.sendSMS();
        });
        
        // New booking
        document.getElementById('newBooking').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // View all bookings
        document.getElementById('viewBookings').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
        
        // Cancel booking
        document.getElementById('cancelBooking').addEventListener('click', () => {
            this.cancelBooking();
        });
    }
    
    downloadTicket() {
        this.showLoading(true);
        
        try {
            // Generate PDF ticket
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.setTextColor(59, 130, 246); // Blue color
            doc.text('SelamBus E-Ticket', 105, 20, { align: 'center' });
            
            // Add header line
            doc.setDrawColor(59, 130, 246);
            doc.line(20, 25, 190, 25);
            
            // Add booking reference
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Booking Reference: ${this.bookingData.reference}`, 20, 35);
            
            // Add booking date
            const bookingDate = new Date(this.bookingData.timestamp);
            doc.text(`Booking Date: ${bookingDate.toLocaleDateString()}`, 20, 45);
            
            // Add trip details
            doc.setFontSize(16);
            doc.setTextColor(31, 41, 55); // Dark gray
            doc.text('Trip Details', 20, 60);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`From: ${this.bookingData.route.from}`, 20, 70);
            doc.text(`To: ${this.bookingData.route.to}`, 20, 80);
            doc.text(`Date: ${this.bookingData.route.departureDate}`, 20, 90);
            doc.text(`Departure: ${this.bookingData.route.departureTime}`, 20, 100);
            doc.text(`Arrival: ${this.bookingData.route.arrivalTime}`, 20, 110);
            doc.text(`Bus Company: ${this.bookingData.bus.company}`, 20, 120);
            doc.text(`Bus Type: ${this.bookingData.bus.type}`, 20, 130);
            
            // Add passengers
            doc.setFontSize(16);
            doc.setTextColor(31, 41, 55);
            doc.text('Passengers', 20, 145);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPosition = 155;
            this.bookingData.passengers.forEach((passenger, index) => {
                doc.text(`${index + 1}. ${passenger.name} - Seat ${passenger.seat}`, 20, yPosition);
                yPosition += 10;
            });
            
            // Add payment details
            doc.setFontSize(16);
            doc.setTextColor(31, 41, 55);
            doc.text('Payment Details', 20, yPosition + 10);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Base Fare: ETB ${this.bookingData.pricing.baseFare}`, 20, yPosition + 20);
            doc.text(`Taxes: ETB ${this.bookingData.pricing.tax}`, 20, yPosition + 30);
            doc.text(`Convenience Fee: ETB ${this.bookingData.pricing.convenienceFee}`, 20, yPosition + 40);
            doc.text(`Total: ETB ${this.bookingData.pricing.total}`, 20, yPosition + 50);
            doc.text(`Payment Method: ${this.bookingData.paymentMethod}`, 20, yPosition + 60);
            
            // Add QR code
            const qrCanvas = document.querySelector('#qrcode canvas');
            if (qrCanvas) {
                const qrDataUrl = qrCanvas.toDataURL('image/png');
                doc.addImage(qrDataUrl, 'PNG', 140, 35, 50, 50);
            }
            
            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128); // Gray
            doc.text('Important: Please arrive at the terminal 30 minutes before departure time.', 20, 280);
            doc.text('Carry a valid ID for verification. Contact support@selambus.com for assistance.', 20, 285);
            
            // Save the PDF
            const fileName = `SelamBus_Ticket_${this.bookingData.reference}.pdf`;
            doc.save(fileName);
            
            this.showNotification('Ticket downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error downloading ticket:', error);
            this.showNotification('Error downloading ticket. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async emailTicket() {
        this.showLoading(true);
        
        try {
            // Simulate email sending
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real implementation, you would send the ticket to the user's email
            // For now, we'll show a success message
            this.showNotification('Ticket sent to your email successfully!', 'success');
            this.showSuccessModal('Your ticket has been sent to your email address.');
            
        } catch (error) {
            console.error('Error sending email:', error);
            this.showNotification('Error sending email. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async sendSMS() {
        this.showLoading(true);
        
        try {
            // Simulate SMS sending
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real implementation, you would send the ticket details via SMS
            // For now, we'll show a success message
            this.showNotification('Ticket details sent via SMS successfully!', 'success');
            this.showSuccessModal('Your ticket details have been sent to your phone number.');
            
        } catch (error) {
            console.error('Error sending SMS:', error);
            this.showNotification('Error sending SMS. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    cancelBooking() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.')) {
            this.showLoading(true);
            
            // Simulate cancellation process
            setTimeout(() => {
                this.showLoading(false);
                this.showNotification('Booking cancellation request submitted successfully!', 'success');
                this.showSuccessModal('Your booking cancellation request has been submitted. You will receive a confirmation email within 24 hours.');
                
                // Disable cancel button
                document.getElementById('cancelBooking').disabled = true;
                document.getElementById('cancelBooking').textContent = 'Cancellation Requested';
                
            }, 2000);
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    }
    
    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        document.getElementById('successMessage').textContent = message;
        modal.style.display = 'flex';
    }
    
    showErrorModal(message) {
        const modal = document.getElementById('errorModal');
        document.getElementById('errorMessage').textContent = message;
        modal.style.display = 'flex';
    }
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
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
}

// Global functions
function closeModal() {
    if (window.bookingManager) {
        window.bookingManager.closeModal();
    }
}

// Initialize booking confirmation manager
let bookingManager;

document.addEventListener('DOMContentLoaded', function() {
    bookingManager = new BookingConfirmationManager();
    window.bookingManager = bookingManager;
});

// Add booking confirmation styles
const bookingStyles = `
    .confirmation-section {
        padding: 2rem 0;
        background: #f8fafc;
        min-height: 80vh;
    }
    
    .success-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 1rem;
        color: white;
    }
    
    .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 1s infinite;
    }
    
    .success-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .success-header p {
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    .booking-card {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-bottom: 2rem;
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
    }
    
    .booking-reference {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .booking-reference .label {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .booking-reference .reference-number {
        font-size: 1.25rem;
        font-weight: 700;
        font-family: monospace;
    }
    
    .booking-status {
        display: flex;
        align-items: center;
    }
    
    .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-badge.confirmed {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid #10b981;
    }
    
    .qr-section {
        display: flex;
        justify-content: center;
        padding: 2rem;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .qr-code {
        text-align: center;
    }
    
    .qr-code #qrcode {
        margin: 0 auto 1rem;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .qr-text {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .trip-details {
        padding: 2rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .trip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .trip-header h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .trip-date {
        color: #6b7280;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .route-info {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 2rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .departure-info, .arrival-info {
        text-align: center;
    }
    
    .city {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .terminal {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    
    .time {
        color: #374151;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .route-arrow {
        color: #3b82f6;
        font-size: 2rem;
    }
    
    .bus-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
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
    
    .company-name {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .bus-type {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .trip-duration {
        color: #374151;
        font-weight: 500;
    }
    
    .passengers-section {
        padding: 2rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .passengers-section h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    
    .passengers-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .passenger-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
    }
    
    .passenger-name {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .passenger-details {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .passenger-price {
        font-weight: 600;
        color: #1f2937;
    }
    
    .payment-summary {
        padding: 2rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .payment-summary h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    
    .payment-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .payment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #374151;
        font-size: 0.9rem;
    }
    
    .payment-item.total {
        font-weight: 700;
        font-size: 1.1rem;
        color: #1f2937;
        padding-top: 0.75rem;
        border-top: 2px solid #e5e7eb;
    }
    
    .payment-method {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
    }
    
    .method-label {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .method-name {
        color: #1f2937;
        font-weight: 600;
    }
    
    .important-info {
        padding: 2rem;
    }
    
    .important-info h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    
    .info-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .info-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
    }
    
    .info-item i {
        color: #3b82f6;
        font-size: 1.25rem;
        margin-top: 0.25rem;
    }
    
    .info-item strong {
        color: #1f2937;
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .info-item p {
        color: #6b7280;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .action-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        font-size: 0.9rem;
    }
    
    .btn-download {
        background: #3b82f6;
        color: white;
    }
    
    .btn-download:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }
    
    .btn-email {
        background: #10b981;
        color: white;
    }
    
    .btn-email:hover {
        background: #059669;
        transform: translateY(-2px);
    }
    
    .btn-sms {
        background: #8b5cf6;
        color: white;
    }
    
    .btn-sms:hover {
        background: #7c3aed;
        transform: translateY(-2px);
    }
    
    .btn-primary {
        background: #1f2937;
        color: white;
    }
    
    .btn-primary:hover {
        background: #374151;
        transform: translateY(-2px);
    }
    
    .booking-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .btn-secondary {
        background: #6b7280;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #4b5563;
        transform: translateY(-2px);
    }
    
    .btn-danger {
        background: #ef4444;
        color: white;
    }
    
    .btn-danger:hover {
        background: #dc2626;
        transform: translateY(-2px);
    }
    
    .btn-danger:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
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
        border-top: 4px solid #10b981;
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
    
    @media (max-width: 768px) {
        .confirmation-section {
            padding: 1rem 0;
        }
        
        .success-header {
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .success-header h1 {
            font-size: 2rem;
        }
        
        .card-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .route-info {
            grid-template-columns: 1fr;
            gap: 1rem;
            text-align: center;
        }
        
        .route-arrow {
            transform: rotate(90deg);
            margin: 0.5rem 0;
        }
        
        .bus-info {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .action-buttons {
            grid-template-columns: 1fr;
        }
        
        .booking-actions {
            flex-direction: column;
        }
        
        .btn {
            width: 100%;
            justify-content: center;
        }
        
        .notification {
            right: 10px;
            max-width: calc(100% - 20px);
        }
    }
    
    @media (max-width: 480px) {
        .success-header {
            padding: 1rem;
        }
        
        .success-header h1 {
            font-size: 1.5rem;
        }
        
        .trip-details,
        .passengers-section,
        .payment-summary,
        .important-info {
            padding: 1.5rem;
        }
        
        .trip-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
        
        .passenger-item {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
        
        .payment-method {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
        
        .info-item {
            flex-direction: column;
            text-align: center;
        }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .confirmation-section {
            background: #0f172a;
        }
        
        .success-header {
            background: linear-gradient(135deg, #059669, #047857);
        }
        
        .booking-card {
            background: #1e293b;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .card-header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }
        
        .trip-header h3,
        .passengers-section h3,
        .payment-summary h3,
        .important-info h3 {
            color: #f8fafc;
        }
        
        .city,
        .company-name,
        .passenger-name,
        .payment-item.total,
        .method-name {
            color: #f8fafc;
        }
        
        .terminal,
        .trip-date,
        .bus-type,
        .passenger-details,
        .payment-item,
        .method-label,
        .info-item p {
            color: #cbd5e1;
        }
        
        .route-info,
        .passengers-list,
        .payment-details,
        .payment-method,
        .info-item {
            background: #334155;
        }
        
        .bus-info {
            background: #334155;
        }
        
        .qr-section {
            background: #334155;
        }
        
        .loading-content,
        .modal-content {
            background: #1e293b;
        }
        
        .modal-content h3 {
            color: #f8fafc;
        }
        
        .modal-content p {
            color: #cbd5e1;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = bookingStyles;
document.head.appendChild(styleSheet);