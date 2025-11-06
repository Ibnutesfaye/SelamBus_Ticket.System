# SelamBus Testing & Deployment Guide

## 🧪 Testing Guide

### Manual Testing Checklist

#### Landing Page Tests
- [ ] Search form validation works correctly
- [ ] City autocomplete suggestions appear
- [ ] Date picker disables past dates
- [ ] Round trip toggle functions properly
- [ ] Mobile menu works on small screens
- [ ] All links navigate correctly
- [ ] Hero section displays properly on all devices

#### Search Results Tests
- [ ] Search results load with sample data
- [ ] Filter functionality works (departure time, bus type, company, price)
- [ ] Sorting options function correctly
- [ ] Bus cards display all required information
- [ ] "Select Seats" buttons work
- [ ] Pagination works if many results
- [ ] Loading states appear during operations

#### Seat Selection Tests
- [ ] Seat map loads correctly for different bus types
- [ ] Available seats are clickable
- [ ] Selected seats change color
- [ ] Booked seats are disabled
- [ ] Price calculation updates correctly
- [ ] Passenger forms appear after seat selection
- [ ] Form validation works for passenger details
- [ ] "Proceed to Payment" button functions

#### Payment Tests
- [ ] Order summary displays correctly
- [ ] Payment method selection works
- [ ] Form validation for payment details
- [ ] Loading states during payment processing
- [ ] Success/failure messages appear appropriately
- [ ] Payment reference numbers generate correctly

#### Booking Confirmation Tests
- [ ] Booking details display correctly
- [ ] QR code generates properly
- [ ] Download ticket functionality works
- [ ] Email/SMS options function
- [ ] "Make Another Booking" button works

#### Authentication Tests
- [ ] Registration form validates correctly
- [ ] Login functionality works
- [ ] Password reset process functions
- [ ] Social login buttons work
- [ ] Session management works correctly
- [ ] Logout functionality works

#### Profile Management Tests
- [ ] Profile information displays correctly
- [ ] Edit profile functionality works
- [ ] Password change process functions
- [ ] Booking history displays properly
- [ ] Wallet functionality works
- [ ] Settings save correctly

#### Admin Dashboard Tests
- [ ] Admin login works separately from user login
- [ ] Dashboard statistics load correctly
- [ ] Navigation between sections works
- [ ] Data tables display properly
- [ ] CRUD operations function correctly
- [ ] Charts and analytics load
- [ ] Export functionality works

### Automated Testing Setup

#### Unit Tests (Jest)
```javascript
// Example test for seat selection
const SeatMapManager = require('./seat-map.js');

describe('SeatMapManager', () => {
    test('should calculate seat price correctly', () => {
        const manager = new SeatMapManager();
        const price = manager.calculateSeatPrice(2, 'Business');
        expect(price).toBe(1200); // 600 * 2
    });
    
    test('should validate seat selection', () => {
        const manager = new SeatMapManager();
        const isValid = manager.validateSeatSelection([1, 2]);
        expect(isValid).toBe(true);
    });
});
```

#### Integration Tests
```javascript
// Example integration test for booking flow
describe('Booking Flow', () => {
    test('should complete booking successfully', async () => {
        const bookingData = {
            route: 'Addis Ababa → Adama',
            seats: [1, 2],
            passengers: [
                { name: 'John Doe', age: 30, gender: 'Male' },
                { name: 'Jane Doe', age: 28, gender: 'Female' }
            ],
            paymentMethod: 'TeleBirr'
        };
        
        const result = await processBooking(bookingData);
        expect(result.status).toBe('success');
        expect(result.bookingId).toBeDefined();
    });
});
```

#### End-to-End Tests (Cypress)
```javascript
// Example E2E test
describe('User Journey', () => {
    it('should complete a full booking', () => {
        cy.visit('/');
        
        // Search for buses
        cy.get('#fromCity').type('Addis Ababa');
        cy.get('#toCity').type('Adama');
        cy.get('#departureDate').type('2024-01-15');
        cy.get('#searchBtn').click();
        
        // Select a bus
        cy.get('.bus-card').first().click();
        cy.get('.select-seats-btn').click();
        
        // Select seats
        cy.get('.seat.available').first().click();
        cy.get('.seat.available').eq(1).click();
        
        // Fill passenger details
        cy.get('#passengerName0').type('John Doe');
        cy.get('#passengerAge0').type('30');
        cy.get('#passengerGender0').select('Male');
        cy.get('#passengerName1').type('Jane Doe');
        cy.get('#passengerAge1').type('28');
        cy.get('#passengerGender1').select('Female');
        
        // Proceed to payment
        cy.get('#proceedToPayment').click();
        
        // Complete payment
        cy.get('#paymentMethod').select('TeleBirr');
        cy.get('#phoneNumber').type('+251911123456');
        cy.get('#completePayment').click();
        
        // Verify booking confirmation
        cy.get('.booking-confirmation').should('be.visible');
        cy.get('.booking-id').should('contain', 'BK');
    });
});
```

## 📱 Mobile Testing

### Device Testing Matrix
| Device | Screen Size | OS | Browser |
|--------|-------------|-----|---------|
| iPhone 12 | 390x844 | iOS 14+ | Safari, Chrome |
| Samsung Galaxy S21 | 360x800 | Android 11+ | Chrome, Firefox |
| iPad | 768x1024 | iOS 14+ | Safari, Chrome |
| Android Tablet | 800x1280 | Android 10+ | Chrome |

