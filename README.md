# SelamBus - Ethiopian Bus Ticket Booking Platform

A complete, responsive bus ticket booking website designed specifically for the Ethiopian market. Built with modern web technologies and optimized for mobile users.

## 🚌 Project Overview

SelamBus is a comprehensive online platform that simplifies bus travel planning and booking in Ethiopia. The platform provides a user-friendly interface for searching buses, selecting seats, making payments, and managing bookings.

## ✨ Features

### Core Features
- **Landing Page**: Modern hero section with advanced search functionality
- **Search Results**: Advanced filtering and sorting for bus options
- **Seat Selection**: Interactive seat map with real-time availability
- **Payment Gateway**: Multiple payment methods including TeleBirr, CBE Birr, and bank transfers
- **Booking Confirmation**: E-ticket generation with QR codes
- **User Management**: Registration, login, and profile management
- **Admin Dashboard**: Comprehensive admin panel for managing buses, routes, and bookings
- **Responsive Design**: Mobile-first approach for optimal mobile experience

### Technical Features
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions
- **Security**: Secure payment processing and data protection

## 🚀 Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Chart.js (for admin analytics)
- QR Code generation
- PDF generation for tickets

### Database
- PostgreSQL (recommended)
- MySQL (alternative)

### Payment Integration
- TeleBirr API
- CBE Birr API
- Chapa API (for card payments)
- Bank transfer simulation

## 📁 Project Structure

```
selambus/
├── index.html                 # Landing page
├── search-results.html        # Search results page
├── seat-selection.html        # Seat selection page
├── payment.html               # Payment page
├── booking-confirmation.html  # Booking confirmation page
├── auth.html                  # Authentication page (login/register)
├── profile.html               # User profile page
├── admin.html                 # Admin dashboard
├── styles.css                 # Main stylesheet
├── script.js                  # Main JavaScript file
├── search-results.js          # Search results functionality
├── seat-map.js                # Seat selection functionality
├── payment.js                 # Payment processing
├── booking-confirmation.js    # Booking confirmation
├── auth.js                    # Authentication system
├── profile.js                 # Profile management
├── admin.js                   # Admin functionality
├── search-results.css         # Search results styles
├── payment.css                # Payment page styles
├── booking-confirmation.css   # Confirmation styles
├── auth.css                   # Authentication styles
├── profile.css                # Profile styles
├── admin.css                  # Admin dashboard styles
└── database-schema.sql        # Database schema
```

## 🛠️ Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for production deployment)
- Database server (PostgreSQL or MySQL)

### Local Development Setup

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd selambus
   ```

2. **Set up the database**
   - Install PostgreSQL or MySQL
   - Create a new database named `selambus`
   - Run the `database-schema.sql` file to create tables and insert sample data

3. **Configure database connection**
   - Update database connection details in relevant JavaScript files
   - Set up API endpoints for database operations

4. **Set up payment integration**
   - Obtain API keys from TeleBirr, CBE Birr, and Chapa
   - Configure payment endpoints in `payment.js`

5. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## 📋 Database Schema

The database includes tables for:
- **Users**: User accounts and authentication
- **Cities**: Ethiopian cities and bus stations
- **Bus Companies**: Transportation companies
- **Bus Types**: Different bus configurations (Economy, Business, Luxury)
- **Routes**: Bus routes between cities
- **Buses**: Individual bus information
- **Seat Configurations**: Bus seat layouts
- **Bookings**: User bookings
- **Passengers**: Passenger information
- **Payment Transactions**: Payment records

## 🔧 Configuration

### Cities Configuration
The system comes pre-configured with major Ethiopian cities:
- Addis Ababa
- Adama
- Hawassa
- Bahir Dar
- Gondar
- Mekele
- Dire Dawa

### Bus Companies
Sample bus companies included:
- Selam Bus
- Abay Bus
- Sky Bus
- Ethio Bus

### Payment Methods
- TeleBirr (Mobile money)
- CBE Birr (Commercial Bank of Ethiopia)
- Credit/Debit Cards (via Chapa)
- Bank Transfer

## 🎨 Customization

### Styling
- Primary colors can be customized in CSS variables
- Dark mode colors are automatically generated
- Responsive breakpoints are configured for mobile, tablet, and desktop

### Content
- City lists can be updated in JavaScript files
- Bus companies and routes can be modified in the database
- Payment integration details can be updated in configuration files

## 📱 Mobile Optimization

The platform is built with a mobile-first approach:
- Touch-friendly interface elements
- Optimized for small screens
- Fast loading on mobile networks
- Offline capability for basic features
- Progressive Web App (PWA) ready

## 🔒 Security Features

- HTTPS enforcement for payment pages
- Input validation and sanitization
- Secure session management
- CSRF protection
- XSS prevention
- SQL injection prevention

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@selambus.com
- Phone: +251 911 123456
- Website: https://selambus.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ethiopian bus companies for route information
- TeleBirr and CBE Birr for payment integration
- Chart.js for analytics visualization
- Font Awesome for icons
- Google Fonts for typography

## 📈 Future Enhancements

- Real-time bus tracking
- Multi-language support (Amharic, English, Oromo, Tigrinya)
- Loyalty program integration
- Social media integration
- Advanced analytics dashboard
- API for third-party integrations
- Mobile app development

---

**SelamBus** - Making bus travel in Ethiopia simple, secure, and efficient! 🚌✨