-- SelamBus Database Schema
-- Bus Ticket Booking System for Ethiopian Market

-- Create database
CREATE DATABASE IF NOT EXISTS selambus;
USE selambus;

-- Users table for both customers and admins
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cities/Station table
CREATE TABLE cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(50) NOT NULL,
    name_am VARCHAR(50) NOT NULL,
    region VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus companies table
CREATE TABLE bus_companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus types table
CREATE TABLE bus_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    seat_layout VARCHAR(20), -- '2x2', '2x1', '3x2'
    total_seats INT NOT NULL,
    amenities JSON, -- JSON array of amenities
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Routes table
CREATE TABLE routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_city_id INT NOT NULL,
    to_city_id INT NOT NULL,
    distance_km INT,
    estimated_duration_minutes INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_city_id) REFERENCES cities(id),
    FOREIGN KEY (to_city_id) REFERENCES cities(id)
);

-- Buses table
CREATE TABLE buses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    company_id INT NOT NULL,
    bus_type_id INT NOT NULL,
    route_id INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    departure_date DATE NOT NULL,
    price_economy DECIMAL(10,2) NOT NULL,
    price_business DECIMAL(10,2),
    price_luxury DECIMAL(10,2),
    available_seats INT NOT NULL,
    total_seats INT NOT NULL,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES bus_companies(id),
    FOREIGN KEY (bus_type_id) REFERENCES bus_types(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Seat configuration table
CREATE TABLE seat_configurations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_type_id INT NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    row_number INT NOT NULL,
    column_number INT NOT NULL,
    seat_type ENUM('economy', 'business', 'luxury', 'women_only') DEFAULT 'economy',
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (bus_type_id) REFERENCES bus_types(id)
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pnr_code VARCHAR(8) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('telebirr', 'cbe_birr', 'bank_transfer', 'card'),
    booking_status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    qr_code_url VARCHAR(255),
    ticket_pdf_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Passengers table
CREATE TABLE passengers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    seat_number VARCHAR(5) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (seat_id) REFERENCES seat_configurations(id)
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ETB',
    status ENUM('pending', 'success', 'failed', 'cancelled') DEFAULT 'pending',
    response_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Insert sample data
INSERT INTO cities (name_en, name_am, region) VALUES
('Addis Ababa', 'አዲስ አበባ', 'Addis Ababa'),
('Adama', 'አዳማ', 'Oromia'),
('Hawassa', 'ሀዋሳ', 'Sidama'),
('Bahir Dar', 'ባህር ዳር', 'Amhara'),
('Gondar', 'ጎንደር', 'Amhara'),
('Mekele', 'መቐለ', 'Tigray'),
('Dire Dawa', 'ድሬ ዳዋ', 'Dire Dawa'),
('Jimma', 'ጅማ', 'Oromia'),
('Dessie', 'ደሴ', 'Amhara'),
('Shashemene', 'ሻሸመኔ', 'Oromia');

INSERT INTO bus_companies (name, contact_phone, contact_email) VALUES
('Selam Bus Line', '+251111234567', 'info@selambus.com'),
('Golden Bus', '+251111234568', 'info@goldenbus.com'),
('Ethio Bus', '+251111234569', 'info@ethiobus.com'),
('Sky Bus', '+251111234570', 'info@skybus.com');

INSERT INTO bus_types (name, description, seat_layout, total_seats, amenities) VALUES
('Economy Coach', 'Standard economy class', '2x2', 48, '["WiFi", "AC", "Charging Port"]'),
('Business Coach', 'Premium business class', '2x1', 30, '["WiFi", "AC", "Charging Port", "Snack", "Toilet"]'),
('Luxury Sleeper', 'Luxury sleeper coach', '1x1', 24, '["WiFi", "AC", "Charging Port", "Snack", "Toilet", "Entertainment"]');

INSERT INTO routes (from_city_id, to_city_id, distance_km, estimated_duration_minutes) VALUES
(1, 2, 100, 120), -- Addis Ababa to Adama
(1, 3, 275, 300), -- Addis Ababa to Hawassa
(1, 4, 578, 480), -- Addis Ababa to Bahir Dar
(1, 5, 750, 600), -- Addis Ababa to Gondar
(1, 6, 850, 720), -- Addis Ababa to Mekele
(1, 7, 515, 420), -- Addis Ababa to Dire Dawa
(2, 3, 175, 180), -- Adama to Hawassa
(4, 5, 172, 150); -- Bahir Dar to Gondar