### Mobile-Specific Tests
- [ ] Touch interactions work correctly
- [ ] Swipe gestures function properly
- [ ] Keyboard doesn't obscure important content
- [ ] Form inputs are mobile-friendly
- [ ] Loading indicators are visible
- [ ] Offline functionality works
- [ ] PWA features function correctly

## 🚀 Deployment Guide

### Environment Setup

#### Production Environment Requirements
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **Database**: PostgreSQL 12+ or MySQL 8.0+
- **PHP**: 7.4+ (if using PHP backend)
- **Node.js**: 14+ (if using Node.js backend)
- **SSL Certificate**: Required for payment processing

#### Development Environment
```bash
# Install dependencies (if using Node.js)
npm install

# Install testing dependencies
npm install --save-dev jest cypress @testing-library/dom

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Database Deployment

#### PostgreSQL Setup
```sql
-- Create database
createdb selambus

-- Create user
create user selambus_user with encrypted password 'your_secure_password';

-- Grant privileges
grant all privileges on database selambus to selambus_user;

-- Import schema
psql -U selambus_user -d selambus -f database-schema.sql
```

#### MySQL Setup
```sql
-- Create database
CREATE DATABASE selambus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'selambus_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON selambus.* TO 'selambus_user'@'localhost';

-- Import schema
mysql -u selambus_user -p selambus < database-schema.sql
```

### Web Server Configuration

#### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName selambus.com
    DocumentRoot /var/www/selambus
    
    # Redirect HTTP to HTTPS
    Redirect permanent / https://selambus.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName selambus.com
    DocumentRoot /var/www/selambus
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    SSLCertificateChainFile /path/to/chain.crt
    
    # Security Headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # CORS Headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    
    # Cache Control
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # Gzip Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
        AddOutputFilterByType DEFLATE application/javascript application/json
        AddOutputFilterByType DEFLATE application/xml application/rss+xml
    </IfModule>
    
    # Directory Configuration
    <Directory /var/www/selambus>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Error Pages
    ErrorDocument 404 /404.html
    ErrorDocument 500 /500.html
</VirtualHost>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name selambus.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name selambus.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    
    # Document Root
    root /var/www/selambus;
    index index.html index.htm;
    
    # Security Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # CORS Headers
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache Control
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main Location Block
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Location (if using backend)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Error Pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /500.html;
}
```

### Environment Variables
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=selambus
DB_USER=selambus_user
DB_PASSWORD=your_secure_password

# Payment API Keys
TELEBIRR_API_KEY=your_telebirr_api_key
TELEBIRR_API_SECRET=your_telebirr_secret
CBE_BIRR_API_KEY=your_cbe_birr_api_key
CHAPA_API_KEY=your_chapa_api_key

# Application Settings
APP_ENV=production
APP_DEBUG=false
APP_URL=https://selambus.com

# Security Keys
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

### Deployment Steps

1. **Prepare the Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install required packages
   sudo apt install nginx postgresql nodejs npm
   
   # Create deployment user
   sudo useradd -m -s /bin/bash deploy
   sudo usermod -aG sudo deploy
   ```

2. **Set up SSL Certificate**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain certificate
   sudo certbot --nginx -d selambus.com -d www.selambus.com
   ```

3. **Deploy Application Files**
   ```bash
   # Clone repository
   git clone https://github.com/your-repo/selambus.git /var/www/selambus
   
   # Set permissions
   sudo chown -R www-data:www-data /var/www/selambus
   sudo chmod -R 755 /var/www/selambus
   
   # Create uploads directory
   sudo mkdir -p /var/www/selambus/uploads
   sudo chown www-data:www-data /var/www/selambus/uploads
   ```

4. **Configure Database**
   ```bash
   # Create database and user
   sudo -u postgres createdb selambus
   sudo -u postgres psql -c "CREATE USER selambus_user WITH PASSWORD 'secure_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE selambus TO selambus_user;"
   
   # Import schema
   sudo -u postgres psql -d selambus -f /var/www/selambus/database-schema.sql
   ```

5. **Start Services**
   ```bash
   # Restart web server
   sudo systemctl restart nginx
   
   # Enable auto-start
   sudo systemctl enable nginx
   sudo systemctl enable postgresql
   ```

### Post-Deployment Verification

1. **Health Checks**
   - [ ] Website loads correctly
   - [ ] SSL certificate is valid
   - [ ] Database connection works
   - [ ] Payment processing functions
   - [ ] Email notifications work
   - [ ] Admin dashboard loads

2. **Performance Tests**
   - [ ] Page load times under 3 seconds
   - [ ] Database queries optimized
   - [ ] CDN integration working
   - [ ] Caching configured properly

3. **Security Verification**
   - [ ] SSL certificate installed correctly
   - [ ] Security headers configured
   - [ ] Input validation working
   - [ ] SQL injection prevention active
   - [ ] XSS protection enabled

## 📊 Monitoring & Maintenance

### Monitoring Setup
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Performance Monitoring**: Google Analytics, GTmetrix
- **Error Tracking**: Sentry or Rollbar
- **Database Monitoring**: pgAdmin or MySQL Workbench

### Backup Strategy
- **Database**: Daily automated backups
- **Files**: Weekly full backups
- **Configuration**: Version controlled
- **Test Restores**: Monthly restore tests

### Update Process
1. Test updates in staging environment
2. Create backup before updating
3. Deploy during low-traffic hours
4. Monitor for issues post-deployment
5. Rollback if critical issues found

---

**Note**: This deployment guide assumes a Linux-based server. Adjust commands accordingly for other operating systems.