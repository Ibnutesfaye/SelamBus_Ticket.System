// SelamBus - Payment Integration JavaScript

class PaymentProcessor {
    constructor() {
        this.currentPaymentMethod = 'telebirr';
        this.paymentData = {};
        this.isProcessing = false;
        
        this.initializePayment();
        this.setupEventListeners();
    }
    
    initializePayment() {
        // Load booking data from session storage
        this.loadBookingData();
        this.updateOrderSummary();
        this.generateReferenceNumber();
    }
    
    loadBookingData() {
        // Get booking data from session storage
        const bookingData = sessionStorage.getItem('bookingData');
        const selectedBus = sessionStorage.getItem('selectedBus');
        const selectedSeats = sessionStorage.getItem('selectedSeats');
        
        if (bookingData) {
            this.paymentData = JSON.parse(bookingData);
        } else {
            // Fallback sample data
            this.paymentData = {
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
                }
            };
        }
    }
    
    updateOrderSummary() {
        const data = this.paymentData;
        
        // Update route info
        document.querySelector('.route-info .departure .city').textContent = data.route.from;
        document.querySelector('.route-info .departure .terminal').textContent = data.route.departureTerminal;
        document.querySelector('.route-info .departure .datetime').textContent = 
            `${this.formatDate(data.route.departureDate)} • ${data.route.departureTime}`;
        
        document.querySelector('.route-info .arrival .city').textContent = data.route.to;
        document.querySelector('.route-info .arrival .terminal').textContent = data.route.arrivalTerminal;
        document.querySelector('.route-info .arrival .datetime').textContent = 
            `${this.formatDate(data.route.departureDate)} • ${data.route.arrivalTime}`;
        
        // Update bus info
        const companyLogo = document.querySelector('.bus-info .company-logo');
        companyLogo.src = `https://via.placeholder.com/40x40/${data.bus.color}/ffffff?text=${data.bus.logo}`;
        companyLogo.alt = data.bus.company;
        
        document.querySelector('.bus-info .company-details .name').textContent = data.bus.company;
        document.querySelector('.bus-info .company-details .type').textContent = data.bus.type;
        
        // Update passenger list
        const passengerList = document.querySelector('.passenger-list');
        passengerList.innerHTML = '<h4 id="passengersTitle">Passengers</h4>';
        
        data.passengers.forEach(passenger => {
            const passengerItem = document.createElement('div');
            passengerItem.className = 'passenger-item';
            passengerItem.innerHTML = `
                <div class="passenger-info">
                    <div class="name">${passenger.name}</div>
                    <div class="details">Seat ${passenger.seat} • ${passenger.gender} • ${passenger.age} years</div>
                </div>
                <div class="passenger-price">ETB ${data.pricing.baseFare}</div>
            `;
            passengerList.appendChild(passengerItem);
        });
        
        // Update pricing
        document.querySelector('.price-breakdown .price-item:nth-child(1) .price').textContent = 
            `ETB ${data.pricing.subtotal}`;
        document.querySelector('.price-breakdown .price-item:nth-child(2) .price').textContent = 
            `ETB ${data.pricing.tax}`;
        document.querySelector('.price-breakdown .price-item:nth-child(3) .price').textContent = 
            `ETB ${data.pricing.convenienceFee}`;
        document.querySelector('.price-breakdown .price-item.total .price').textContent = 
            `ETB ${data.pricing.total}`;
        
        // Update pay button
        document.querySelector('.btn-pay span').textContent = `Pay ETB ${data.pricing.total}`;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    
    generateReferenceNumber() {
        const date = new Date();
        const dateStr = date.getFullYear().toString().slice(2) + 
                       (date.getMonth() + 1).toString().padStart(2, '0') + 
                       date.getDate().toString().padStart(2, '0');
        const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
        const reference = `SLM-${dateStr}-${randomStr}`;
        
        document.getElementById('bankReference').textContent = reference;
        this.paymentData.reference = reference;
    }
    
    setupEventListeners() {
        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                this.switchPaymentMethod(e.target.value);
            });
        });
        
        // Form validation and formatting
        this.setupFormValidation();
        
        // Back button
        document.querySelector('.btn-back').addEventListener('click', () => {
            this.goBack();
        });
        
        // Pay button
        document.querySelector('.btn-pay').addEventListener('click', () => {
            this.processPayment();
        });
        
        // Bank receipt upload
        document.getElementById('bankReceipt').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
    }
    
    setupFormValidation() {
        // TeleBirr number validation
        const telebirrNumber = document.getElementById('telebirrNumber');
        if (telebirrNumber) {
            telebirrNumber.addEventListener('input', (e) => {
                // Format phone number
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length > 10) value = value.slice(0, 10);
                    e.target.value = value;
                }
                this.validatePhoneNumber(e.target);
            });
        }
        
        // CBE Birr number validation
        const cbeNumber = document.getElementById('cbeNumber');
        if (cbeNumber) {
            cbeNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length > 10) value = value.slice(0, 10);
                    e.target.value = value;
                }
                this.validatePhoneNumber(e.target);
            });
        }
        
        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(/.{1,4}/g).join(' ');
                    if (value.length > 19) value = value.slice(0, 19);
                }
                e.target.value = value;
                this.validateCardNumber(e.target);
            });
        }
        
        // Expiry date formatting
        const expiryDate = document.getElementById('expiryDate');
        if (expiryDate) {
            expiryDate.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length > 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    if (value.length > 5) value = value.slice(0, 5);
                }
                e.target.value = value;
                this.validateExpiryDate(e.target);
            });
        }
        
        // CVV validation
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
                this.validateCVV(e.target);
            });
        }
        
        // PIN validation (TeleBirr and CBE Birr)
        const telebirrPin = document.getElementById('telebirrPin');
        if (telebirrPin) {
            telebirrPin.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                e.target.value = value;
                this.validatePIN(e.target);
            });
        }
        
        const cbePin = document.getElementById('cbePin');
        if (cbePin) {
            cbePin.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                e.target.value = value;
                this.validatePIN(e.target);
            });
        }
    }
    
    validatePhoneNumber(input) {
        const value = input.value;
        const isValid = /^09[0-9]{8}$/.test(value);
        this.setFieldValidity(input, isValid, 'Please enter a valid Ethiopian phone number (09XXXXXXXX)');
        return isValid;
    }
    
    validateCardNumber(input) {
        const value = input.value.replace(/\s/g, '');
        const isValid = /^[0-9]{16}$/.test(value);
        this.setFieldValidity(input, isValid, 'Please enter a valid 16-digit card number');
        return isValid;
    }
    
    validateExpiryDate(input) {
        const value = input.value;
        const isValid = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value);
        this.setFieldValidity(input, isValid, 'Please enter a valid expiry date (MM/YY)');
        return isValid;
    }
    
    validateCVV(input) {
        const value = input.value;
        const isValid = /^[0-9]{3}$/.test(value);
        this.setFieldValidity(input, isValid, 'Please enter a valid 3-digit CVV');
        return isValid;
    }
    
    validatePIN(input) {
        const value = input.value;
        const isValid = /^[0-9]{4}$/.test(value);
        this.setFieldValidity(input, isValid, 'Please enter a valid 4-digit PIN');
        return isValid;
    }
    
    setFieldValidity(input, isValid, errorMessage) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            formGroup.classList.add('error');
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = errorMessage;
                formGroup.appendChild(error);
            }
        }
    }
    
    switchPaymentMethod(method) {
        this.currentPaymentMethod = method;
        
        // Hide all payment forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show selected payment form
        const selectedForm = document.getElementById(method + 'Form');
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
        
        // Update pay button text
        const totalAmount = this.paymentData.pricing.total;
        let feeText = '';
        
        switch (method) {
            case 'card':
                const cardFee = Math.round(totalAmount * 0.025);
                feeText = ` (+ ETB ${cardFee} fee)`;
                break;
            case 'bank':
                feeText = ' (Manual)';
                break;
            default:
                feeText = '';
        }
        
        document.querySelector('.btn-pay span').textContent = `Pay ETB ${totalAmount}${feeText}`;
    }
    
    validateCurrentForm() {
        const method = this.currentPaymentMethod;
        let isValid = true;
        
        switch (method) {
            case 'telebirr':
                isValid = this.validatePhoneNumber(document.getElementById('telebirrNumber')) &&
                         this.validatePIN(document.getElementById('telebirrPin'));
                break;
            case 'cbebirr':
                isValid = this.validatePhoneNumber(document.getElementById('cbeNumber')) &&
                         this.validatePIN(document.getElementById('cbePin'));
                break;
            case 'card':
                isValid = this.validateCardNumber(document.getElementById('cardNumber')) &&
                         this.validateExpiryDate(document.getElementById('expiryDate')) &&
                         this.validateCVV(document.getElementById('cvv')) &&
                         document.getElementById('cardholderName').value.trim() !== '';
                break;
            case 'bank':
                isValid = document.getElementById('bankReceipt').files.length > 0;
                if (!isValid) {
                    this.showNotification('Please upload your bank transfer receipt', 'error');
                }
                break;
        }
        
        return isValid;
    }
    
    async processPayment() {
        if (this.isProcessing) return;
        
        if (!this.validateCurrentForm()) {
            return;
        }
        
        this.isProcessing = true;
        this.showLoading(true);
        
        try {
            // Simulate payment processing
            await this.simulatePaymentProcessing();
            
            // Process based on payment method
            let result;
            switch (this.currentPaymentMethod) {
                case 'telebirr':
                    result = await this.processTeleBirrPayment();
                    break;
                case 'cbebirr':
                    result = await this.processCBEBirrPayment();
                    break;
                case 'card':
                    result = await this.processCardPayment();
                    break;
                case 'bank':
                    result = await this.processBankTransfer();
                    break;
                default:
                    throw new Error('Invalid payment method');
            }
            
            if (result.success) {
                this.paymentData.paymentId = result.paymentId;
                this.paymentData.paymentMethod = this.currentPaymentMethod;
                this.paymentData.status = 'completed';
                this.paymentData.timestamp = new Date().toISOString();
                
                // Store payment data for confirmation page
                sessionStorage.setItem('paymentData', JSON.stringify(this.paymentData));
                
                this.showSuccessModal();
                
                // Redirect to confirmation page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'booking-confirmation.html';
                }, 3000);
            } else {
                throw new Error(result.message || 'Payment failed');
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showErrorModal(error.message || 'Payment processing failed');
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }
    
    async simulatePaymentProcessing() {
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    async processTeleBirrPayment() {
        // Simulate TeleBirr API integration
        const phoneNumber = document.getElementById('telebirrNumber').value;
        const pin = document.getElementById('telebirrPin').value;
        
        console.log('Processing TeleBirr payment:', { phoneNumber, amount: this.paymentData.pricing.total });
        
        // Simulate API call
        await this.simulatePaymentProcessing();
        
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            return {
                success: true,
                paymentId: 'TB-' + Date.now(),
                transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                message: 'Payment processed successfully'
            };
        } else {
            return {
                success: false,
                message: 'TeleBirr payment failed. Please check your balance and try again.'
            };
        }
    }
    
    async processCBEBirrPayment() {
        // Simulate CBE Birr API integration
        const phoneNumber = document.getElementById('cbeNumber').value;
        const pin = document.getElementById('cbePin').value;
        
        console.log('Processing CBE Birr payment:', { phoneNumber, amount: this.paymentData.pricing.total });
        
        // Simulate API call
        await this.simulatePaymentProcessing();
        
        // Simulate success/failure (85% success rate)
        const success = Math.random() > 0.15;
        
        if (success) {
            return {
                success: true,
                paymentId: 'CBE-' + Date.now(),
                transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                message: 'Payment processed successfully'
            };
        } else {
            return {
                success: false,
                message: 'CBE Birr payment failed. Please check your balance and try again.'
            };
        }
    }
    
    async processCardPayment() {
        // Simulate card payment processing
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardholderName = document.getElementById('cardholderName').value;
        
        console.log('Processing card payment:', { 
            cardNumber: '****' + cardNumber.slice(-4), 
            amount: this.paymentData.pricing.total 
        });
        
        // Simulate API call
        await this.simulatePaymentProcessing();
        
        // Simulate success/failure (95% success rate)
        const success = Math.random() > 0.05;
        
        if (success) {
            return {
                success: true,
                paymentId: 'CARD-' + Date.now(),
                transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                message: 'Payment processed successfully'
            };
        } else {
            return {
                success: false,
                message: 'Card payment failed. Please check your card details and try again.'
            };
        }
    }
    
    async processBankTransfer() {
        // Process bank transfer (manual verification)
        const file = document.getElementById('bankReceipt').files[0];
        
        console.log('Processing bank transfer:', { 
            fileName: file.name,
            fileSize: file.size,
            reference: this.paymentData.reference 
        });
        
        // Simulate file upload
        await this.simulatePaymentProcessing();
        
        // Bank transfers are always "successful" but require manual verification
        return {
            success: true,
            paymentId: 'BANK-' + Date.now(),
            transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            message: 'Bank transfer receipt uploaded successfully. Your booking will be confirmed within 24 hours.',
            requiresVerification: true
        };
    }
    
    handleFileUpload(file) {
        if (!file) return;
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        
        if (file.size > maxSize) {
            this.showNotification('File size must be less than 5MB', 'error');
            document.getElementById('bankReceipt').value = '';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Please upload a JPG, PNG, or PDF file', 'error');
            document.getElementById('bankReceipt').value = '';
            return;
        }
        
        this.showNotification('File uploaded successfully', 'success');
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    }
    
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'flex';
    }
    
    showErrorModal(message) {
        const modal = document.getElementById('errorModal');
        document.getElementById('errorText').textContent = message;
        modal.style.display = 'flex';
    }
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    retryPayment() {
        this.closeModal();
        // Keep the form data, user can retry with corrected information
    }
    
    goToBookingConfirmation() {
        window.location.href = 'booking-confirmation.html';
    }
    
    goBack() {
        window.history.back();
    }
    
    editBooking() {
        window.location.href = 'seat-selection.html';
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

// Global functions
function processPayment() {
    if (window.paymentProcessor) {
        window.paymentProcessor.processPayment();
    }
}

function goBack() {
    if (window.paymentProcessor) {
        window.paymentProcessor.goBack();
    }
}

function editBooking() {
    if (window.paymentProcessor) {
        window.paymentProcessor.editBooking();
    }
}

function closeModal() {
    if (window.paymentProcessor) {
        window.paymentProcessor.closeModal();
    }
}

function retryPayment() {
    if (window.paymentProcessor) {
        window.paymentProcessor.retryPayment();
    }
}

function goToBookingConfirmation() {
    if (window.paymentProcessor) {
        window.paymentProcessor.goToBookingConfirmation();
    }
}

// Initialize payment processor
let paymentProcessor;

document.addEventListener('DOMContentLoaded', function() {
    paymentProcessor = new PaymentProcessor();
    window.paymentProcessor = paymentProcessor;
});

// Add payment styles
const paymentStyles = `
    .payment-section {
        padding: 2rem 0;
        background: #f8fafc;
        min-height: 80vh;
    }
    
    .payment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .payment-header h1 {
        color: #1f2937;
        font-size: 2rem;
        font-weight: 700;
    }
    
    .security-badges {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .badge i {
        font-size: 1rem;
    }
    
    .payment-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .order-summary {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        height: fit-content;
        position: sticky;
        top: 2rem;
    }
    
    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .summary-header h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .btn-edit {
        background: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-edit:hover {
        background: #3b82f6;
        color: white;
    }
    
    .booking-details {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .route-info {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .route-info .departure, .route-info .arrival {
        text-align: center;
    }
    
    .route-info .city {
        font-weight: 600;
        color: #1f2937;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
    }
    
    .route-info .terminal {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    
    .route-info .datetime {
        color: #374151;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .route-info .arrow {
        color: #3b82f6;
        font-size: 1.5rem;
    }
    
    .bus-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: #f8fafc;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .bus-info .company-logo {
        width: 40px;
        height: 40px;
        border-radius: 0.375rem;
        object-fit: cover;
    }
    
    .bus-info .company-details .name {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .bus-info .company-details .type {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .passenger-list h4 {
        color: #374151;
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    
    .passenger-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .passenger-item:last-child {
        border-bottom: none;
    }
    
    .passenger-info .name {
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
    }
    
    .passenger-info .details {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .passenger-price {
        font-weight: 600;
        color: #1f2937;
    }
    
    .price-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #374151;
        font-size: 0.9rem;
    }
    
    .price-item.total {
        font-weight: 700;
        font-size: 1.1rem;
        color: #1f2937;
        padding-top: 0.75rem;
        border-top: 2px solid #e5e7eb;
    }
    
    .price-item .price {
        font-weight: 600;
        color: #1f2937;
    }
    
    .payment-methods {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .payment-methods .payment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .payment-methods .payment-header h3 {
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .payment-icons {
        display: flex;
        gap: 0.5rem;
        font-size: 1.5rem;
        color: #6b7280;
    }
    
    .payment-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .payment-option {
        border: 2px solid #e5e7eb;
        border-radius: 0.75rem;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .payment-option:hover {
        border-color: #3b82f6;
    }
    
    .payment-option.active {
        border-color: #3b82f6;
        background: #f0f9ff;
    }
    
    .option-header {
        padding: 1rem;
    }
    
    .radio-group {
        display: flex;
        align-items: center;
    }
    
    .radio-group input[type="radio"] {
        margin-right: 1rem;
        transform: scale(1.2);
    }
    
    .radio-group label {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        flex: 1;
    }
    
    .payment-logo {
        width: 60px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f3f4f6;
        border-radius: 0.375rem;
    }
    
    .payment-logo img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    
    .payment-logo i {
        font-size: 1.5rem;
        color: #374151;
    }
    
    .payment-info {
        flex: 1;
    }
    
    .payment-name {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .payment-description {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    
    .payment-fee {
        color: #ef4444;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .payment-form {
        padding: 0 1rem 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        color: #374151;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group.error input {
        border-color: #ef4444;
    }
    
    .form-group small {
        display: block;
        color: #6b7280;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .bank-details {
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
    }
    
    .bank-details h4 {
        color: #374151;
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    
    .bank-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .bank-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
    }
    
    .bank-item .label {
        color: #6b7280;
        font-weight: 500;
    }
    
    .bank-item .value {
        color: #1f2937;
        font-weight: 600;
    }
    
    .upload-section {
        margin-top: 1rem;
    }
    
    .upload-section label {
        display: block;
        color: #374151;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .upload-section input[type="file"] {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.9rem;
    }
    
    .upload-section small {
        display: block;
        color: #6b7280;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .security-notice {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 2rem;
    }
    
    .security-notice i {
        color: #0369a1;
        font-size: 1.5rem;
    }
    
    .notice-content h4 {
        color: #0369a1;
        margin-bottom: 0.25rem;
        font-size: 1rem;
    }
    
    .notice-content p {
        color: #0c4a6e;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .payment-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .btn-back, .btn-pay {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-back {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .btn-back:hover {
        background: #e5e7eb;
    }
    
    .btn-pay {
        background: #10b981;
        color: white;
        border: none;
    }
    
    .btn-pay:hover {
        background: #059669;
        transform: translateY(-2px);
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
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #10b981;
        color: white;
        border: none;
    }
    
    .btn-primary:hover {
        background: #059669;
    }
    
    .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }
    
    .btn-secondary:hover {
        background: #e5e7eb;
    }
    
    @media (max-width: 768px) {
        .payment-content {
            grid-template-columns: 1fr;
        }
        
        .order-summary {
            position: static;
            margin-bottom: 2rem;
        }
        
        .payment-header {
            flex-direction: column;
            text-align: center;
        }
        
        .security-badges {
            justify-content: center;
        }
        
        .payment-actions {
            flex-direction: column;
        }
        
        .btn-back, .btn-pay {
            width: 100%;
            justify-content: center;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .route-info {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            text-align: center;
        }
        
        .route-info .arrow {
            transform: rotate(90deg);
            margin: 0.5rem 0;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStyles;
document.head.appendChild(styleSheet);